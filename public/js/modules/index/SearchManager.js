export default class SearchManager {
    constructor(productManager) {
        this.productManager = productManager;
        this.apiBaseUrl = '../src/api.php';
        this.setupSearchListener();
    }

    setupSearchListener() {
        const searchInput = document.querySelector('.search-input');
        const searchButton = document.querySelector('.search-button');

        // Listen for button click
        searchButton.addEventListener('click', () => this.performSearch());

        // Listen for Enter key press
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    async performSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchTerm = searchInput.value.trim();

        if (!searchTerm) {
            // If search is empty, fetch all products
            await this.productManager.fetchAndRenderProducts();
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}?endpoint=product-by-name&name=${encodeURIComponent(searchTerm)}`);
            const products = await response.json();

            const mainContent = document.querySelector('.main-content');
            // Clear existing tiles
            mainContent.innerHTML = '';

            if (products.length === 0) {
                mainContent.innerHTML = '<p>No products found.</p>';
                return;
            }

            products.forEach(product => {
                const productTile = this.productManager.createProductTile(product);
                mainContent.appendChild(productTile);
            });

            // Attach add to cart listeners directly to the tiles
            this.productManager.attachAddToCartListeners();

        } catch (error) {
            console.error('Error searching products:', error);
        }
    }
}