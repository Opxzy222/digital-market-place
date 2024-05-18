from models import Category, Product
from django import forms

class Product_form(forms.ModelForm):
    model = Product
    fields = ['title', 'description', 'price', 'negotiable', 'image', 'category']