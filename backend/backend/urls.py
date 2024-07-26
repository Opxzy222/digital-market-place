"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls')).
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views.Views import (CreateUserView, LoginView, LogoutView,
                     GetResetTokenView, UpdatePasswordView, 
                     CreateProductView, CategoriesDropDownOptionsView,
                     SubCategoriesView, CategoryView, SubcategoriesCountView,
                     DisplayProductView, SearchView, GetProductView,
                     GetUserProductView, GetCategoryAttribute)
from .views.ShopViews import (CreateShopView, ShopCategoryView, AddProductToShopView,
                              ProductSuggestionsView, ShopProductView, ShopProductCountView,
                              UpdateShopProductsView, SearchProductView, MessageView, MessageListView,
                              AllShopCategoryView)
from .views.ShopViews1 import (ConversationView, MarkMessagesReadView, UnreadMessagesView,
                                GetShopSubcategoriesView, CategoryShopSearchView, ShopDeleteView,
                                SubmitReviewView, FollowShopView, SubmitPostView,
                                  RecentlyVisitedShopsView, FollowingStatusView, ShopDetailView,
                                    ShopFollowersView, ShopPostsView, RecentlyVisitedShop, ShopReviewsView,
                                    RecentlyVisitedView)
from .views.ShopViews2 import shop_combined_view, mark_shop_as_visited, UserFollowedShopsView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('create-user/', CreateUserView.as_view(), name='create_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('reset-token/', GetResetTokenView.as_view(), name='reset_token'),
    path('reset-password/', UpdatePasswordView.as_view(), name='reset_password'),
    path('create-product/', CreateProductView.as_view(), name='create_product'),
    path('display-products/', DisplayProductView.as_view(), name='display_products'),
    path('category/dropdown-options/', CategoriesDropDownOptionsView.as_view(), 
         name='category_dropdown_options'),
    path('category/subcategories/', SubCategoriesView.as_view(), name='subcategories'),
    path('category-product-count/', CategoryView.as_view(), name='product_count'),
    path('product-search/', SearchView.as_view(), name='product_search'),
    path('product/', GetProductView.as_view(), name='get_product'),
    path('user-products/', GetUserProductView.as_view(), name='get_user_product'),
    path('subcategories-product-count/', SubcategoriesCountView.as_view(), 
         name='subcategories_product_count'),
    path('category/attribute/', GetCategoryAttribute.as_view(), name='category_attribute'),

    path('create-shop/', CreateShopView.as_view(), name='create_shop'),
    path('shop-categories/', ShopCategoryView.as_view(), name='shop_categories'),
    path('all-shop-categories/', AllShopCategoryView.as_view(), name='all_shop_categories'),
    path('add-product-to-shop/', AddProductToShopView.as_view(), name='add_product_to_shop'),
    path('product-suggestion/', ProductSuggestionsView.as_view(), name='product_suggestion'),
    path('shops-product-count/', ShopProductCountView.as_view(), name='shop_product_count'),
    path('shop-products/', ShopProductView.as_view(), name='shop_product'),
    path('update-shop-products/', UpdateShopProductsView.as_view(), name='update_shop_products'),
    path('shop-product-search/', SearchProductView.as_view(), name='shop_product_search'),
    path('messages/', MessageView.as_view(), name='messages'),
    path('message-list/', MessageListView.as_view(), name='message_list'),
    path('conversation/', ConversationView.as_view(), name='conversation'),
    path('mark-messages-read/', MarkMessagesReadView.as_view(), name='mark_messages_read'),
    path('unread-messages/', UnreadMessagesView.as_view(), name='unread_messages'),
    path('shop-subcategories/<int:category_id>/', GetShopSubcategoriesView.as_view(), name='shop_subcategories'),
    path('shop-category-search/', CategoryShopSearchView.as_view(), name='shop_category_search'),
    path('close-shop/<int:shop_id>/', ShopDeleteView.as_view(), name='close_shop'),
    path('shops/<int:shop_id>/', ShopDetailView.as_view(), name='shop-detail'),
    path('shops/<int:shop_id>/reviews/', ShopReviewsView.as_view(), name='shop_reviews'),
    path('shops/reviews/submit/', SubmitReviewView.as_view(), name='submit_review'),
    path('shops/follow/', FollowShopView.as_view(), name='follow_shop'),
    #path('shops/<int:shop_id>/followers/', ShopFollowersView.as_view(), name='shop_followers'),
    path('shops/<int:shop_id>/followers-status/',FollowingStatusView.as_view(), name='check_following_status'),
    path('shops/<int:shop_id>/posts/', ShopPostsView.as_view(), name='shop_posts_list'),
    path('shops/<int:shop_id>/posts/create/', SubmitPostView.as_view(), name='submit_post'),
    path('shops/<int:shop_id>/posts/<int:post_id>/', ShopPostsView.as_view(), name='delete_post'),
    path('shops/recently-visited/', RecentlyVisitedView.as_view(), name='recently_visited'),
    path('shops/recently-visited/<int:user_id>/', RecentlyVisitedShopsView.as_view(), name='user_recently_visited_shops'),
    path('shops/<int:shop_id>/combined/', shop_combined_view, name='shop_combined_view'),
    path('shops/recently-visited/', mark_shop_as_visited, name='mark_shop_as_visited'),
    path('shops/followed/<int:user_id>/', UserFollowedShopsView.as_view(), name='user-followed-shops'),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)