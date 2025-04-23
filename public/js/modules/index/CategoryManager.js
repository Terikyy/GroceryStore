export default class CategoryManager {
    constructor(productManager) {
        // Reference to the ProductManager instance for managing products
        this.productManager = productManager;

        // Base URL for API requests
        this.apiBaseUrl = '../src/api.php';

        // Set up event listeners for category interactions
        this.setupCategoryListeners();
    }

    // Set up event listeners for category links and the home page link
    setupCategoryListeners() {
        // Select all category links in the sidebar
        const categoryLinks = document.querySelectorAll('.sidebar a');

        // Select the home page link
        const homePageLink = document.getElementById('home');

        // Add click event listeners to each category link
        categoryLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                const category = event.target.textContent; // Get the category name
                this.fetchProductsByCategory(category); // Fetch products for the selected category
            });
        });

        // Add a click event listener to the home page link
        homePageLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            this.productManager.fetchAndRenderProducts(); // Fetch and render all products
        });
    }

    // Fetch products for a specific category from the API
    async fetchProductsByCategory(category) {
        try {
            // Send a GET request to the API to fetch products by category
            const response = await fetch(`${this.apiBaseUrl}?endpoint=products-by-category&category=${encodeURIComponent(category)}`);
            const products = await response.json(); // Parse the JSON response

            // Select the main content area to display products
            const mainContent = document.querySelector('.main-content');

            // Clear existing product tiles
            mainContent.innerHTML = '';

            // Check if no products are found for the category
            if (products.length === 0) {
                mainContent.innerHTML = `<p>No products found in ${category} category.</p>`;
                return;
            }

            // Loop through the products and create product tiles
            products.forEach(product => {
                const productTile = this.productManager.createProductTile(product);
                mainContent.appendChild(productTile); // Append each product tile to the main content
            });

            // Attach "Add to Cart" listeners to the newly created product tiles
            this.productManager.attachAddToCartListeners();
        } catch (error) {
            // Log any errors that occur during the fetch process
            console.error('Error fetching products by category:', error);
        }
    }
}