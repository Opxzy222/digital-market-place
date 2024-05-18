from django.db import models
from .models import Category



class CategoryManager(models.Manager):
    def display_categories():
        # Define the category IDs to display
        category_ids_to_display = [1, 3, 4, 5, 7, 6, 8, 9, 10, 11, 12, 13, 14]

        # Query the categories from the database using the IDs
        categories_to_display = Category.objects.filter(id__in=category_ids_to_display)

        # Create a dictionary to store category information
        category_info = {}

        # Iterate over each category
        for category in categories_to_display:
            # Calculate the total count of products for the current category
            total_count = int(category.product_count())

            # Concatenate category ID and name as the key
            category_key = f"{category.id}_{category.name}"

            # Store the category ID, name, and count in the dictionary
            category_info[category_key] = total_count

        return category_info

    def get_subcategories_with_product_count(self, category_id):
        # Retrieve the parent category object
        children_category = Category.objects.filter(parent_id=category_id)

        data = {}
        
        for child_category in children_category:
            child_count = int(child_category.product_count())
            # Add the data for each child category to the dictionary
            data[child_category.id] = {
                'id': child_category.id,
                'name': child_category.name,
                'product_count': child_count
            }

        return data