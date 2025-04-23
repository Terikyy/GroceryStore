export default class CartManager {
    constructor() {
        try {
            this.cart = JSON.parse(localStorage.getItem("cart")) || {};
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            this.cart = {};
        }

        this.cartContainer = document.getElementById("shopping-cart");
        this.cartItemsContainer = document.getElementById("cart-items");
        this.clearCartButton = document.getElementById("clear-cart-button");
        this.checkoutButton = document.getElementById("checkout-button");
        this.cartIcon = document.querySelector(".shopping-cart a");

        // Show the cart if it contains items
        if (Object.keys(this.cart).length > 0 && this.cartContainer) {
            this.cartContainer.classList.remove("cart-hidden");
            this.cartContainer.classList.add("cart-visible");
        }

        this.initEventListeners();
    }

    calculateTotal() {
        return Object.values(this.cart).reduce((total, item) => {
            if (!item || typeof item !== 'object') {
                console.warn('Invalid cart item:', item);
                return total;
            }
            return total + ((item.price || 0) * (item.quantity || 0));
        }, 0).toFixed(2);
    }

    updateCartUI() {
        if (!this.cartItemsContainer) {
            console.error('Cart items container not found');
            return;
        }

        this.cartItemsContainer.innerHTML = "";

        if (Object.keys(this.cart).length === 0) {
            this.renderEmptyCart();
            return;
        }

        this.renderCartItems();
        this.updateTotal();
        this.updateButtons(true);
    }

    renderEmptyCart() {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "cart-empty";
        emptyMsg.textContent = "Your cart is empty";
        this.cartItemsContainer.appendChild(emptyMsg);

        const totalElement = document.getElementById("cart-total");
        if (totalElement) {
            totalElement.parentElement.remove();
        }

        this.updateButtons(false)
    }

    renderCartItems() {
        Object.entries(this.cart).forEach(([productId, item]) => {
            if (!item || !item.name || !item.price) {
                console.warn(`Invalid cart item for product ${productId}:`, item);
                delete this.cart[productId];
                return;
            }

            const li = document.createElement("li");
            li.classList.add("cart-item");

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

    updateButtons(isCartNotEmpty) {
        this.clearCartButton.disabled = !isCartNotEmpty;
        this.checkoutButton.disabled = !isCartNotEmpty;
    }

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

        this.syncCartWithLocalStorage();
        this.updateCartUI();

        // Safely toggle cart visibility
        if (this.cartContainer) {
            this.cartContainer.classList.remove("cart-hidden");
            this.cartContainer.classList.add("cart-visible");
        }
    }

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

    syncCartWithLocalStorage() {
        if (Object.keys(this.cart).length === 0) {
            localStorage.removeItem("cart");
        } else {
            localStorage.setItem("cart", JSON.stringify(this.cart));
        }
    }

    clearCart() {
        // Reset the cart object
        this.cart = {};

        // Sync Local Storage and update UI
        this.syncCartWithLocalStorage();
        this.updateCartUI();
    }


    initEventListeners() {
        // Add null checks
        if (this.cartIcon) {
            this.cartIcon.addEventListener("click", (event) => {
                event.preventDefault();
                if (this.cartContainer) {
                    this.cartContainer.classList.toggle("cart-hidden");
                    this.cartContainer.classList.toggle("cart-visible");
                }
            });
        }

        if (this.cartItemsContainer) {
            this.cartItemsContainer.addEventListener("click", (event) => this.handleCartClick(event));
        }

        if (this.clearCartButton) {
            this.clearCartButton.addEventListener("click", () => this.clearCart());
        }

        if (this.checkoutButton) {
            this.checkoutButton.addEventListener("click", (event) => {
                event.preventDefault();
                window.location.href = "checkout.html";
            });
        }
    }
}
