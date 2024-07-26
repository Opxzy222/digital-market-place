from django.http import (JsonResponse, HttpResponseBadRequest, 
                         HttpResponseForbidden)
from django.views import View
from ..manager.user import DB_user
from django.shortcuts import redirect
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from ..models import (Category, Product, Shop, ProductSuggestion,
                    ShopProduct, User, Message, Conversation, Subcategory)
from ..manager.shopmanager import ShopManager, ShopProductManager, MessageManager
from ..manager.productmanager import ProductManager
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_GET, require_POST
from collections import defaultdict
from django.contrib.gis.geos import Point
from decimal import Decimal, InvalidOperation
import logging
import json
from django.db.models import OuterRef, Subquery, Max
from django.db.models.functions import Coalesce
from django.db.models import Q

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)


class CreateShopView(View):
    @method_decorator(csrf_exempt)  # Exempt from CSRF token verification for simplicity
    def post(self, request, *args, **kwargs):
        # Extract data from the POST request
        shop_owner = request.POST.get('shop_owner')
        shop_name = request.POST.get('shop_name')
        description = request.POST.get('description')
        geo_location = request.POST.get('geo_location')
        address = request.POST.get('address')
        subcategories = request.POST.getlist('subcategories[]')

        # Check if all required fields are provided
        if not all([shop_owner, shop_name, description, geo_location, address, subcategories]):
            return HttpResponseBadRequest('All fields are required')

        try:
            # Create a new shop using the ShopManager
            shop_manager = ShopManager()
            new_shop = shop_manager.createShop(
                shop_owner=shop_owner,
                shop_name=shop_name,
                description=description,
                geo_location=geo_location,
                address=address,
                subcategories=subcategories
            )

            if new_shop:
                # Return a success response with the new shop details
                return JsonResponse({'status': 'success', 'shop_id': new_shop.id, 'message': 'Shop created successfully'}, status=201)
            else:
                # Return an error response if shop creation failed
                return JsonResponse({'status': 'error', 'message': 'Failed to create shop'}, status=500)
        except Exception as e:
            print(e)
            return JsonResponse({'status': 'error', 'message': 'An error occurred'}, status=500)
        
class ShopCategoryView(View):
    def get(self, request, *args, **kwargs):
        categories = ShopManager.display_shop_categories()
        category_list = [
            {
                'id': category_id,
                'name': category_name,
                'count': count
            }
            for category_id_name, count in categories.items()
            for category_id, category_name in [category_id_name.split('_')]
        ]
        return JsonResponse(category_list, safe=False)

class AllShopCategoryView(View):
    def get(self, request, *args, **kwargs):
        categories = ShopManager.display_all_shop_categories()
        category_list = [
            {
                'id': category_id,
                'name': category_name,
                'count': count
            }
            for category_id_name, count in categories.items()
            for category_id, category_name in [category_id_name.split('_')]
        ]
        return JsonResponse(category_list, safe=False)

class ProductSuggestionsView(View):
    def post(self, request):
        shop_id = request.POST.get('shop_id')
        try:
            shop = Shop.objects.get(id=shop_id)

            # Fetch the categories associated with the shop
            shop_categories = shop.category.all()

            if not shop_categories.exists():
                return JsonResponse({'error': 'No categories associated with this shop'}, status=400)

            # Fetch product suggestions for the shop's categories
            product_suggestions = ProductSuggestion.objects.filter(category__in=shop_categories).select_related('category', 'subcategory')

            # Group product suggestions by category and subcategory
            grouped_suggestions = defaultdict(lambda: defaultdict(list))
            for suggestion in product_suggestions:
                grouped_suggestions[suggestion.category.name][suggestion.subcategory.name].append({
                    'id': suggestion.id,
                    'name': suggestion.name,
                    'category_id': suggestion.category.id,
                    'subcategory_id': suggestion.subcategory.id
                })

            # Fetch selected products with is_available, price, category, subcategory, and custom_name
            selected_products = ShopProduct.objects.filter(shop=shop).select_related('subcategory', 'product_suggestion__category').values(
                'product_suggestion_id', 'custom_name', 'is_available', 'price',
                'product_suggestion__name', 'product_suggestion__category__name', 'product_suggestion__category__id',
                'subcategory__name', 'subcategory_id'
            )

            selected_products_list = []
            for product in selected_products:
                # Determine the category_id, handling cases where there might not be a product suggestion
                category_id = product.get('product_suggestion__category__id')
                if category_id is None:
                    if product['product_suggestion_id'] is None and product['custom_name']:
                        # Log the handling of custom products
                        logger.debug(f"Handling custom product: {product['custom_name']}")

                        # Modify this logic as per your application's needs to determine the category of custom products
                        subcategory_id = product['subcategory_id']
                        subcategory = Subcategory.objects.filter(id=subcategory_id).first()
                        if subcategory:
                            category_id = subcategory.category.id
                            logger.debug(f"Found category ID {category_id} for subcategory ID {subcategory_id}")

                # Ensure the subcategory belongs to the category
                subcategory_id = product.get('subcategory_id')
                subcategory_name = product.get('subcategory__name')
                if subcategory_id:
                    subcategory = Subcategory.objects.filter(id=subcategory_id, category_id=category_id).first()
                    if subcategory:
                        subcategory_name = subcategory.name
                    else:
                        available_subcategories = Subcategory.objects.filter(category_id=category_id).values_list('id', flat=True)
                        logger.error(f"Subcategory with ID {subcategory_id} in category ID {category_id} not found. Available subcategories: {list(available_subcategories)}")
                        return JsonResponse({'error': 'Subcategory mismatch'}, status=400)

                # Fetch category name if it's not available
                category_name = product.get('product_suggestion__category__name')
                if category_name is None and category_id is not None:
                    category = Category.objects.filter(id=category_id).first()
                    if category:
                        category_name = category.name

                selected_products_list.append({
                    'product_suggestion_id': product['product_suggestion_id'],
                    'custom_name': product['custom_name'],
                    'is_available': product['is_available'],
                    'price': product['price'],
                    'product_name': product['product_suggestion__name'],
                    'category_name': category_name,
                    'category_id': category_id,
                    'subcategory_name': subcategory_name,
                    'subcategory_id': subcategory_id
                })

            response_data = {
                'product_suggestions': {k: dict(v) for k, v in grouped_suggestions.items()},
                'selected_products': selected_products_list,
            }
            print(selected_products_list)
            print(grouped_suggestions.items())
            return JsonResponse(response_data)
        except Shop.DoesNotExist:
            return JsonResponse({'error': 'Shop not found'}, status=404)
        except Exception as e:
            logger.exception("An error occurred while processing product suggestions.")
            return JsonResponse({'error': str(e)}, status=500)

        
@method_decorator(csrf_exempt, name='dispatch')
class AddProductToShopView(View):
    def post(self, request):
        shop_id = request.POST.get('shop_id')
        product_suggestion_ids = request.POST.getlist('product_suggestions[]')  # List of product suggestion IDs
        custom_products = request.POST.getlist('custom_products[]')  # List of custom product names
        is_available_map = request.POST.dict()  # Convert POST data to dictionary
        print(product_suggestion_ids)
        print(custom_products)

        try:
            shop = Shop.objects.get(id=shop_id)

            # Add product suggestions to the shop
            for product_suggestion_id in product_suggestion_ids:
                try:
                    product_suggestion = ProductSuggestion.objects.get(id=product_suggestion_id)
                    is_available = is_available_map.get(f'is_available_{product_suggestion_id}', 'true').lower() == 'true'
                    ShopProduct.objects.create(shop=shop, product_suggestion=product_suggestion, is_available=is_available)
                except ProductSuggestion.DoesNotExist:
                    continue  # Skip invalid product suggestions

            # Add custom products to the shop
            for index, custom_name in enumerate(custom_products):
                if custom_name:  # Ensure the custom name is not empty
                    is_available = is_available_map.get(f'is_available_custom_{index}', 'true').lower() == 'true'
                    ShopProduct.objects.create(shop=shop, custom_name=custom_name, is_available=is_available)

            return JsonResponse({'message': 'Products added successfully'}, status=201)
        except Shop.DoesNotExist:
            return JsonResponse({'error': 'Shop not found'}, status=404)
        
class ShopProductView(View):
    def post(self, request):
        shop_id = request.POST.get('shop_id')
        shop_products = ShopProduct.objects.filter(shop_id=shop_id)

        # Group products by category and subcategory
        categorized_products = defaultdict(lambda: defaultdict(list))
        for product in shop_products:
            category = 'Uncategorized'
            subcategory = 'Uncategorized'
            
            if product.product_suggestion:
                if product.product_suggestion.category:
                    category = product.product_suggestion.category.name
                if product.product_suggestion.subcategory:
                    subcategory = product.product_suggestion.subcategory.name
            elif product.subcategory:
                category = product.subcategory.category.name
                subcategory = product.subcategory.name

            product_data = {
                'id': product.id,
                'product_name': product.custom_name or product.product_suggestion.name,
                'is_available': product.is_available,
                'price': product.price,
            }
            categorized_products[category][subcategory].append(product_data)

        categorized_products_list = [
            {'category': category, 'subcategories': [{'subcategory': subcategory, 'products': products} for subcategory, products in subcategories.items()]}
            for category, subcategories in categorized_products.items()
        ]
        
        print(categorized_products_list)
        return JsonResponse(categorized_products_list, safe=False)
    
class ShopProductCountView(View):
    def post(self, request):
        user_id = request.POST.get('user_id')  # Corrected this line
        if not user_id:
            return JsonResponse({'error': 'user_id is required'}, status=400)
        
        shops = Shop.objects.filter(owner_id=user_id)
        shop_list = []
        for shop in shops:
            product_count = ShopProduct.objects.filter(shop=shop, is_available=True).count()
            shop_list.append({
                'id': shop.id,
                'name': shop.name,
                'product_count': product_count,
            })
        return JsonResponse(shop_list, safe=False)
    
class UpdateShopProductsView(View):
    def post(self, request):
        logger.debug('Received request data: %s', request.POST)

        shop_id = request.POST.get('shop_id')
        product_suggestion_ids = request.POST.getlist('product_suggestions[]')
        custom_products = request.POST.getlist('custom_products[]')

        logger.debug('Shop ID: %s', shop_id)
        logger.debug('Product Suggestion IDs: %s', product_suggestion_ids)
        logger.debug('Custom Products: %s', custom_products)

        try:
            shop = Shop.objects.get(id=shop_id)
            logger.debug('Shop found: %s', shop)

            # Clear existing product suggestions for the shop
            ShopProduct.objects.filter(shop=shop).delete()
            logger.debug('Existing products cleared for shop: %s', shop)

            # Add product suggestions to the shop
            for product_suggestion_id in product_suggestion_ids:
                if product_suggestion_id:
                    try:
                        product_suggestion = ProductSuggestion.objects.get(id=product_suggestion_id)
                        is_available = request.POST.get(f'is_available_{product_suggestion_id}') == 'true'
                        price = request.POST.get(f'price_{product_suggestion_id}', '')

                        logger.debug('Processing product suggestion: %s', product_suggestion)

                        if price and price != 'undefined':
                            try:
                                price = Decimal(price)
                                logger.debug('Parsed price for product suggestion: %s', price)
                            except InvalidOperation:
                                logger.error('Invalid price value for product suggestion: %s', product_suggestion.name)
                                return JsonResponse({'error': f'Invalid price value for product suggestion: {product_suggestion.name}'}, status=400)
                        else:
                            price = None  # Set price to None if it's an empty string or 'undefined'

                        ShopProduct.objects.create(shop=shop, product_suggestion=product_suggestion, is_available=is_available, price=price)
                        logger.debug('Created ShopProduct for suggestion: %s', product_suggestion)
                    except ProductSuggestion.DoesNotExist:
                        logger.warning('Product suggestion does not exist: %s', product_suggestion_id)
                        continue

            # Add custom products to the shop
            for index, custom_name in enumerate(custom_products):
                if custom_name:
                    is_available = request.POST.get(f'is_available_custom_{index}') == 'true'
                    price = request.POST.get(f'price_custom_{index}', '')
                    category_id = request.POST.get(f'category_custom_{index}', '')
                    subcategory_id = request.POST.get(f'subcategory_custom_{index}', '')

                    logger.debug('Processing custom product: %s', custom_name)
                    logger.debug('Category ID: %s, Subcategory ID: %s', category_id, subcategory_id)

                    if price and price != 'undefined':
                        try:
                            price = Decimal(price)
                            logger.debug('Parsed price for custom product: %s', price)
                        except InvalidOperation:
                            logger.error('Invalid price value for custom product: %s', custom_name)
                            return JsonResponse({'error': f'Invalid price value for custom product: {custom_name}'}, status=400)
                    else:
                        price = None  # Set price to None if it's an empty string or 'undefined'

                    subcategory_obj = None
                    if category_id:
                        try:
                            category = Category.objects.get(id=category_id)
                            if subcategory_id:
                                subcategory_obj = Subcategory.objects.get(id=subcategory_id, category=category)
                                logger.debug('Found subcategory: %s', subcategory_obj)
                            else:
                                logger.error('Subcategory must be provided if category is given')
                                return JsonResponse({'error': 'Subcategory must be provided if category is given'}, status=400)
                        except Category.DoesNotExist:
                            logger.error('Category with ID %s not found', category_id)
                            return JsonResponse({'error': f'Category with ID {category_id} not found'}, status=400)
                        except Subcategory.DoesNotExist:
                            logger.error('Subcategory with ID %s in category ID %s not found. Available subcategories: %s',
                                         subcategory_id, category_id,
                                         list(Subcategory.objects.filter(category=category).values('id', 'name')))
                            return JsonResponse({'error': f'Subcategory with ID {subcategory_id} in category ID {category_id} not found'}, status=400)

                    ShopProduct.objects.create(shop=shop, custom_name=custom_name, is_available=is_available, price=price, subcategory=subcategory_obj)
                    logger.debug('Created ShopProduct for custom product: %s', custom_name)

            return JsonResponse({'message': 'Products updated successfully'}, status=201)
        except Shop.DoesNotExist:
            logger.error('Shop not found: %s', shop_id)
            return JsonResponse({'error': 'Shop not found'}, status=404)
        except ValueError as e:
            logger.error('Value error: %s', str(e))
            return JsonResponse({'error': 'Invalid input data'}, status=400)
        
class SearchProductView(View):
    @method_decorator(require_GET)
    def get(self, request):
        try:
            search_term = request.GET.get('input', '')
            latitude = float(request.GET.get('lat', 0.0))
            longitude = float(request.GET.get('lon', 0.0))

            logger.debug(f"Received search term: {search_term}, Latitude: {latitude}, Longitude: {longitude}")

            if not search_term or latitude == 0.0 or longitude == 0.0:
                return JsonResponse({'error': 'Invalid search parameters'}, status=400)

            shop_product_manager = ShopProductManager()
            buyer_location = {'latitude': latitude, 'longitude': longitude}
            shops = shop_product_manager.search_products(search_term, buyer_location)

            result = []
            for shop in shops:
                categories = list(shop.category.values('id', 'name'))
                shop_data = {
                    'id': shop.id,
                    'name': shop.name,
                    'description': shop.description,
                    'address': shop.address,
                    'distance': shop.distance,  # Ensure the distance is an integer
                    'image': shop.image.url if shop.image else '',
                    'categories': categories,
                    'products': []
                }

                for product in shop.prefetched_products:
                    product_data = {
                        'id': product.id,
                        'name': product.custom_name if product.custom_name else (
                            product.product_suggestion.name if product.product_suggestion else 'Unknown Product'
                        ),
                        'is_available': product.is_available
                    }
                    shop_data['products'].append(product_data)

                result.append(shop_data)

            logger.debug(f"Search results: {result}")

            response = JsonResponse(result, safe=False)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'

            return response

        except Exception as e:
            logger.error("Error during product search", exc_info=True)
            return JsonResponse({'error': 'An error occurred during the search.'}, status=500)
        
class MessageView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(require_GET)
    def get(self, request):
        try:
            user_id = request.GET.get('user_id')
            shop_id = request.GET.get('shop_id')
            if not user_id or not shop_id:
                return JsonResponse({'error': 'Missing user_id or shop_id parameter'}, status=400)

            message_manager = MessageManager()
            messages = message_manager.get_user_messages(user_id, shop_id)

            result = []
            for message in messages:
                message_data = {
                    'id': message.id,
                    'sender_id': message.sender.id,
                    'receiver_id': message.receiver.id,
                    'sender': message.sender.fullname,
                    'receiver': message.receiver.fullname,
                    'shop': message.shop.name,
                    'content': message.content,
                    'timestamp': message.timestamp,
                    'read': message.read
                }
                result.append(message_data)

            return JsonResponse(result, safe=False)

        except Exception as e:
            logger.error("Error fetching messages", exc_info=True)
            return JsonResponse({'error': 'An error occurred while fetching messages.'}, status=500)

    @method_decorator(csrf_exempt)
    @method_decorator(require_POST)
    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            sender_id = data.get('sender_id')
            shop_id = data.get('shop_id')
            content = data.get('content')

            if not sender_id or not shop_id or not content:
                return JsonResponse({'error': 'Missing parameters'}, status=400)

            shop = Shop.objects.get(id=shop_id)
            receiver_id = shop.owner.id

            message_manager = MessageManager()
            conversation = message_manager.get_or_create_conversation(sender_id, shop_id)
            message = message_manager.send_message(sender_id, receiver_id, conversation.id, content)

            message_data = {
                'id': message.id,
                'sender_id': message.sender.id,
                'receiver_id': message.receiver.id,
                'sender': message.sender.fullname,
                'receiver': message.receiver.fullname,
                'shop': message.shop.name,
                'content': message.content,
                'timestamp': message.timestamp,
                'read': message.read
            }

            return JsonResponse(message_data, status=201)

        except ValueError as ve:
            logger.error("Error sending message: %s", ve, exc_info=True)
            return JsonResponse({'error': str(ve)}, status=400)

        except Exception as e:
            logger.error("Error sending message", exc_info=True)
            return JsonResponse({'error': 'An error occurred while sending the message.'}, status=500)
        
class MessageListView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(require_GET)
    def get(self, request):
        try:
            user_id = request.GET.get('user_id')
            logging.info(f'User ID: {user_id}')
            if not user_id:
                return JsonResponse({'error': 'Missing user_id parameter'}, status=400)

            user = User.objects.get(id=user_id)
            logging.info(f'User: {user}')

            messages = Message.objects.filter(
                Q(sender=user) | Q(receiver=user) | Q(shop__owner=user)
            ).order_by('-timestamp')

            logging.info(f'Messages: {messages}')

            result = []

            for message in messages:
                conversation = message.conversation
                if user == message.sender or user == message.shop.owner:
                    result.append({
                        'id': message.id,
                        'name': conversation.user_initial_name if user == message.shop.owner else conversation.shop_initial_name,
                        'last_message': message.content,
                        'date': message.timestamp,
                        'conversation_id': message.conversation_id,
                    })
                else:
                    result.append({
                        'id': message.id,
                        'name': conversation.shop_initial_name if user == message.receiver else conversation.user_initial_name,
                        'last_message': message.content,
                        'date': message.timestamp,
                        'conversation_id': message.conversation_id,
                    })

            logging.info(f'Result before removing duplicates: {result}')

            # Remove duplicates based on conversation_id, keeping only the most recent message
            unique_conversations = {}
            for res in result:
                conversation_id = res['conversation_id']
                if conversation_id not in unique_conversations:
                    unique_conversations[conversation_id] = res
                elif res['date'] > unique_conversations[conversation_id]['date']:
                    unique_conversations[conversation_id] = res

            unique_result = list(unique_conversations.values())

            logging.info(f'Unique result before sorting: {unique_result}')

            # Sort the unique_result list by date in descending order
            unique_result.sort(key=lambda x: x['date'], reverse=True)

            logging.info(f'Unique result after sorting: {unique_result}')

            return JsonResponse(unique_result, safe=False)

        except Exception as e:
            logging.error(f'Error occurred: {e}')
            return JsonResponse({'error': 'An error occurred while fetching messages.'}, status=500)
