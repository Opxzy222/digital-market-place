# admin.py

from django.contrib import admin
from .models import User, Product

# Admin class for User model
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'firstname', 'lastname', 'email', 'date_joined')
    search_fields = ('email', 'firstname', 'lastname')

# Admin class for Product model
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'price', 'category',
                     'negotiable', 'seller', 'get_image_names', 'product_name')
    list_filter = ('category', 'negotiable')
    search_fields = ('description', 'title', 'product_name')

    def get_image_names(self, obj):
        
        return ', '.join([image.image_file.name for image in obj.images.all()])
    
    get_image_names.short_description = 'Images'
    

from .models import User, Product, Category


# Register User model with UserAdmin class
admin.site.register(User, UserAdmin)

# Register Product model with ProductAdmin class
admin.site.register(Product, ProductAdmin)
