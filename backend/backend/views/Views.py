from django.http import (JsonResponse, HttpResponseBadRequest, 
                         HttpResponseForbidden)
from django.views import View
from ..manager.user import DB_user
from django.shortcuts import redirect
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from ..models import Category, Product
from ..manager.categorymanager import CategoryManager
from ..manager.productmanager import ProductManager
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_GET, require_POST

# Initialize the user authentication manager
auth = DB_user()

# View for creating a new user
class CreateUserView(View):
    def post(self, request, *args, **kwargs):
        # Extract user details from the POST request
        email = request.POST.get('email')
        first_name = request.POST.get('firstname')
        last_name = request.POST.get('lastname')
        password = request.POST.get('password')

        try:
            # Create a new user using the provided details
            auth.create_user(email=email, firstName=first_name,
                             lastName=last_name, password=password)
            return JsonResponse({'email': email, 
                                 'message': 'account created successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

# View for user login
class LoginView(View):
    def post(self, request, *args, **kwargs):
        # Extract login credentials from the POST request
        email = request.POST.get('email')
        password = request.POST.get('password')

        if auth.valid_login(email, password):
            user = auth.find_user(email=email)
            session_id = auth.create_session(email)
            response_data = {
                'message': 'login successful',
                'session_id': session_id,
                'user_id': user.id
            }
            return JsonResponse(response_data, status=200)
        else:
            return HttpResponseBadRequest('Invalid credentials')

# View for user logout
class LogoutView(View):
    def post(self, request, *args, **kwargs):
        session_id = request.COOKIES.get('session_id')
        if session_id:
            user = auth.get_user_by_session_id(session_id)
            if user:
                auth.destroy_session(user.id)
                return redirect('/')
        return HttpResponseForbidden('Forbidden')

# View for getting reset token
class GetResetTokenView(View):
    def post(self, request, *args, **kwargs):
        email = request.POST.get('email')
        try:
            reset_token = auth.get_reset_token(email)
            return JsonResponse({'email': email, 'reset_token': reset_token})
        except ValueError:
            return HttpResponseBadRequest('invalid request')

# View for updating the user password
class UpdatePasswordView(View):
    def post(self, request, *args, **kwargs):
        new_password = request.POST.get('password')
        reset_token = request.POST.get('reset_token')
        try:
            auth.reset_password(reset_token, new_password)
            return JsonResponse({'message': 'password change successfully'})
        except ValueError:
            return HttpResponseBadRequest('invalid request')

# View for creating a new product
class CreateProductView(View):
    @csrf_exempt  # This decorator allows POST requests without CSRF token (for simplicity)
    def post(self, request, *args, **kwargs):
        price = request.POST.get('price')
        category_id = request.POST.get('category_id')  
        user_id = request.POST.get('user_id')
        product_name = request.POST.get('title')
        description = request.POST.get('description')
        image = request.FILES.get('display_image')
        location_id = request.POST.get('location_id', None) 

        images = []
        for key in request.FILES:
            if key.startswith('images['):
                images.append(request.FILES[key])

        attributes = {}
        for key, value in request.POST.items():
            if key.startswith('attributes['):
                attribute_id = key.split('[')[1].split(']')[0]
                attribute_values = value.split(',')
                attributes[attribute_id] = attribute_values

        if not all([product_name, description, price, category_id, user_id, image, images, attributes]):
            return JsonResponse({'status': 'error',
                                  'message': 'All required fields must be provided'},
                                    status=400)

        product_manager = ProductManager()
        product = product_manager.create_product(
            title=product_name,
            description=description,
            price=price,
            category_id=category_id,
            user_id=user_id,
            image=image,
            images=images,
            attribute_data=attributes,
            location_id=location_id
        )

        if product:
            return JsonResponse({'status': 'success', 'product_id': product.id})
        else:
            return JsonResponse({'status': 'error', 'message': 'Failed to create product'}, status=500)

# View for fetching dropdown options for categories
class CategoriesDropDownOptionsView(View):
    def post(self, request, *args, **kwargs):
        categories = Category.objects.filter(parent__isnull=True).values('id', 'name')
        return JsonResponse({'categories': list(categories)})

# View for fetching subcategories based on parent category
class SubCategoriesView(View):
    def post(self, request: HttpRequest):
        parent_id = request.POST.get('parent_id')
        print(parent_id)
        if parent_id:
            subcategories = Category.objects.filter(parent_id=parent_id).values('id', 'name')
            return JsonResponse({'subcategories': list(subcategories)})
        else:
            return JsonResponse({'error': 'category_id parameter is required'}, status=400)

# View for displaying product categories
class CategoryView(View):
    def get(self, request, *args, **kwargs):
        categories = CategoryManager.display_categories()
        category_list = [
            {
                'id': category_id,
                'name': category_name,
                'count': count
            }
            for category_id_name, count in categories.items()
            for category_id, category_name in [category_id_name.split('_')]
        ]
        return JsonResponse(category_list, safe=False)

# View for displaying subcategories with product count
class SubcategoriesCountView(View):
    def post(self, request, *args, **kwargs):
        parent_id = request.POST.get('id')
        category_count = CategoryManager()
        subcategories = category_count.get_subcategories_with_product_count(parent_id)
        return JsonResponse(subcategories, safe=False)

# View for displaying products
class DisplayProductView(View):
    def get(self, request, *args, **kwargs):
        product_manager = ProductManager()
        products = product_manager.get_products()
        return JsonResponse({'products': products})

# View for searching products
class SearchView(View):
    @method_decorator(require_GET)
    def get(self, request):
        search_input = request.GET.get('input', '')
        product_manager = ProductManager()
        serialized_products = product_manager.search_products_by_name(search_input)
        return JsonResponse(serialized_products, safe=False)
    
    @method_decorator(require_POST)
    def post(self, request):
        search_input = request.POST.get('input', '')
        product_manager = ProductManager()
        serialized_products = product_manager.search_products_by_name(search_input)
        return JsonResponse(serialized_products, safe=False)

# View for fetching a product by ID
class GetProductView(View):
    def post(self, request, *args, **kwargs):
        id = request.POST.get('id')
        product_manager = ProductManager()
        product = product_manager.get_product_by_id(id)
        return JsonResponse({'product': product})

# View for fetching a user's product by ID
class GetUserProductView(View):
    def post(self, request, *args, **kwargs):
        id = request.POST.get('id')
        product_manager = ProductManager()
        product = product_manager.get_user_product_by_id(id)
        return JsonResponse({'product': product})

# View for fetching attributes of a category
class GetCategoryAttribute(View):
    def post(self, request, *args, **kwargs):
        category_id = request.POST.get('category_id')
        product_manager = CategoryManager()
        attribute_data = product_manager.categories_attribute(category_id)
        return JsonResponse({'attribute': attribute_data})
