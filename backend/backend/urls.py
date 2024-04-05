from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import (CreateUserView, LoginView, LogoutView,
                     GetResetTokenView, UpdatePasswordView, 
                     CreateProductView, CategoriesDropDownOptionsView,
                     SubCategoriesView, ProductView, SubcategoriesCountView,
                     DisplayProductView, SearchView, GetProductView)

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
    path('category-product-count/', ProductView.as_view(), name='product_count'),
    path('product-search/', SearchView.as_view(), name='product_search'),
    path('product/', GetProductView.as_view(), name='get_product'),
    path('subcategories-product-count/', SubcategoriesCountView.as_view(), 
         name='subcategories_product_count')
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)