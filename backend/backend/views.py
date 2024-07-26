from django.http import ( JsonResponse, HttpResponseBadRequest, 
                         HttpResponseForbidden )
from django.views import View
from .user import DB_user
from django.shortcuts import redirect
from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt
from .models import Category, Product
from .categorymanager import CategoryManager
from .productmanager import ProductManager
from django.db.models import Count
from django.views.decorators.http import require_GET, require_POST
from django.utils.decorators import method_decorator

auth = DB_user()

class CreateUserView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'POST':
            return self.perform_create(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)

    def perform_create(self, request: HttpRequest, *args, **kwargs):
        email = request.POST.get('email')
        first_name = request.POST.get('firstname')
        last_name = request.POST.get('lastname')
        password = request.POST.get('password')

        try:
            auth.create_user(email=email, firstName=first_name,
                              lastName=last_name, password=password)
            return JsonResponse({'email': email, 
            'message': 'account created successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
class LoginView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'POST':
            return self.perform_login(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    def perform_login(self, request: HttpRequest, *args, **kwargs):
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
    
class LogoutView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'POST':
            return self.perform_logout(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    def perform_logout(self, request: HttpRequest):
        session_id = request.COOKIES.get('session_id')
        if session_id:
            user = auth.get_user_by_session_id(session_id)
            if user:
                auth.destroy_session(user.id)
                return redirect('/')
            
        return HttpResponseForbidden('Forbidden')
    
class GetResetTokenView(View):
    def perform_get_reset_password(self, request: HttpRequest):
        email = request.POST.get('email')
        try:
            reset_token = auth.get_reset_token(email)
            return JsonResponse({'email': email, 'reset_token': reset_token})
        except ValueError:
            return HttpResponseBadRequest('invalid request')
        
class UpdatePasswordView(View):
    def perform_update_password(self, request: HttpRequest):
        new_password = request.POST.get('password')
        reset_token = request.POST.get('reset_token')
        try:
            auth.reset_password(reset_token, new_password)
            return JsonResponse({'message': 'password change successfully'})
        except ValueError:
            return HttpResponseBadRequest('invalid request')
        

class CreateProductView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'POST':
            return self.create_product_view(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    @csrf_exempt  # This decorator allows POST requests without CSRF token (for simplicity)
    def create_product_view(self, request: HttpRequest):
        if request.method == 'POST':
            # Extract data from the POST request
            price = request.POST.get('price')
            category_id = request.POST.get('category_id')  
            user_id = request.POST.get('user_id')
            product_name = request.POST.get('title')
            description = request.POST.get('description')
            image = request.FILES.get('display_image')
            images = request.FILES.getlist('images')

            print(category_id, user_id, product_name, description, price, image, images)

            # Ensure all required fields are present
            if not all([product_name, description, price, category_id, user_id, image, images]):
                return JsonResponse({'status': 'error',
                                      'message': 'All required fields must be provided'},
                                        status=400)


            # Create the product using the provided data
            product_manager = ProductManager()
            product_manager.create_product(product_name,
                                            description,
                                            price, category_id,
                                            user_id, image, images)

            # Return success response with product details
            return JsonResponse({'status': 'success', 
                                 'product_id': category_id})


        else:
        # Return HTTP 405 Method Not Allowed for other HTTP methods
            return JsonResponse({'status': 'error',
                                  'message': 'Method Not Allowed'}, status=405)
        

class CategoriesDropDownOptionsView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'POST':
            return self.perform_drop_down_options(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    def perform_drop_down_options(self, request: HttpRequest):
        categories = Category.objects.filter(parent__isnull=True).values('id', 'name')
        return JsonResponse({'categories': list(categories)})
    
    
class SubCategoriesView(View):
    def post(self, request: HttpRequest):
        # Handle POST request for retrieving subcategories
        parent_id = request.POST.get('parent_id')
        print("Received parent_id:", parent_id) # Debugging print statement
        if parent_id:
            subcategories = Category.objects.filter(parent_id=parent_id).values('id',
                                                                                'name')
            print(subcategories)
            return JsonResponse({'subcategories': list(subcategories)})
        else:
            return JsonResponse({'error': 'category_id parameter is required'},
                                 status=400)
        

class ProductView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'GET':
            return self.display_categories(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    def display_categories(self, request: HttpRequest):

        categories = CategoryManager.display_categories()

        # Convert the categories dictionary into a list of objects
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
    

class SubcategoriesCountView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'POST':
            return self.display_subcategories_count(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)

    def display_subcategories_count(self, request: HttpRequest):

        parent_id = request.POST.get('id')
        print("Received parent_id:", parent_id)

        category_count = CategoryManager()
        subcategories = category_count.get_subcategories_with_product_count(parent_id)

        return JsonResponse(subcategories, safe=False)
    

class DisplayProductView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'GET':
            return self.display_product(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)
    def display_product(self, request: HttpRequest):

        product_manager= ProductManager

        products = product_manager.get_products(self)

        return JsonResponse({'products': products})
    

class SearchView(View):
    @method_decorator(require_GET)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    @method_decorator(require_GET)
    def get(self, request):
        # Get the search query from the request parameters
        search_input = request.GET.get('input', '')

        # Call the ProductManager method to search products
        product_manager = ProductManager()
        serialized_products = product_manager.search_products_by_name(search_input)

        # Return the serialized products as JSON response
        return JsonResponse(serialized_products, safe=False)
    
    @method_decorator(require_POST)
    def post(self, request):
        # Get the search query from the request parameters
        search_input = request.POST.get('input', '')

        # Call the ProductManager method to search products
        product_manager = ProductManager()
        serialized_products = product_manager.search_products_by_name(search_input)

        # Return the serialized products as JSON response
        return JsonResponse(serialized_products, safe=False) 


class GetProductView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'POST':
            return self.perform_get_product(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    def perform_get_product(self, request: HttpRequest):
        id = request.POST.get('id')

        product_manager = ProductManager()

        product = product_manager.get_product_by_id(id)

        return JsonResponse({'product': product})
    

class GetUserProductView(View):
    def dispatch(self, request, *args, **kwargs):
        # Determine the HTTP method used in the request
        if request.method == 'POST':
            return self.perform_get_user_product(request, *args, **kwargs)
        else:
            # Handle other HTTP methods (GET, PUT, DELETE, etc.) here if needed
            return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    def perform_get_user_product(self, request: HttpRequest):
        id = request.POST.get('id')
        print(id)

        product_manager = ProductManager()

        product = product_manager.get_user_product_by_id(id)
        print(product)

        return JsonResponse({'product': product})
    


