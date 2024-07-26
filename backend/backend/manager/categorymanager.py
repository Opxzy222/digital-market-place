from django.db import models
from ..models import Category, CategoryAttribute, AttributeType, AttributeValue
from django.shortcuts import get_object_or_404



class CategoryManager(models.Manager):
    def display_categories():
        # Define the category IDs to display
        category_ids_to_display = [1, 2, 3, 4, 5, 7, 6, 8, 9, 10, 11, 12, 13, 134, 142]

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
    
    def categories_attribute(self, category_id):
        category = get_object_or_404(Category, id=category_id)
        attributes = CategoryAttribute.objects.filter(category=category).select_related('attribute_type', 'attribute_value')

        attribute_data = []

     # Create a dictionary to store unique attribute types and their values
        attribute_dict = {}

        for attribute in attributes:
            attribute_type = attribute.attribute_type
            attribute_value = attribute.attribute_value

            # Initialize a list for this attribute type if it doesn't exist
            if attribute_type not in attribute_dict:
                attribute_dict[attribute_type] = []

            # Add the attribute value if it's not already in the list
            if attribute_value not in attribute_dict[attribute_type]:
                attribute_dict[attribute_type].append(attribute_value)

        # Convert the dictionary to the desired format
        for attribute_type, values in attribute_dict.items():
            value_data = [{'id': value.id, 'value': value.value} for value in values]

            attribute_data.append({
                'id': attribute_type.id,  # Assuming you want the id of the attribute type here
                'name': attribute_type.name,
                'values': value_data
        })

        return attribute_data