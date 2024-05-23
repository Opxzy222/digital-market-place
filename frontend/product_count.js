axios.get('http://127.0.0.1:8000/category-product-count/')
    .then(function (response) {
        // Handle the response data
        var categories = response.data;
        var categoryList = document.getElementById('categoryList');

        // Iterate over the categories and create list items to display
        for (var categoryKey in categories) {
            if (categories.hasOwnProperty(categoryKey)) {
                // Split the category key to get the ID and name
                var categoryInfo = categoryKey.split('_');
                var categoryId = categoryInfo[0]; // Extract the category ID
                var categoryName = categoryInfo[1]; // Extract the category name
                var count = categories[categoryKey]; // Get the count for this category

                var listItem = document.createElement('li');
                var categoryLink = document.createElement('a'); // Create a link element

                // Set href attribute of the link to the URL for listing products under this category
                categoryLink.href = '/products?category=' + encodeURIComponent(categoryName);
                
                // Create a span for the category name
                var nameSpan = document.createElement('span');
                nameSpan.textContent = categoryName;
                // Append the name span to the link
                categoryLink.appendChild(nameSpan);

                // Create a span for the count
                var countSpan = document.createElement('span');
                countSpan.textContent = '(' + count + ')';
                countSpan.style.color = 'green'; 
                
                // Append the count span to the link
                categoryLink.appendChild(countSpan);

                // Append the link to the list item
                listItem.appendChild(categoryLink);

                // Append the list item to the category list
                categoryList.appendChild(listItem);

                // Set the data attribute 'data-category-id' to store the category ID
                listItem.dataset.categoryId = categoryId;

                // Add a hover event listener to the list item to fetch and display child categories on hover
                listItem.addEventListener('mouseover', function(event) {
                    var hoveredCategoryId = this.dataset.categoryId; // Get the ID of the hovered category
                    var formdata = new FormData();

                    formdata.append('id', hoveredCategoryId)
                    // Make an Axios call to fetch the children categories of the hovered category
                    axios.post('http://127.0.0.1:8000/subcategories-product-count/', formdata)
                        .then(function (response) {
                            var childrenCategories = response.data;
                            console.log(childrenCategories)
                            // Display the children categories in a slide view to the right
                            var subcategoryList = document.getElementById('subcategoryList');
                            subcategoryList.innerHTML = ''; // Clear previous subcategories

                            // Create a new list for subcategories
                            var newList = document.createElement('ul');
                            newList.className = 'subcategory-list';

                            // Iterate over subcategories
                            for (var subcategoryId in childrenCategories) {
                                if (childrenCategories.hasOwnProperty(subcategoryId)) {
                                    var subcategory = childrenCategories[subcategoryId];
                                    // Create a list item element
                                    var subcategoryItem = document.createElement('li');
                                    // Set the innerHTML of the list item to include the subcategory name and count
                                    subcategoryItem.innerHTML = '<span>' + subcategory.name + '</span>: <span>' + subcategory.product_count + '</span>';
                                    // Append the list item to the subcategory list
                                    newList.appendChild(subcategoryItem);
                                }
                            }

                            // Append the new list of subcategories
                            subcategoryList.appendChild(newList);
                        })
                        .catch(function (error) {
                            console.error('Error fetching children categories:', error);
                        });
                });

                // Add a mouseout event listener to remove the subcategories container when not hovered
                listItem.addEventListener('mouseout', function(event) {
                    // Clear the subcategories container
                    var subcategoryList = document.getElementById('subcategoryList');
                    subcategoryList.innerHTML = '';
                });

                // Add a click event listener to the list item to fetch and display products under this category
                listItem.addEventListener('click', function(event) {
                    event.preventDefault(); // Prevent the default link behavior
                    // Fetch and display products under this category
                    // You can use the category ID to make another Axios call to fetch products
                    // Display the products with their images as needed
                });
            }
        }
    })
    .catch(function (error) {
        console.error('Error fetching categories:', error);
    });
