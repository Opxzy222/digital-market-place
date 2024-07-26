from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.db.models import Q
from django.apps import apps
import json
import logging
from ..manager.shopmanager import MessageManager
from ..manager.ShopManager1 import ShopProductManager
from ..models import (Shop, Message, Category, ShopProduct, Review,
                       User, Follower, ShopPost, ShopPostMedia, RecentlyVisitedShop)
from django.db.models import F
from collections import defaultdict
from django.shortcuts import get_object_or_404
from django.utils import timezone

logger = logging.getLogger(__name__)

class ConversationView(View):
    @method_decorator(csrf_exempt)
    @method_decorator(require_GET)
    def get(self, request):
        try:
            conversation_id = request.GET.get('conversation_id')
            if not conversation_id:
                return JsonResponse({'error': 'Missing conversation_id parameter'}, status=400)

            message_manager = MessageManager()
            messages = message_manager.get_conversation_messages(conversation_id)

            result = []
            for message in messages:
                message_data = {
                    'id': message.id,
                    'sender_id': message.sender.id,
                    'receiver_id': message.receiver.id,
                    'sender_name': message.sender_name,
                    'receiver_name': message.receiver_name,
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
            conversation_id = data.get('shop_id')
            sender_id = data.get('sender_id')
            content = data.get('content')

            if not conversation_id or not sender_id or not content:
                return JsonResponse({'error': 'Missing parameters'}, status=400)

            message_manager = MessageManager()
            message = message_manager.send_messages(conversation_id, sender_id, content)

            message_data = {
                'id': message.id,
                'sender_id': message.sender.id,
                'receiver_id': message.receiver.id,
                'sender_name': message.sender_name,
                'receiver_name': message.receiver_name,
                'content': message.content,
                'timestamp': message.timestamp,
                'read': message.read
            }

            return JsonResponse(message_data, status=201)

        except Exception as e:
            logger.error("Error sending message", exc_info=True)
            return JsonResponse({'error': 'An error occurred while sending the message.'}, status=500)

class MarkMessagesReadView(View):
    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
            conversation_id = data.get('conversation_id')
            user_id = data.get('user_id')

            if not conversation_id or not user_id:
                return JsonResponse({'error': 'Missing parameters'}, status=400)

            Message.objects.filter(conversation_id=conversation_id, receiver_id=user_id, read=False).update(read=True)
            return JsonResponse({'status': 'success'}, status=200)

        except Exception as e:
            return JsonResponse({'error': 'An error occurred while marking messages as read.'}, status=500)
        
class UnreadMessagesView(View):
    @method_decorator(require_POST)
    @method_decorator(csrf_exempt)
    def post(self, request):
        try:
            user_id = request.POST.get('user_id')
            if not user_id:
                return JsonResponse({'error': 'Missing user_id parameter'}, status=400)
            
            unread_count = Message.objects.filter(receiver_id=user_id, read=False).values('conversation_id').distinct().count()
            return JsonResponse({'unread_count': unread_count})
        
        except Exception as e:
            return JsonResponse({'error': 'An error occurred while getting unread messages.'}, status=500)
        
class GetShopSubcategoriesView(View):
    def get(self, request, category_id):
        try:
            subcategories_data = Category.objects.filter(parent_id=category_id).values('id', 'name')
           
            return JsonResponse(list(subcategories_data), safe=False)
        except Category.DoesNotExist:
            return JsonResponse({'error': 'Category not found'}, status=404)
        
class CategoryShopSearchView(View):
    @method_decorator(require_GET)
    def get(self, request):
        try:
            category_id = request.GET.get('subcategory_id', '')
            latitude = float(request.GET.get('lat', 0.0))
            longitude = float(request.GET.get('lon', 0.0))

            logger.debug(f"Received category ID: {category_id}, Latitude: {latitude}, Longitude: {longitude}")

            if not category_id or latitude == 0.0 or longitude == 0.0:
                return JsonResponse({'error': 'Invalid search parameters'}, status=400)

            shop_product_manager = ShopProductManager()
            buyer_location = {'latitude': latitude, 'longitude': longitude}
            shops = shop_product_manager.search_shops_by_category(category_id, buyer_location)

            result = []
            for shop in shops:
                categories = list(shop.category.values('id', 'name'))
                shop_data = {
                    'id': shop.id,
                    'name': shop.name,
                    'description': shop.description,
                    'address': shop.address,
                    'distance': shop.distance,  # Convert distance to meters
                    'image': shop.image.url if shop.image else '',
                    'categories': categories,
                    'products': []
                }

                for product in shop.matched_products:
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

            # Return response with no-cache headers
            response = JsonResponse(result, safe=False)
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'

            return response

        except Exception as e:
            logger.error("Error during shop search by category", exc_info=True)
            return JsonResponse({'error': 'An error occurred during the search.'}, status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class ShopDeleteView(View):
    def delete(self, request, shop_id):
        try:
            shop = Shop.objects.get(id=shop_id)
            shop.delete()
            return JsonResponse({'message': 'Shop deleted successfully.'}, status=204)
        except Shop.DoesNotExist:
            return JsonResponse({'error': 'Shop not found.'}, status=404)
        
class ShopDetailView(View):
    def get(self, request, shop_id):
        try:
            shop = Shop.objects.get(id=shop_id)
            categories = list(shop.category.values('id', 'name'))
            shop_data = {
                'id': shop.id,
                'name': shop.name,
                'description': shop.description,
                'image': shop.image.url if shop.image else None,
                'categories': categories,
            }

            # Get products and categorize them
            products = ShopProduct.objects.filter(shop=shop)
            categorized_products = defaultdict(lambda: defaultdict(list))

            for product in products:
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

                # Display the custom name if available; otherwise, use the product suggestion's name or "Unnamed Product"
                product_name = product.custom_name if product.custom_name else (
                    product.product_suggestion.name if product.product_suggestion else 'Unnamed Product'
                )

                product_data = {
                    'id': product.id,
                    'product_name': product_name,
                    'is_available': product.is_available,
                    'price': product.price,
                }
                categorized_products[category][subcategory].append(product_data)

            categorized_products_list = [
                {'category': category, 'subcategories': [{'subcategory': subcategory, 'products': products} for subcategory, products in subcategories.items()]}
                for category, subcategories in categorized_products.items()
            ]

            shop_data['products'] = categorized_products_list

            return JsonResponse(shop_data, safe=False)

        except Shop.DoesNotExist:
            return JsonResponse({'error': 'Shop not found'}, status=404)
        except Exception as e:
            # Log the error for debugging
            print(f"Error occurred while fetching shop details: {str(e)}")
            return JsonResponse({'error': 'An error occurred while fetching shop details'}, status=500)

class SubmitReviewView(View):
    def post(self, request):
        try:
            shop_id = request.POST.get('shop')
            user_id = request.POST.get('user')
            rating = request.POST.get('rating')
            comment = request.POST.get('comment')

            print(shop_id, user_id, rating, comment)

            if not shop_id or not user_id or not rating:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            shop = get_object_or_404(Shop, id=shop_id)
            user = get_object_or_404(User, id=user_id)
            rating = int(rating)

            review = Review.objects.create(shop=shop, reviewer=user, rating=rating, comment=comment)
            review_data = {
                'id': review.id,
                'reviewer__fullname': user.fullname,
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }

            return JsonResponse(review_data, status=201)

        except Exception as e:
            print(f"Error occurred while submitting review: {str(e)}")
            return JsonResponse({'error': 'An error occurred while submitting review'}, status=500)

class ShopReviewsView(View):
    def get(self, request, shop_id):
        try:
            shop = get_object_or_404(Shop, id=shop_id)
            reviews = shop.reviews.all()
            reviews_data = [
                {
                    'id': review.id,
                    'reviewer__fullname': review.reviewer.fullname,
                    'rating': review.rating,
                    'comment': review.comment,
                    'created_at': review.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                }
                for review in reviews
            ]
            return JsonResponse({'reviews': reviews_data}, status=200)
        except Exception as e:
            print(f"Error occurred while fetching reviews: {str(e)}")
            return JsonResponse({'error': 'An error occurred while fetching reviews'}, status=500) 
        
class FollowShopView(View):
    def post(self, request):
        shop_id = request.POST.get('shop_id')
        user_id = request.POST.get('user_id')
        shop = get_object_or_404(Shop, id=shop_id)
        user = get_object_or_404(User, id=user_id)
        
        follower, created = Follower.objects.get_or_create(shop=shop, user=user)
        
        if created:
            return JsonResponse({'status': 'following'}, status=201)
        else:
            follower.delete()
            return JsonResponse({'status': 'unfollowed'}, status=200)

class ShopFollowersView(View):
    def get(self, request, shop_id):
        shop = get_object_or_404(Shop, id=shop_id)
        followers = shop.followers.select_related('user').all()
        
        followers_data = [{'username': follower.user.fullname} for follower in followers]
        return JsonResponse({'followers': followers_data, 'count': followers.count()}, status=200) 

class FollowingStatusView(View):
    def get(self, request, shop_id):
        user_id = request.GET.get('user_id')
        user = get_object_or_404(User, id=user_id)
        shop = get_object_or_404(Shop, id=shop_id)
    
        is_following = Follower.objects.filter(user=user, shop=shop).exists()
    
        return JsonResponse({'following': is_following})
    
class SubmitPostView(View):
    def post(self, request, *args, **kwargs):
        try:
            shop_id = kwargs.get('shop_id')
            description = request.POST.get('description')
            files = request.FILES.getlist('files')

            if not shop_id or not description:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            shop = get_object_or_404(Shop, id=shop_id)
            post = ShopPost.objects.create(shop=shop, description=description)

            for file in files:
                ShopPostMedia.objects.create(post=post, file=file)

            post_data = {
                'id': post.id,
                'description': post.description,
                'media': [{'url': media.file.url} for media in post.media.all()],
                'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            }

            return JsonResponse(post_data, status=201)

        except Exception as e:
            print(f"Error occurred while submitting post: {str(e)}")
            return JsonResponse({'error': 'An error occurred while submitting post'}, status=500)
        
class ShopPostsView(View):
    def get(self, request, shop_id):
        try:
            shop = get_object_or_404(Shop, id=shop_id)
            posts = shop.posts.all()

            posts_data = [
                {
                    'id': post.id,
                    'description': post.description,
                    'media': [{'url': media.file.url} for media in post.media.all()],
                    'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                } for post in posts
            ]
            print(posts_data)

            return JsonResponse({'posts': posts_data}, status=200)

        except Exception as e:
            print(f"Error occurred while retrieving posts: {str(e)}")
            return JsonResponse({'error': 'An error occurred while retrieving posts'}, status=500)

    def delete(self, request, shop_id, post_id):
        try:
            shop = get_object_or_404(Shop, id=shop_id)
            post = get_object_or_404(ShopPost, id=post_id, shop=shop)
            post.delete()
            return JsonResponse({'message': 'Post deleted successfully'}, status=204)
        except Exception as e:
            print(f"Error occurred while deleting post: {str(e)}")
            return JsonResponse({'error': 'An error occurred while deleting the post'}, status=500)
        
class RecentlyVisitedView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            shop_id = data.get('shop_id')
            user_id = data.get('user_id')
            print(shop_id)
            print(user_id, 'errr')

            if not shop_id or not user_id:
                return JsonResponse({'error': 'Missing shop_id or user_id'}, status=400)

            shop = get_object_or_404(Shop, id=shop_id)
            user = get_object_or_404(User, id=user_id)
    
            RecentlyVisitedShop.objects.update_or_create(user=user, shop=shop, defaults={'visited_at': timezone.now()})
            return JsonResponse({'message': 'Shop marked as visited'}, status=200)
        except Exception as e:
            print(f"Error occurred while visiting shop: {str(e)}")
            return JsonResponse({'error': 'An error occurred while visiting shop'}, status=500)
     
class RecentlyVisitedShopsView(View):
    def get(self, request, user_id):
        try:
            user = get_object_or_404(User, id=user_id)
            recently_visited_shops = RecentlyVisitedShop.objects.filter(user=user).select_related('shop').order_by('-visited_at')

            shops_data = []
            for rv in recently_visited_shops:
                shop = rv.shop
                categories = list(shop.category.values('id', 'name'))
                shops_data.append({
                    'id': shop.id,
                    'name': shop.name,
                    'description': shop.description,
                    'image': shop.image.url if shop.image else None,
                    'categories': categories,
                    'visited_at': rv.visited_at
                })

            return JsonResponse({'recently_visited_shops': shops_data}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)