from django.core.management.base import BaseCommand
from django.apps import apps

class Command(BaseCommand):
    help = 'My custom command'

    def handle(self, *args, **options):
        # Import models within the handle method
        from ...models import Category
        
        # Code to interact with Django models goes here
        my_objects = Category.objects.all()
        for obj in my_objects:
            self.stdout.write(self.style.SUCCESS(obj.name))
