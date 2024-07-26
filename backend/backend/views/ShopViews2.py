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
from rest_framework.decorators import api_view

logger = logging.getLogger(__name__)

@api_view(['GET'])
def shop_combined_view(request, shop_id):
    try:
        shop = get_object_or_404(Shop, id=shop_id)
        
        # Shop Details
        categories = list(shop.category.values('id', 'name'))
        shop_data = {
            'id': shop.id,
            'name': shop.name,
            'description': shop.description,
            'image': shop.image.url if shop.image else None,
            'categories': categories,
        }

        # Products
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

        # Reviews
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

        # Followers
        followers = shop.followers.select_related('user').all()
        followers_data = [{'username': follower.user.fullname} for follower in followers]
        follower_count = followers.count()

        # Posts
        posts = shop.posts.all()
        posts_data = [
            {
                'id': post.id,
                'description': post.description,
                'media': [{'url': media.file.url} for media in post.media.all()],
                'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            } for post in posts
        ]

        response_data = {
            'shop': shop_data,
            'reviews': reviews_data,
            'followers': followers_data,
            'follower_count': follower_count,
            'posts': posts_data,
        }

        return JsonResponse(response_data, status=200, safe=False)
    
    except Shop.DoesNotExist:
        return JsonResponse({'error': 'Shop not found'}, status=404)
    except Exception as e:
        print(f"Error occurred while fetching combined shop data: {str(e)}")
        return JsonResponse({'error': 'An error occurred while fetching combined shop data'}, status=500)

@api_view(['POST'])
def mark_shop_as_visited(request):
    try:
        data = request.data
        shop_id = data.get('shop_id')
        user_id = data.get('user_id')

        if not shop_id or not user_id:
            return JsonResponse({'error': 'Missing shop_id or user_id'}, status=400)

        shop = get_object_or_404(Shop, id=shop_id)
        user = get_object_or_404(User, id=user_id)

        RecentlyVisitedShop.objects.update_or_create(user=user, shop=shop, defaults={'visited_at': timezone.now()})
        return JsonResponse({'message': 'Shop marked as visited'}, status=200)
    except Exception as e:
        print(f"Error occurred while marking shop as visited: {str(e)}")
        return JsonResponse({'error': 'An error occurred while marking shop as visited'}, status=500)
    
class UserFollowedShopsView(View):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            followed_shops = user.following_shops.all().select_related('shop').order_by('shop__name')
            
            result = []
            for follow in followed_shops:
                shop = follow.shop
                shop_data = {
                    'id': shop.id,
                    'name': shop.name,
                    'image': shop.image.url if shop.image else ''
                }
                result.append(shop_data)
                
            return JsonResponse(result, safe=False)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': 'An error occurred.'}, status=500)