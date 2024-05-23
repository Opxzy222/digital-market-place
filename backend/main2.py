import os
from django import setup

# Set the DJANGO_SETTINGS_MODULE environment variable to your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
setup()

from backend.models import Category, Product

import os
from django import setup

# Set the DJANGO_SETTINGS_MODULE environment variable to your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
setup()

from backend.models import Category
import uuid
from backend.user import DB_user
from django.db.models import Q

def get_user_product_by_id(id):
    # Filter products by seller ID
    products = Product.objects.filter(seller=id)

    # Initialize an empty list to store product details
    product_details_list = []

    # Iterate over each product in the queryset
    for product in products:
        seller = product.seller

        # Create a dictionary containing product details
        product_details = {
            'id': product.id,
            'description': product.description,
            'price': product.price,
            'image': product.image.url,
            'seller': seller.firstname + ' ' + seller.lastname,
            'product_name': product.product_name,
            'title': product.title,
            'negotiable': product.negotiable
        }

        # Append product details dictionary to the list
        product_details_list.append(product_details)

    # Print or return the list of product details
    print(product_details_list)
    return product_details_list

get_user_product_by_id(1)
