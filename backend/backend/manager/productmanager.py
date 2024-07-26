from django.db import models
from ..models import Product, Image, ProductAttribute, AttributeValue, CategoryAttribute
from random import sample
from django.db.models import Q


class ProductManager(models.Manager):
    def create_product(self, title, description, price, category_id, user_id, image, images, attribute_data, location_id):
        try:
            # Ensure category_id is not empty
            if not category_id:
                raise ValueError("category_id must not be empty")
            if not image:
                raise ValueError("image must not be empty")
        
            # Create the Product instance
            product = Product.objects.create(
            title=title,
            description=description,
            price=price,
            category_id=category_id,
            seller_id=user_id,
            image=image,
            location_id=location_id
        )

            # Save additional images
            for image_file in images:
                Image.objects.create(product=product, image_file=image_file)

            # Associate attributes with the product
            for attribute_type_id, attribute_value_ids in attribute_data.items():
                for attribute_value_id in attribute_value_ids:
                    try:
                        # Fetch the attribute value object
                        attribute_value = AttributeValue.objects.get(id=attribute_value_id)

                        # Fetch or create the CategoryAttribute linking category, attribute type, and attribute value
                        category_attribute, created = CategoryAttribute.objects.get_or_create(
                            category_id=category_id,
                            attribute_type_id=attribute_type_id,
                            attribute_value_id=attribute_value_id
                        )

                        # Link the attribute value to the product
                        ProductAttribute.objects.create(
                            product=product,
                            category_attribute=category_attribute,
                            value=attribute_value
                        )

                    except AttributeValue.DoesNotExist:
                        print(f"AttributeValue with id {attribute_value_id} does not exist.")
                    continue
        
            return product

        except Exception as e:
            # Log the exception or handle it as needed
            print(f"Error creating product: {e}")
            return None


    def get_products(self):
        products = sample(list(Product.objects.all()), 6)

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
        # Serialize each image separately or extract the URLs
        image_urls = [image.image_file.url for image in product.images.all()]

        # Categorize product attributes
        attributes = {}
        # Enhanced Debugging: Print all attributes and their types linked to the product
        for product_attribute in product.productattribute_set.select_related('category_attribute__attribute_type', 'value').all():
            # Get the name of the attribute type and the value
            attribute_type_name = product_attribute.category_attribute.attribute_type.name
            attribute_value = product_attribute.value.value

            # Debugging: Print each product attribute type and value
            print(f"Attribute Type: {attribute_type_name}, Attribute Value: {attribute_value}")

            # Check if the attribute type is already in the dictionary
            if attribute_type_name not in attributes:
                attributes[attribute_type_name] = []

            # Append the attribute value to the list of values for this attribute type
            attributes[attribute_type_name].append(attribute_value)

        # Debugging: Print the final grouped attributes
        print("Grouped Attributes by Type:", attributes)
        product_details = {
                'id': product.id,
                'description': product.description,
                'price': product.price,
                'image': product.image.url,
                'seller': seller.firstname + ' ' + seller.lastname,
                'phone': seller.phone_no,
                'product_name': product.product_name,
                'title': product.title,
                'images': image_urls,
                'negotiable': product.negotiable,
                'attributes': attributes
        }
        print(product.image.url)
        
        return product_details
    
    def get_user_product_by_id(self, id):
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

        return product_details_list
