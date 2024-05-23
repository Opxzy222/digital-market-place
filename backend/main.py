import os
from django import setup

# Set the DJANGO_SETTINGS_MODULE environment variable to your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
setup()

from backend.models import Category, Product
from django.db.models import Count




    

from django.db.models import Count
from random import sample

def get_products():
        products = sample(list(Product.objects.all()), 20)
        product_data = [
            {
             'title': product.title,
             'price': product.price,
             'description': product.description,
             'id': product.id, 
             'image': product.image.url 
        }
        for product in products
        ]

        print(product_data)

        return product_data

get_products()