export default class ProductManager {
    constructor(cartManager) {
        this.apiBaseUrl = '../src/api.php';
        this.cartManager = cartManager;
    }

    // Fetch all products and render tiles
    async fetchAndRenderProducts() {
        try {
            const response = await fetch(`${this.apiBaseUrl}?endpoint=all-products`);
            const products = await response.json();

            const mainContent = document.querySelector('.main-content');
            // Clear existing tiles
            mainContent.innerHTML = '';

            products.forEach(product => {
                const productTile = this.createProductTile(product);
                mainContent.appendChild(productTile);
            });

            // Attach add to cart listeners directly to the tiles
            this.attachAddToCartListeners();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Create a product tile element
    createProductTile(product) {
        const tile = document.createElement('div');
        tile.classList.add('product-tile');
        tile.dataset.id = product.product_id;
        tile.dataset.name = product.product_name;
        tile.dataset.price = product.unit_price;

        // Replace generic placeholder with more specific image generation
        const imageName = product.product_name.replace(/\s+/g, '');

        tile.innerHTML = `
            <img src="images/products/${imageName}.png" alt="${product.product_name}" onerror="this.src='images/products/placeholder.png';">
            <h3>${product.product_name}</h3>
            <p>$${parseFloat(product.unit_price).toFixed(2)}</p>
            <p>Size: ${product.unit_quantity}</p>
            <p>In Stock: ${product.in_stock}</p>
            <button class="add-to-cart" data-id="${product.product_id}">Add to Cart</button>
        `;

        return tile;
    }

    // Attach add to cart listeners (called after rendering products)
    attachAddToCartListeners() {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            // Remove any existing listeners first
            button.removeEventListener('click', this.addToCartHandler);

            // Bind the handler to the current instance
            this.addToCartHandler = this.createAddToCartHandler(button);
            button.addEventListener('click', this.addToCartHandler);
        });
    }

    // Create a handler for each add to cart button
    createAddToCartHandler(button) {
        return () => {
            const productTile = button.closest('.product-tile');
            const id = productTile.dataset.id;
            const name = productTile.dataset.name;
            const price = parseFloat(productTile.dataset.price);

            // Directly call addToCart on the cart manager
            this.cartManager.addToCart(id, name, price);
        };
    }
}
