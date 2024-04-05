# admin.py

from django.contrib import admin
from .models import User, Product

# Admin class for User model
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'firstname', 'lastname', 'email', 'session_id', 'reset_token', 'date_joined')
    search_fields = ('email', 'firstname', 'lastname')

# Admin class for Product model
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'price', 'category',
                     'negotiable', 'seller', 'image')
    list_filter = ('category', 'negotiable')
    search_fields = ('description', 'category', 'title')
    

from .models import User, Product, Category


# Register User model with UserAdmin class
admin.site.register(User, UserAdmin)

# Register Product model with ProductAdmin class
admin.site.register(Product, ProductAdmin)
