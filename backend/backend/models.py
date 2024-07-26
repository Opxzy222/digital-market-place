from django.db import models
from django.utils import timezone
from mptt.models import MPTTModel, TreeForeignKey
from django.db.models import Sum


class User(models.Model):
    # User model
    id = models.AutoField(primary_key=True)
    firstname = models.CharField(max_length=250, null=False)
    lastname = models.CharField(max_length=250, null=False)
    email = models.CharField(max_length=250, null=False, unique=True)
    password = models.CharField(max_length=250, null=False)
    session_id = models.CharField(max_length=250, null=True)
    phone_no = models.BigIntegerField(null=True, default='012456520')
    reset_token = models.CharField(max_length=250, null=True)
    date_joined = models.DateTimeField(default=timezone.now)

    @property
    def fullname(self):
        # a method to return user's fullname
        return f'{self.firstname} {self.lastname}'

    def __str__(self):
        # name representation of the class
        return self.fullname
    
class Category(MPTTModel):
    #Category model
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default='Default Category Name', unique=True)
    parent = TreeForeignKey('self', on_delete=models.CASCADE,
                               null=True, blank=True,
                                 related_name='children')
    tree_id = models.CharField(max_length=100, default='tree-id')
    level = models.PositiveIntegerField(default=0)
    class MPTTMeta:
        order_insertion_by = ['name']

    rght = models.PositiveIntegerField(default=1)
    
    lft = models.PositiveIntegerField(default=1)
    

    def __str__(self):
        return self.name
    
    def product_count(self):
        # Get the count of products in all subcategories recursively
        subcategory_product_count = self.get_all_subcategory_product_count()

        # Sum up the counts
        total_product_count = subcategory_product_count 
        return total_product_count

    def get_all_subcategory_product_count(self):
        # Initialize the total count
        total_count = self.category_items.count()
    
        # Iterate through each subcategory recursively
        for subcategory in self.children.all():
            # Add the product count of the current subcategory
            total_count += subcategory.get_all_subcategory_product_count()
    
        return total_count

class Product(models.Model):
    title = models.TextField(max_length=100, default='title')
    description = models.TextField()
    price = models.DecimalField(decimal_places=2, max_digits=10)
    negotiable = models.BooleanField(null=True)
    image = models.ImageField(upload_to='Image/Image',
                               null=False, default='product_image.jpg')
    seller = models.ForeignKey(User, on_delete=models.CASCADE,
                                related_name='seller_id', null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE,
                                  related_name='category_items')
    product_name = models.CharField(max_length=100, blank=True)
   
    def save(self, *args, **kwargs):
        # Retrieve the related Category name
        if self.category:
            self.product_name = self.category.name

        super().save(*args, **kwargs)


class Image(models.Model):
    DEFAULT_PRODUCT_ID = 26  # You can change this default value as needed
    DEFAULT_PRODUCT_NAME = "Default Product"

    product = models.ForeignKey(
        Product,
        related_name='images',
        on_delete=models.CASCADE,
        default=DEFAULT_PRODUCT_ID  # Provide the default product ID directly
    )
    image_file = models.ImageField(upload_to='Image/Image', default='product_image.jpg')

    def __str__(self):
        return self.image_file.name
