export default class SearchManager {
    constructor(productManager) {
        // Reference to the ProductManager instance for managing products
        this.productManager = productManager;

        // Base URL for API requests
        this.apiBaseUrl = '../src/api.php';

        // Set up the search input and button listeners
        this.setupSearchListener();
    }

    // Set up event listeners for the search input and button
    setupSearchListener() {
        // Select the search input field
        const searchInput = document.querySelector('.search-input');

        // Select the search button
        const searchButton = document.querySelector('.search-button');

        // Add a click event listener to the search button
        searchButton.addEventListener('click', () => this.performSearch());

        // Add a keypress event listener to the search input for the Enter key
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    // Perform a search for products based on the input value
    async performSearch() {
        // Get the search input field and its value
        const searchInput = document.querySelector('.search-input');
        const searchTerm = searchInput.value.trim();

        // If the search term is empty, fetch and display all products
        if (!searchTerm) {
            await this.productManager.fetchAndRenderProducts();
            return;
        }

        try {
            // Send a GET request to the API to search for products by name
            const response = await fetch(`${this.apiBaseUrl}?endpoint=product-by-name&name=${encodeURIComponent(searchTerm)}`);
            const products = await response.json(); // Parse the JSON response

            // Select the main content area to display products
            const mainContent = document.querySelector('.main-content');

            // Clear existing product tiles
            mainContent.innerHTML = '';

            // If no products are found, display a message
            if (products.length === 0) {
                mainContent.innerHTML = '<p>No products found.</p>';
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
            // Log any errors that occur during the search process
            console.error('Error searching products:', error);
        }
    }
}