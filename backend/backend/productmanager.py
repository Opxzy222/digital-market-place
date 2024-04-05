from django.db import models
from .models import Product
from random import sample
from django.db.models import Q


class ProductManager(models.Manager):
    def create_product(self, title, description, price, category_id, user_id, image):
        try:
            # Ensure category_ids is not empty
            if not category_id:
                raise ValueError("category_ids must not be empty")
            if not image:
                raise ValueError('image must not be empty')


            product = Product.objects.create(
                title=title,
                description=description,
                price=price,
                category_id=category_id,
                seller_id=user_id,
                image=image
            )
            return product
        except Exception as e:
            print(e)

    def get_products(self):
        products = sample(list(Product.objects.all()), 20)

        product_data = [
            {
             'title': product.title,
             'price': product.price,
             'description': product.description,
             'seller_id': product.seller_id, 
             'image': product.image.url,
             'id': product.id
        }
        for product in products
        ]

        return product_data
    
    def search_products_by_name(self, search_input):
        # Split the search input by spaces
        keywords = search_input.split()

        # Create a Q object to dynamically construct the query
        query = Q()
        for keyword in keywords:
            query &= Q(product_name__icontains=keyword)

        # Filter products based on the constructed query
        products = Product.objects.filter(query)

        # Get the count of items found
        items_found = products.count()
        print(f'Number of items found: {items_found}')

        # Serialize the products to JSON
        serialized_products = [
            {
                'id': product.id,
                'description': product.description,
                'price': product.price,
                'category_id': product.category_id,
                'negotiable': product.negotiable,
                'seller_id': product.seller_id,
                'image': product.image.url,
                'product_name': product.product_name,
                'title': product.title,
                'total_count': items_found
            }
            for product in products
        ]

        return serialized_products

    def get_product_by_id(self, id):
        # get product by id and return the product details
        product = Product.objects.get(id=id)

        seller = product.seller

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
        
        return product_details