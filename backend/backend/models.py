from django.db import models
from django.utils import timezone
from mptt.models import MPTTModel, TreeForeignKey
from django.db.models import Sum
from django.contrib.gis.db import models as gis_models
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

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

class AttributeType(models.Model):
    name = models.CharField(max_length=100)
    is_checkbox = models.BooleanField(default=False) 

    def __str__(self):
        return self.name

class AttributeValue(models.Model):
    attribute_type = models.ForeignKey(AttributeType, on_delete=models.CASCADE, related_name='values')
    value = models.CharField(max_length=100)

    def __str__(self):
        return self.value

class Category(MPTTModel):
    #Category model
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default='Default Category Name')
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
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

class CategoryAttribute(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='attributes')
    attribute_type = models.ForeignKey(AttributeType, on_delete=models.CASCADE)
    attribute_value = models.ForeignKey(AttributeValue, on_delete=models.CASCADE, related_name='category_attributes')

    class Meta:
        unique_together = ('category', 'attribute_type', 'attribute_value')

    def __str__(self):
        return f"{self.category} - {self.attribute_type}"

class Location(MPTTModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default='location')
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='child')
    
    # Fields used internally by django-mptt
    tree_id = models.CharField(max_length=10, default='location id')
    level = models.PositiveIntegerField(default=0)
    rght = models.PositiveIntegerField(default=1)
    lft = models.PositiveIntegerField(default=1)

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    title = models.TextField(max_length=100, default='title')
    description = models.TextField()
    price = models.DecimalField(decimal_places=2, max_digits=10)
    negotiable = models.BooleanField(null=True)
    image = models.ImageField(upload_to='Image/Image', null=False, default='product_image.jpg')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seller_id', null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category_items')
    product_name = models.CharField(max_length=100, blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='product_location', default=15, null=True)
    attributes = models.ManyToManyField(CategoryAttribute, through='ProductAttribute')

    def save(self, *args, **kwargs):
        # Retrieve the related Category name
        if self.category:
            self.product_name = self.category.name
        super().save(*args, **kwargs)

class ProductAttribute(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    category_attribute = models.ForeignKey(CategoryAttribute, on_delete=models.CASCADE)
    value = models.ForeignKey(AttributeValue, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.product} - {self.category_attribute.attribute_type}: {self.value}"

class Image(models.Model):
    DEFAULT_PRODUCT_ID = 26  # You can change this default value as needed
    DEFAULT_PRODUCT_NAME = "Default Product"

    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE, default=DEFAULT_PRODUCT_ID)
    image_file = models.ImageField(upload_to='Image/Image', default='product_image.jpg')

    def __str__(self):
        return self.image_file.name
    
class Subcategory(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class ProductSuggestion(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, null=True, blank=True)


    def __str__(self):
        return self.name

class Shop(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shops')
    name = models.CharField(max_length=255)
    description = models.TextField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='shop_location', null=True)
    geo_location = gis_models.PointField(srid=4326)  # Geospatial field for location
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ManyToManyField(Category)
    image = models.ImageField(upload_to='Image/Image', null=True, default='Image/Image/shop_image.jpg')

    def __str__(self):
        return self.name

class ShopProduct(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, null=True)
    product_suggestion = models.ForeignKey(ProductSuggestion, on_delete=models.SET_NULL, null=True, blank=True)
    custom_name = models.CharField(max_length=255, blank=True, null=True)
    is_available = models.BooleanField(default=True)
    price = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)

    def __str__(self):
        if self.custom_name:
            return self.custom_name
        return self.product_suggestion.name if self.product_suggestion else "Unnamed Product"

class Review(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()  # Assume a rating scale of 1-5
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.shop.name} by {self.reviewer.fullname}"
    
class ShopPost(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='posts')
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Post by {self.shop.name} on {self.created_at.strftime('%Y-%m-%d')}"

class ShopPostMedia(models.Model):
    post = models.ForeignKey(ShopPost, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='shop_posts/')

class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations')
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='conversations')
    user_initial_name = models.CharField(max_length=255, null=True)  # Store the initial name for the user
    shop_initial_name = models.CharField(max_length=255, null=True)  # Store the initial name for the shop
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation between {self.user.fullname} and {self.shop.name}"

    def save(self, *args, **kwargs):
        if not self.user_initial_name:
            self.user_initial_name = self.user.fullname
        if not self.shop_initial_name:
            self.shop_initial_name = self.shop.name
        super().save(*args, **kwargs)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages', default=2)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    sender_name = models.CharField(max_length=255, default='buyer')
    receiver_name = models.CharField(max_length=255, default='shop')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Message from {self.sender.fullname} to {self.receiver.fullname}"       
    
@receiver(post_save, sender=Message)
def send_message_notification(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        notification = {
            'type': 'send_notification',
            'notification': {
                'message': instance.content,
                'sender': instance.sender.fullname,
                'receiver': instance.receiver.fullname,
                'shop': instance.shop.name,
                'timestamp': str(instance.timestamp),
            }
        }
        async_to_sync(channel_layer.group_send)(f'user_{instance.receiver.id}', notification)

class Follower(models.Model):
    shop = models.ForeignKey(Shop, related_name='followers', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='following_shops', on_delete=models.CASCADE)
    followed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('shop', 'user')

class RecentlyVisitedShop(models.Model):
    user = models.ForeignKey(User, related_name='buyer', on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, related_name='shop', on_delete=models.CASCADE)
    visited_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'shop')
        ordering = ['-visited_at']

    def __str__(self):
        return f"{self.user.fullname} visited {self.shop.name}"