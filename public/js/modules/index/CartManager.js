export default class CartManager {
    constructor() {
        // Initialize the cart by retrieving it from local storage
        try {
            this.cart = JSON.parse(localStorage.getItem("cart")) || {};
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            this.cart = {};
        }

        // DOM elements for cart functionality
        this.cartContainer = document.getElementById("shopping-cart");
        this.cartItemsContainer = document.getElementById("cart-items");
        this.clearCartButton = document.getElementById("clear-cart-button");
        this.checkoutButton = document.getElementById("checkout-button");
        this.cartIcon = document.querySelector(".shopping-cart a");

        // Initialize event listeners and check URL parameters
        this.initEventListeners();
        this.checkForShowCartParameter();
    }

    // Check if the URL contains a parameter to show the cart
    checkForShowCartParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        const showCart = urlParams.get('showCart') === 'true';

        if (showCart && this.cartContainer) {
            this.cartContainer.classList.remove("cart-hidden");
            this.cartContainer.classList.add("cart-visible");
        }
    }

    // Calculate the total price of items in the cart
    calculateTotal() {
        return Object.values(this.cart).reduce((total, item) => {
            if (!item || typeof item !== 'object') {
                console.warn('Invalid cart item:', item);
                return total;
            }
            return total + ((item.price || 0) * (item.quantity || 0));
        }, 0).toFixed(2);
    }

    // Update the cart UI to reflect the current cart state
    updateCartUI() {
        if (!this.cartItemsContainer) {
            console.error('Cart items container not found');
            return;
        }

        // Clear the cart items container
        this.cartItemsContainer.innerHTML = "";

        // Check if the cart is empty
        if (Object.keys(this.cart).length === 0) {
            this.renderEmptyCart();
            return;
        }

        // Render cart items, update total, and enable buttons
        this.renderCartItems();
        this.updateTotal();
        this.updateButtons(true);

        // Validate stock for cart items
        this.validateCartStock();
    }

    // Render a message when the cart is empty
    renderEmptyCart() {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "cart-empty";
        emptyMsg.textContent = "Your cart is empty";
        this.cartItemsContainer.appendChild(emptyMsg);

        const totalElement = document.getElementById("cart-total");
        if (totalElement) {
            totalElement.parentElement.remove();
        }

        this.updateButtons(false);
    }

    // Render all items in the cart
    renderCartItems() {
        Object.entries(this.cart).forEach(([productId, item]) => {
            if (!item || !item.name || !item.price) {
                console.warn(`Invalid cart item for product ${productId}:`, item);
                delete this.cart[productId];
                return;
            }

            // Create a list item for each cart product
            const li = document.createElement("li");
            li.classList.add("cart-item");
            li.dataset.id = productId;

            const imageName = item.name.replace(/\s+/g, '');
            li.innerHTML = `
            <div class="item-info">
                <img src="images/products/${imageName}.png" alt="${item.name}" onerror="this.src='images/products/placeholder.png';">
                <span class="item-name">${item.name}<br> (${item.size})</span>
                <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div class="quantity-control">
                <button class="decrease" data-id="${productId}">-</button>
                <span>${item.quantity}</span>
                <button class="increase" data-id="${productId}">+</button>
            </div>
            `;
            this.cartItemsContainer.appendChild(li);
        });
    }

    // Update the total price in the cart UI
    updateTotal() {
        const total = this.calculateTotal();
        let totalElement = document.getElementById("cart-total");
        if (!totalElement) {
            const totalDiv = document.createElement("div");
            totalDiv.className = "cart-total-container";
            totalDiv.innerHTML = `
            <span>Total:</span>
            <span id="cart-total">$${total}</span>
            `;
            this.cartContainer.insertBefore(totalDiv, this.clearCartButton);
        } else {
            totalElement.textContent = `$${total}`;
        }
    }

    // Enable or disable cart buttons based on cart state
    updateButtons(isCartNotEmpty) {
        this.clearCartButton.disabled = !isCartNotEmpty;
        this.checkoutButton.disabled = !isCartNotEmpty;
    }

    // Add a product to the cart
    addToCart(id, name, price, size) {
        // Validate input
        if (!id || !name || price === undefined || !size) {
            console.error('Invalid cart item parameters:', { id, name, price });
            return;
        }

        // Ensure id is a string
        const productId = String(id);

        if (this.cart[productId]) {
            this.cart[productId].quantity++;
        } else {
            this.cart[productId] = {
                id: productId,
                name,
                price: Number(price),
                size,
                quantity: 1
            };
        }

        // Sync cart with local storage and update UI
        this.syncCartWithLocalStorage();
        this.updateCartUI();

        // Show the cart if hidden
        if (this.cartContainer) {
            this.cartContainer.classList.remove("cart-hidden");
            this.cartContainer.classList.add("cart-visible");
        }
    }

    // Handle click events on the cart (e.g., increase or decrease quantity)
    handleCartClick(event) {
        const productId = event.target.dataset.id;

        if (!productId) return;

        if (event.target.classList.contains("increase")) {
            if (this.cart[productId]) {
                this.cart[productId].quantity++;
                this.syncCartWithLocalStorage();
                this.updateCartUI();
            }
        } else if (event.target.classList.contains("decrease")) {
            if (this.cart[productId]) {
                if (this.cart[productId].quantity > 1) {
                    this.cart[productId].quantity--;
                } else {
                    delete this.cart[productId];
                }
                this.syncCartWithLocalStorage();
                this.updateCartUI();
            }
        }
    }

    // Sync the cart with local storage
    syncCartWithLocalStorage() {
        if (Object.keys(this.cart).length === 0) {
            localStorage.removeItem("cart");
        } else {
            localStorage.setItem("cart", JSON.stringify(this.cart));
        }
    }

    // Clear all items from the cart
    clearCart() {
        // Reset the cart object
        this.cart = {};

        this.syncCartWithLocalStorage();
        this.updateCartUI();
    }

    // Validate stock for items in the cart
    validateCartStock() {
        let isValid = true;

        Object.entries(this.cart).forEach(([productId, item]) => {
            const cartItemElement = document.querySelector(`.cart-item[data-id="${productId}"]`);
            // Use stock stored in the product tile
            const productTile = document.querySelector(`.product-tile[data-id="${productId}"]`);
            const availableStock = parseInt(productTile?.dataset.stock || 0, 10);

            // Find the quantity element
            const quantityElement = cartItemElement?.querySelector(".quantity-control span");

            if (quantityElement) {
                // Remove any existing "exceeds-stock" class
                quantityElement.classList.remove("exceeds-stock");

                if (item.quantity > availableStock) {
                    isValid = false;
                    // Add the "exceeds-stock" class if quantity exceeds stock
                    quantityElement.classList.add("exceeds-stock");
                }
            }
        });

        this.checkoutButton.disabled = !isValid;
    }

    // Initialize event listeners for cart actions
    initEventListeners() {
        // Toggle cart visibility on cart icon click
        if (this.cartIcon) {
            this.cartIcon.addEventListener("click", (event) => {
                event.preventDefault();
                if (this.cartContainer) {
                    this.cartContainer.classList.toggle("cart-hidden");
                    this.cartContainer.classList.toggle("cart-visible");
                }
            });
        }

        // Handle cart item actions (increase/decrease quantity)
        if (this.cartItemsContainer) {
            this.cartItemsContainer.addEventListener("click", (event) => this.handleCartClick(event));
        }

        // Clear the cart on button click
        if (this.clearCartButton) {
            this.clearCartButton.addEventListener("click", () => this.clearCart());
        }

        // Redirect to checkout page on button click
        if (this.checkoutButton) {
            this.checkoutButton.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = "checkout.html";
            });
        }
    }
}