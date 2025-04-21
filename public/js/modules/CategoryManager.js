export default class CategoryManager {
    constructor(productManager) {
        this.productManager = productManager;
        this.apiBaseUrl = '../src/api.php';
        this.setupCategoryListeners();
    }

    setupCategoryListeners() {
        const categoryLinks = document.querySelectorAll('.sidebar a');
        const homePageLink=document.getElementById('home');

        categoryLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const category = event.target.textContent;
                this.fetchProductsByCategory(category);
            });
        });

        homePageLink.addEventListener('click', (event) => {
            event.preventDefault();
            this.productManager.fetchAndRenderProducts();
        });
    }

    async fetchProductsByCategory(category) {
        try {
            const response = await fetch(`${this.apiBaseUrl}?endpoint=products-by-category&category=${encodeURIComponent(category)}`);
            const products = await response.json();

            const mainContent = document.querySelector('.main-content');
            // Clear existing tiles
            mainContent.innerHTML = '';

            if (products.length === 0) {
                mainContent.innerHTML = `<p>No products found in ${category} category.</p>`;
                return;
            }

            products.forEach(product => {
                const productTile = this.productManager.createProductTile(product);
                mainContent.appendChild(productTile);
            });

            // Attach add to cart listeners directly to the tiles
            this.productManager.attachAddToCartListeners();
        } catch (error) {
            console.error('Error fetching products by category:', error);
        }
    }
}