from django.db import models
from ..models import Category, Shop
from mptt.models import MPTTModel, TreeForeignKey
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance

class ShopProductManager(models.Manager):
    def search_shops_by_category(self, category_id, buyer_location):
        # Create a point for the buyer's location
        buyer_point = Point(buyer_location['longitude'], buyer_location['latitude'], srid=4326)

        # Find all shops that have products in the given category
        shops = Shop.objects.filter(
            shopproduct__product_suggestion__category_id=category_id
        ).annotate(
            distance=Distance('geo_location', buyer_point)
        ).order_by('distance')

        # Group the matched products by shop
        shop_dict = {}
        for shop in shops:
            if shop.id not in shop_dict:
                # Truncate the distance value
                truncated_distance = int(shop.distance.m)
                shop.distance = truncated_distance
                shop_dict[shop.id] = shop
                shop_dict[shop.id].matched_products = []

            # Add the matched products to the shop
            shop_dict[shop.id].matched_products.extend(
                shop.shopproduct_set.filter(product_suggestion__category_id=category_id)
            )

        return list(shop_dict.values())