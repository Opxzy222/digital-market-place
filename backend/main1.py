import os
from django import setup

# Set the DJANGO_SETTINGS_MODULE environment variable to your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
setup()

from backend.models import Category






electronics = Category.objects.create(name='Electronics', parent=None)
furniture = Category.objects.create(name="Furniture", parent=None)
vehicles = Category.objects.create(name='Vehicles', parent=None)
property = Category.objects.create(name='Property', parent=None)
health_beauty = Category.objects.create(name='Health & Beauty')
fashion = Category.objects.create(name='Fashion', parent=None)
services = Category.objects.create(name='Services', parent=None)
babies = Category.objects.create(name="Babies & Kiddies", parent=None)
agriculture = Category.objects.create(name='Agriculture & Food', parent=None)
commercial_equipment = Category.objects.create(name='Commercial Equipments & Tools', parent=None)
pets = Category.objects.create(name='Pets', parent=None)
sports_arts = Category.objects.create(name='Sports, Arts & outdoors', parent=None)
repair_constructions = Category.objects.create(name='Repair & Constructions', parent=None)