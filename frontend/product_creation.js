document.addEventListener('DOMContentLoaded', function() {
    // Function to populate dropdown with options
    function populateDropdown(selectElement, options) {
        selectElement.innerHTML = ''; // Clear previous options

        // Add a placeholder option
        var placeholderOption = document.createElement('option');
        placeholderOption.value = ''; // Empty value for placeholder
        placeholderOption.text = 'Select an option'; // Placeholder text
        placeholderOption.disabled = true; // Make it non-selectable
        placeholderOption.selected = true; // Make it selected by default
        selectElement.appendChild(placeholderOption);

        // Populate the dropdown with the provided options
        options.forEach(function(option) {
            var optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.text = option.name;
            selectElement.appendChild(optionElement);
        });
    }

    // Populate categories dropdown on page load
    axios.post('http://127.0.0.1:8000/category/dropdown-options/')
        .then(function(response) {
            var categories = response.data.categories;
            var categorySelect = document.getElementById('categorySelect');
            populateDropdown(categorySelect, categories);
        })
        .catch(function(error) {
            console.error('Error fetching categories:', error);
        });

    // Dynamically populate subcategories when a category is selected
    document.getElementById('categorySelect').addEventListener('change', function() {
        var categoryId = this.value;
        var formData = new FormData();
        formData.append('parent_id', categoryId);

       // Clear and hide subcategory dropdowns other than the first one
        document.getElementById('subcategorySelect').innerHTML = ''; // Clear first subcategory dropdown
        document.getElementById('subcategorySelect').style.display = 'none'; // Hide first subcategory dropdown
        document.getElementById('subcategorySelect1').innerHTML = ''; // Clear second subcategory dropdown
        document.getElementById('subcategorySelect1').style.display = 'none'; // Hide second subcategory dropdown
        document.getElementById('subcategorySelect2').innerHTML = ''; // Clear third subcategory dropdown
        document.getElementById('subcategorySelect2').style.display = 'none'; // Hide third subcategory dropdown
        document.getElementById('subcategorySelect3').innerHTML = ''; // Clear third subcategory dropdown
        document.getElementById('subcategorySelect3').style.display = 'none'; // Hide third subcategory dropdown


        axios.post('http://127.0.0.1:8000/category/subcategories/', formData)
            .then(function(response) {
                var subcategories = response.data.subcategories;
                var subcategorySelect = document.getElementById('subcategorySelect');
                populateDropdown(subcategorySelect, subcategories);
                subcategorySelect.style.display = 'block'; // Show the dropdown
            })
            .catch(function(error) {
                console.error('Error fetching subcategories:', error);
            });
    });

    // Dynamically populate sub-subcategories when a subcategory is selected
    document.getElementById('subcategorySelect').addEventListener('change', function() {
        var subcategoryId = this.value;
        var formData = new FormData();
        formData.append('parent_id', subcategoryId);

        // Clear sub-subcategory and sub-sub-subcategory dropdowns
        document.getElementById('subcategorySelect1').innerHTML = '';
        document.getElementById('subcategorySelect2').innerHTML = '';
        document.getElementById('subcategorySelect1').style.display = 'none';
        document.getElementById('subcategorySelect2').style.display = 'none';
        document.getElementById('subcategorySelect3').innerHTML = ''; // Clear third subcategory dropdown
        document.getElementById('subcategorySelect3').style.display = 'none'; // Hide third subcategory dropdown


        axios.post('http://127.0.0.1:8000/category/subcategories/', formData)
            .then(function(response) {
                var subSubcategories = response.data.subcategories;
                var subcategorySelect1 = document.getElementById('subcategorySelect1');
                if (subSubcategories.length > 0) {
                    populateDropdown(subcategorySelect1, subSubcategories);
                    subcategorySelect1.style.display = 'block'; // Show the dropdown
                } else {
                    subcategorySelect1.innerHTML = ''; // Clear the dropdown
                    subcategorySelect1.style.display = 'none'; // Hide the dropdown
                }
            })
            .catch(function(error) {
                console.error('Error fetching sub-subcategories:', error);
            });
    });

    // Dynamically populate sub-sub-subcategories when a sub-subcategory is selected
    document.getElementById('subcategorySelect1').addEventListener('change', function() {
        var subSubcategoryId = this.value;
        var formData = new FormData();
        formData.append('parent_id', subSubcategoryId);

        // Clear sub-sub-subcategory dropdown
        document.getElementById('subcategorySelect2').innerHTML = '';
        document.getElementById('subcategorySelect2').style.display = 'none';
        document.getElementById('subcategorySelect3').innerHTML = ''; // Clear third subcategory dropdown
        document.getElementById('subcategorySelect3').style.display = 'none'; // Hide third subcategory dropdown


        axios.post('http://127.0.0.1:8000/category/subcategories/', formData)
            .then(function(response) {
                var subSubSubcategories = response.data.subcategories;
                var categorySelect2 = document.getElementById('subcategorySelect2');
                
                // Populate categorySelect2 if there are sub-sub-subcategories
                if (subSubSubcategories.length > 0) {
                    populateDropdown(categorySelect2, subSubSubcategories);
                    categorySelect2.style.display = 'block'; // Show the dropdown
                } else {
                    categorySelect2.innerHTML = ''; // Clear the dropdown
                    categorySelect2.style.display = 'none'; // Hide the dropdown
                }
            })
            .catch(function(error) {
                console.error('Error fetching sub-sub-subcategories:', error);
            });
    });

    document.getElementById('subcategorySelect2').addEventListener('change', function() {
        var subSubcategoryId = this.value;
        var formData = new FormData();
        formData.append('parent_id', subSubcategoryId);

        // Clear sub-sub-subcategory dropdown
        document.getElementById('subcategorySelect3').innerHTML = '';
        document.getElementById('subcategorySelect3').style.display = 'none';

        axios.post('http://127.0.0.1:8000/category/subcategories/', formData)
            .then(function(response) {
                var subSubSubcategories = response.data.subcategories;
                var categorySelect3 = document.getElementById('subcategorySelect3');
                
                // Populate categorySelect2 if there are sub-sub-subcategories
                if (subSubSubcategories.length > 0) {
                    populateDropdown(categorySelect3, subSubSubcategories);
                    categorySelect3.style.display = 'block'; // Show the dropdown
                } else {
                    categorySelect3.innerHTML = ''; // Clear the dropdown
                    categorySelect3.style.display = 'none'; // Hide the dropdown
                }
            })
            .catch(function(error) {
                console.error('Error fetching sub-sub-subcategories:', error);
            });
    });
    // Handle form submission
    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var title = document.getElementById('titleInput').value;
        var description = document.getElementById('descriptionInput').value;
        var price = document.getElementById('priceInput').value;
        var user_id = document.getElementById('userId').value;
        var image = document.getElementById('productImage').files[0];
        var categoryId; // variable to store category ID
    
        // Check if subcategorySelect1 is visible
        if (document.getElementById('subcategorySelect1').style.display !== 'none') {
            // Use the value of subcategorySelect1 if it's visible
            categoryId = document.getElementById('subcategorySelect1').value;
            if (document.getElementById('subcategorySelect2').style.display !== 'none') {
                categoryId = document.getElementById('subcategorySelect2').value;
                if (document.getElementById('subcategorySelect3').style.display !== 'none') {
                    categoryId = document.getElementById('subcategorySelect3').value
                }
            }
        } else {
            // Otherwise, use the value of subcategorySelect
            throw new Error('select subcategory')
        }
     
        var formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category_id', categoryId);
        formData.append('user_id', user_id);
        formData.append('image', image);
        console.log(title, description, categoryId, price, image)
    
        axios.post('http://127.0.0.1:8000/create-product/', formData)
            .then(function(response) {
                console.log('Product created successfully:', response.data);
            })
            .catch(function(error) {
                console.error('Error creating product:', error);
            });
    });
})  