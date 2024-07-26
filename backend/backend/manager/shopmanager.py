from django.db import models
from ..models import Category, ProductSuggestion, ShopProduct, Shop, User, Message
from django.db.models import Q, Prefetch
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
import logging
from django.apps import apps
from django.contrib.auth import get_user_model
from math import radians, sin, cos, sqrt, atan2
import math

logger = logging.getLogger(__name__)

class ShopManager(models.Manager):
    def createShop(self, shop_owner, shop_name, description, geo_location, address, subcategories):
        try:
            shop_owner = User.objects.get(id=shop_owner)
            # Parse the geo_location string into a Point object
            # Assuming geo_location is in the format 'POINT(lon lat)'
            lon, lat = map(float, geo_location.replace('POINT(', '').replace(')', '').split())
            point = Point(lon, lat, srid=4326)
            
            # Create a new Shop instance with the provided details
            shop = Shop.objects.create(
                owner=shop_owner,
                name=shop_name,
                description=description,
                geo_location=point,  # Use the Point object here
                address=address,
            )
            # Add subcategories to the shop
            for subcategory_id in subcategories:
                subcategory = Category.objects.get(id=subcategory_id)
                shop.category.add(subcategory)
            return shop
        except Exception as e:
            # Print the exception and return None if an error occurs
            print(e)
            return None
        
    def display_shop_categories():
        # Define the category IDs to display
        category_ids_to_display = [1, 2, 3, 152, 7, 6, 8, 9, 10, 11, 140, 141]

        # Query the categories from the database using the IDs
        categories_to_display = Category.objects.filter(id__in=category_ids_to_display)

        # Create a dictionary to store category information
        category_info = {}

        # Iterate over each category
        for category in categories_to_display:
            # Calculate the total count of products for the current category
            total_count = int(category.product_count())

            # Concatenate category ID and name as the key
            category_key = f"{category.id}_{category.name}"

            # Store the category ID, name, and count in the dictionary
            category_info[category_key] = total_count

        return category_info
    
    def display_all_shop_categories():
        # Define the category IDs to display
        category_ids_to_display = [1, 2, 3, 152, 7, 6, 8, 9, 10, 11, 140, 141, 142, 143, 144,
                                   145, 149, 139, 136, 12, 13, 5, 12]

        # Query the categories from the database using the IDs
        categories_to_display = Category.objects.filter(id__in=category_ids_to_display)

        # Create a dictionary to store category information
        category_info = {}

        # Iterate over each category
        for category in categories_to_display:
            # Calculate the total count of products for the current category
            total_count = int(category.product_count())

            # Concatenate category ID and name as the key
            category_key = f"{category.id}_{category.name}"

            # Store the category ID, name, and count in the dictionary
            category_info[category_key] = total_count

        return category_info
    
class ProductSuggestionManager(models.Manager):
    def get_suggestions_for_category(self, category):
        return self.filter(category=category)

# Haversine formula to calculate the distance between two points
# Haversine formula to calculate the distance between two points
def haversine(lon1, lat1, lon2, lat2):
    R = 6371000  # Radius of the Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c  # Distance in meters
    return distance

class ShopProductManager(models.Manager):
    def get_shop_products_by_id(self, shop_id):
        return ShopProduct.objects.filter(shop=shop_id)

    def get_matching_shops(self, term, exclude_categories=False):
        query = Q(shopproduct__product_suggestion__name__icontains=term) | Q(shopproduct__custom_name__icontains=term)
        if exclude_categories:
            query &= ~Q(category__name__iexact=term)

        return Shop.objects.filter(query).distinct()

    def annotate_and_order_by_haversine_distance(self, shops, buyer_location):
        buyer_point = Point(buyer_location['longitude'], buyer_location['latitude'], srid=4326)
        buyer_lon, buyer_lat = buyer_point.x, buyer_point.y

        # Add a distance attribute to each shop using the Haversine formula
        shops_with_distance = []
        for shop in shops:
            shop_lon, shop_lat = shop.geo_location.x, shop.geo_location.y
            distance = haversine(shop_lon, shop_lat, buyer_lon, buyer_lat)
            shop.distance = int(distance)  # Truncate distance to nearest integer
            shops_with_distance.append(shop)

        # Sort shops by distance
        shops_with_distance.sort(key=lambda s: s.distance)

        for shop in shops_with_distance:
            logger.debug(f"Shop: {shop.name}, Geo Location: {shop.geo_location}, Distance: {shop.distance} meters")

        return shops_with_distance

    def search_products(self, search_term, buyer_location):
        # Exact matches first
        exact_match_shops = list(self.get_matching_shops(search_term, exclude_categories=True))
        exact_match_shops = self.annotate_and_order_by_haversine_distance(exact_match_shops, buyer_location)

        for shop in exact_match_shops:
            shop.prefetched_products = list(shop.shopproduct_set.filter(
                Q(product_suggestion__name__icontains=search_term) |
                Q(custom_name__icontains=search_term),
                is_available=True
            ))

        if exact_match_shops:
            return exact_match_shops

        # Partial matches
        partial_match_shops = []
        for i in range(len(search_term), 0, -1):
            partial_term = search_term[:i]
            shops = list(self.get_matching_shops(partial_term, exclude_categories=True))
            shops = self.annotate_and_order_by_haversine_distance(shops, buyer_location)

            for shop in shops:
                shop.prefetched_products = list(shop.shopproduct_set.filter(
                    Q(product_suggestion__name__icontains=partial_term) |
                    Q(custom_name__icontains=partial_term),
                    is_available=True
                ))

            partial_match_shops.extend(shops)

        if partial_match_shops:
            return partial_match_shops

        # Broad matches
        broad_match_shops = list(self.get_matching_shops(search_term[:1], exclude_categories=True))
        broad_match_shops = self.annotate_and_order_by_haversine_distance(broad_match_shops, buyer_location)

        for shop in broad_match_shops:
            shop.prefetched_products = list(shop.shopproduct_set.filter(
                Q(product_suggestion__name__icontains=search_term[:1]) |
                Q(custom_name__icontains=search_term[:1]),
                is_available=True
            ))

        return broad_match_shops

class MessageManager:
    def get_or_create_conversation(self, user_id, shop_id):
        Conversation = apps.get_model('backend', 'Conversation')
        User = apps.get_model('backend', 'User')
        Shop = apps.get_model('backend', 'Shop')

        user = User.objects.get(id=user_id)
        shop = Shop.objects.get(id=shop_id)
        
        conversation, created = Conversation.objects.get_or_create(
            user_id=user_id,
            shop_id=shop_id,
            user_initial_name=user.fullname,
            shop_initial_name=shop.name
        )
        print(user.fullname)
        print(shop.name)

        return conversation

    def send_message(self, sender_id, receiver_id, conversation_id, content):
        Message = apps.get_model('backend', 'Message')
        Conversation = apps.get_model('backend', 'Conversation')

        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            raise ValueError("Conversation does not exist")

        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            conversation=conversation,
            shop=conversation.shop,
            content=content
        )
        return message

    def get_user_messages(self, user_id, shop_id):
        Message = apps.get_model('backend', 'Message')
        return Message.objects.filter(
            Q(sender_id=user_id) | Q(receiver_id=user_id),
            shop_id=shop_id
        ).order_by('timestamp')

    def get_conversation_messages(self, conversation_id):
        Message = apps.get_model('backend', 'Message')
        return Message.objects.filter(conversation_id=conversation_id).order_by('timestamp')

    def send_messages(self, conversation_id, sender_id, content):
        Message = apps.get_model('backend', 'Message')
        Conversation = apps.get_model('backend', 'Conversation')

        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            raise ValueError("Conversation does not exist")

        sender = User.objects.get(id=sender_id)
        if sender == conversation.user:
            receiver = conversation.shop.owner
        else:
            receiver = conversation.user

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            conversation=conversation,
            shop=conversation.shop,
            content=content,
        )
        return message
    
    def send_message(self, sender_id, receiver_id, conversation_id, content):
        Message = apps.get_model('backend', 'Message')
        Conversation = apps.get_model('backend', 'Conversation')

        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            raise ValueError("Conversation does not exist")

        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            conversation=conversation,
            shop=conversation.shop,
            content=content
        )
        return message
    
    def get_user_messages(self, user_id, shop_id):
        Message = apps.get_model('backend', 'Message')
        return Message.objects.filter(
            Q(sender_id=user_id) | Q(receiver_id=user_id),
            shop_id=shop_id
        ).order_by('timestamp')

    def get_conversation_messages(self, conversation_id):
        Message = apps.get_model('backend', 'Message')
        return Message.objects.filter(conversation_id=conversation_id).order_by('timestamp')