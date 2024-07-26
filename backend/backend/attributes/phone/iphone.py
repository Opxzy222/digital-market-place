condition = AttributeType.objects.create(name='Condition')
features = AttributeType.objects.create(name='Features')

# Values for Condition
condition_values = ['Brand New', 'Refurbish', 'Used']
for value in condition_values:
    AttributeValue.objects.create(attribute_type=condition, value=value)

# Values for Features
features_values = ['Bluetooth 4.2', 'A2DP', 'LE', 'Fingerprint', 'IP67 dust/water resistance', 'NFC', 'Stereo Speakers']
for value in features_values:
    AttributeValue.objects.create(attribute_type=features, value=value)



# Adding 'Features' attribute to specific iPhone categories
iphone_models = [
    'iPhone 6', 'iPhone 7', 'iPhone 8', 'iPhone 8 Plus', 'iPhone 7 Plus',
    'iPhone 6s Plus', 'iPhone 6s', 'iPhone 5s', 'iPhone 5c', 'iPhone 5',
    'iPhone 4s', 'iPhone 4 CDMA', 'iPhone 4', 'iPhone 3G', 'iPhone 3GS',
    'iPhone SE', 'iPhone SE(2020)', 'iPhone SE(2022)'
]

for model in iphone_models:
    category = Category.objects.get(name=model)
    CategoryAttribute.objects.create(category=category, attribute_type=features)
    CategoryAttribute.objects.create(category=category, attribute_type=condition)


color = AttributeType.objects.create(name='Color')

# Values for Features
color_values = ['Blue', 'Black', 'Bronze', 'Gold', 'Gray', 'Green', 'Pink', 'Purple', 'Red', 'Rose Gold', 'Silver', 'Yellow', 'White', 'Other']
for value in color_values:
    AttributeValue.objects.create(attribute_type=color, value=value)

all_iphone_models = [
     'iphone 6', 'iphone 6s','iPhone 7', 'iPhone 8', 'iPhone X', 'iPhone XS', 'iPhone XR',
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
    category = Category.objects.get(name=model)
    CategoryAttribute.objects.create(category=category, attribute_type=color)

# Creating the AttributeType for internal storage
internal_storage = AttributeType.objects.create(name='Internal Storage')

# Define the internal storage values for each iPhone model
iphone_storage_mapping = {
    'iPhone 6': ['16 GB', '32 GB', '64 GB', '128 GB'],
    'iPhone 6s': ['16 GB', '32 GB', '64 GB', '128 GB'],
    'iPhone 6 Plus': ['16 GB', '64 GB', '128 GB'],
    'iPhone 6s Plus': ['16 GB', '32 GB', '64 GB', '128 GB'],
    'iPhone 7': ['32 GB', '128 GB', '256 GB'],
    'iPhone 7 Plus': ['32 GB', '128 GB', '256 GB'],
    'iPhone 8': ['64 GB', '128 GB', '256 GB'],
    'iPhone 8 Plus': ['64 GB', '128 GB', '256 GB'],
    'iPhone X': ['64 GB', '256 GB'],
    'iPhone XR': ['64 GB', '128 GB', '256 GB'],
    'iPhone XS': ['64 GB', '256 GB', '512 GB'],
    'iPhone XS Max': ['64 GB', '256 GB', '512 GB'],
    'iPhone 11': ['64 GB', '128 GB', '256 GB'],
    'iPhone 11 Pro': ['64 GB', '256 GB', '512 GB'],
    'iPhone 11 Pro Max': ['64 GB', '256 GB', '512 GB'],
    'iPhone 12': ['64 GB', '128 GB', '256 GB'],
    'iPhone 12 Mini': ['64 GB', '128 GB', '256 GB'],
    'iPhone 12 Pro': ['128 GB', '256 GB', '512 GB'],
    'iPhone 12 Pro Max': ['128 GB', '256 GB', '512 GB'],
    'iPhone 13': ['128 GB', '256 GB', '512 GB'],
    'iPhone 13 Mini': ['128 GB', '256 GB', '512 GB'],
    'iPhone 13 Pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 13 Pro Max': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 14': ['128 GB', '256 GB', '512 GB'],
    'iPhone 14 Plus': ['128 GB', '256 GB', '512 GB'],
    'iPhone 14 Pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 14 Pro Max': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 15': ['128 GB', '256 GB', '512 GB'],
    'iPhone 15 Plus': ['128 GB', '256 GB', '512 GB'],
    'iPhone 15 Pro': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 15 Pro Max': ['128 GB', '256 GB', '512 GB', '1 TB'],
    'iPhone 5': ['16 GB', '32 GB', '64 GB'],
    'iPhone 5c': ['8 GB', '16 GB', '32 GB'],
    'iPhone 5s': ['16 GB', '32 GB', '64 GB'],
    'iPhone 4': ['8 GB', '16 GB', '32 GB'],
    'iPhone 4 CDMA': ['8 GB', '16 GB', '32 GB'],
    'iPhone 4s': ['8 GB', '16 GB', '32 GB', '64 GB'],
    'iPhone 3G': ['8 GB', '16 GB'],
    'iPhone 3GS': ['8 GB', '16 GB', '32 GB'],
    'iPhone SE': ['16 GB', '32 GB', '64 GB', '128 GB'],
    'iPhone SE(2020)': ['64 GB', '128 GB', '256 GB'],
    'iPhone SE(2022)': ['64 GB', '128 GB', '256 GB']
}

# Create and assign AttributeValue entries for internal storage
for model, storages in iphone_storage_mapping.items():
    try:
        category = Category.objects.get(name=model)
        for storage in storages:
            attribute_value, created = AttributeValue.objects.get_or_create(attribute_type=internal_storage, value=storage)
            CategoryAttribute.objects.create(category=category, attribute_type=internal_storage)
        print(f"Successfully created internal storage values for {model}")
    except Category.DoesNotExist:
        print(f"Failed to create internal storage values for {model}: Category does not exist")
    except Exception as e:
        print(f"An error occurred for {model}: {e}")


