import os
from django import setup

# Set the DJANGO_SETTINGS_MODULE environment variable to your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
setup()

from backend.models import Category, AttributeType, AttributeValue, CategoryAttribute

# Create AttributeTypes if they don't exist
condition, _ = AttributeType.objects.get_or_create(name='Condition')
features, _ = AttributeType.objects.get_or_create(name='Features')
color, _ = AttributeType.objects.get_or_create(name='Color')
internal_storage, _ = AttributeType.objects.get_or_create(name='Internal Storage')

# Values for Condition
condition_values = ['Brand New', 'Refurbish', 'Used']
for value in condition_values:
    AttributeValue.objects.get_or_create(attribute_type=condition, value=value)

# Values for Features
features_values = ['Bluetooth 4.2', 'A2DP', 'LE', 'Fingerprint', 'IP67 dust/water resistance', 'NFC', 'Stereo Speakers']
for value in features_values:
    AttributeValue.objects.get_or_create(attribute_type=features, value=value)

# Values for Color
color_values = ['Blue', 'Black', 'Bronze', 'Gold', 'Gray', 'Green', 'Pink', 'Purple', 'Red', 'Rose Gold', 'Silver', 'Yellow', 'White', 'Other']
for value in color_values:
    AttributeValue.objects.get_or_create(attribute_type=color, value=value)

# Add Features attribute to specific iPhone categories
iphone_models = [
    'iPhone 6', 'iPhone 7', 'iPhone 8', 'iPhone 8 Plus', 'iPhone 7 Plus',
    'iPhone 6s Plus', 'iPhone 6s', 'iPhone 5s', 'iPhone 5c', 'iPhone 5',
    'iPhone 4s', 'iPhone 4 CDMA', 'iPhone 4', 'iPhone 3G', 'iPhone 3GS',
    'iPhone SE', 'iPhone SE(2020)', 'iPhone SE(2022)'
]

for model in iphone_models:
    try:
        category = Category.objects.get(name=model)
        feature_values = AttributeValue.objects.filter(attribute_type=features)  # Fetch all feature values
        for attribute_value in feature_values:
            CategoryAttribute.objects.get_or_create(category=category, attribute_type=features, attribute_value=attribute_value)
    except Category.DoesNotExist:
        logger.warning(f"Category '{model}' does not exist")
    except Exception as e:
        logger.error(f"Error adding feature attribute to '{model}': {e}")

# Add Color and Condition attributes to all iPhone models
all_iphone_models = [
    'iPhone 6', 'iPhone 6s', 'iPhone 7', 'iPhone 8', 'iPhone X', 'iPhone XS', 'iPhone XR',
    'iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15',
    'iPhone 13 Pro Max', 'iPhone 12 Pro Max', 'iPhone 11 Pro Max',
    'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 14 Pro Max', 'iPhone 15 Pro Max',
    'iPhone 14 Plus', 'iPhone 13 Pro', 'iPhone 13 Mini', 'iPhone 12 Pro',
    'iPhone 12 Mini', 'iPhone 11 Pro', 'iPhone XS Max', 'iPhone 8 Plus',
    'iPhone 7 Plus', 'iPhone 6s Plus', 'iPhone 5s', 'iPhone 5c',
    'iPhone 5', 'iPhone 4s', 'iPhone 4 CDMA', 'iPhone 4', 'iPhone 3G',
    'iPhone 3GS', 'iPhone SE', 'iPhone SE(2020)', 'iPhone SE(2022)',
    'iPhone 6 Plus', 'iPhone 6s Plus', 'iPhone 7 Plus', 'iPhone 8 Plus',
    'iPhone 11 Pro', 'iPhone 12 Mini', 'iPhone 12 Pro Max', 'iPhone 13 Mini',
    'iPhone 13 Pro', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
    'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max'
]

for model in all_iphone_models:
    try:
        category = Category.objects.get(name=model)
        color_values = AttributeValue.objects.filter(attribute_type=color)  # Fetch all color values
        condition_values = AttributeValue.objects.filter(attribute_type=condition)  # Fetch all condition values
        for color_value in color_values:
            CategoryAttribute.objects.get_or_create(category=category, attribute_type=color, attribute_value=color_value)
        for condition_value in condition_values:
            CategoryAttribute.objects.get_or_create(category=category, attribute_type=condition, attribute_value=condition_value)
    except Category.DoesNotExist:
        logger.warning(f"Category '{model}' does not exist")
    except Exception as e:
        logger.error(f"Error adding color/condition attributes to '{model}': {e}")

# Define the internal storage values for each iPhone model
iphone_storage_mapping = {
    'iPhone 6': ['16 GB', '32 GB', '64 GB', '128 GB'],
    'iPhone 7': ['32 GB', '128 GB', '256 GB'],
    'iPhone 8': ['64 GB', '128 GB', '256 GB'],
    'iPhone X': ['64 GB', '256 GB'],
    'iPhone XS': ['64 GB', '256 GB', '512 GB'],
    'iPhone XR': ['64 GB', '128 GB', '256 GB'],
    'iPhone 11': ['64 GB', '128 GB', '256 GB'],
    'iPhone 12': ['64 GB', '128 GB', '256 GB'],
    'iPhone 13': ['128 GB', '256 GB', '512 GB'],
    'iPhone 14': ['128 GB', '256 GB', '512 GB'],
    'iPhone 15': ['128 GB', '256 GB', '512 GB'],
    'iPhone 13 Pro Max': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 12 Pro Max': ['128 GB', '256 GB', '512 GB'],
    'iPhone 11 Pro Max': ['64 GB', '256 GB', '512 GB'],
    'iPhone 15 Pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 15 Plus': ['128 GB', '256 GB', '512 GB'],
    'iPhone 14 Pro Max': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 15 Pro Max': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 14 Plus': ['128 GB', '256 GB', '512 GB'],
    'iPhone 13 Pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 13 Mini': ['128 GB', '256 GB', '512 GB'],
    'iPhone 12 Pro': ['128 GB', '256 GB', '512 GB'],
    'iPhone 12 Mini': ['64 GB', '128 GB', '256 GB'],
    'iPhone 11 Pro': ['64 GB', '256 GB', '512 GB'],
    'iPhone XS Max': ['64 GB', '256 GB', '512 GB'],
    'iPhone 8 Plus': ['64 GB', '128 GB', '256 GB'],
    'iPhone 7 Plus': ['32 GB', '128 GB', '256 GB'],
    'iPhone 6s Plus': ['16 GB', '32 GB', '64 GB', '128 GB'],
    'iPhone 6s': ['16 GB', '32 GB', '64 GB', '128 GB'],
    'iPhone 5s': ['16 GB', '32 GB', '64 GB'],
    'iPhone 5c': ['8 GB', '16 GB', '32 GB'],
    'iPhone 5': ['16 GB', '32 GB', '64 GB'],
    'iPhone 4s': ['8 GB', '16 GB', '32 GB', '64 GB'],
    'iPhone 4 CDMA': ['8 GB', '16 GB', '32 GB'],
    'iPhone 4': ['8 GB', '16 GB', '32 GB'],
    'iPhone 3G': ['8 GB', '16 GB'],
    'iPhone 3GS': ['8 GB', '16 GB', '32 GB'],
    'iPhone SE': ['16 GB', '32 GB', '64 GB', '128 GB'],
    'iPhone SE(2020)': ['64 GB', '128 GB', '256 GB'],
    'iPhone SE(2022)': ['64 GB', '128 GB', '256 GB']
}

for model, storages in iphone_storage_mapping.items():
    try:
        category = Category.objects.get(name=model)
        for storage in storages:
            storage_value, _ = AttributeValue.objects.get_or_create(attribute_type=internal_storage, value=storage)
            CategoryAttribute.objects.get_or_create(category=category, attribute_type=internal_storage, attribute_value=storage_value)
    except Category.DoesNotExist:
        print(f"Category '{model}' does not exist")
    except Exception as e:
        print(f"Error adding internal storage attributes to '{model}': {e}")