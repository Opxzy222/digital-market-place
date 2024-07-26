import os
import math
from django import setup

# Set the DJANGO_SETTINGS_MODULE environment variable to your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
setup()

from backend.models import Shop, Category, Subcategory
from django.contrib.gis.geos import Point

subcategory = Subcategory.objects.get(id=2)
print(subcategory.category.id) 