import ProductManager from './modules/ProductManager.js';
import SearchManager from './modules/SearchManager.js';
import CategoryManager from './modules/CategoryManager.js';
import CartManager from './modules/CartManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart manager first
    const cartManager = new CartManager();

    // Initialize product manager
    const productManager = new ProductManager(cartManager);

    // Fetch and render initial products
    productManager.fetchAndRenderProducts();

    // Initialize search manager
    const searchManager = new SearchManager(productManager);

    // Initialize category manager
    const categoryManager = new CategoryManager(productManager);
});