class CartManager {
    constructor() {
        try {
            this.cart = JSON.parse(localStorage.getItem("cart")) || {};
        } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            this.cart = {};
        }

        this.cartContainer = document.getElementById("shopping-cart");
        this.cartItemsContainer = document.getElementById("cart-items");
        this.checkoutButton = document.getElementById("checkout");
        this.cartIcon = document.querySelector(".shopping-cart a");

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
            const emptyMsg = document.createElement("p");
            emptyMsg.className = "cart-empty";
            emptyMsg.textContent = "Your cart is empty";
            this.cartItemsContainer.appendChild(emptyMsg);

            const totalElement = document.getElementById("cart-total");
            if (totalElement) {
                totalElement.parentElement.remove();
            }
            return;
        }

        // Use Object.entries to get both index and item
        Object.entries(this.cart).forEach(([productId, item], index, array) => {
            if (!item || !item.name || !item.price) {
                console.warn(`Invalid cart item for product ${productId}:`, item);
                return;
            }

            const li = document.createElement("li");
            li.classList.add("cart-item");

            // Match the image handling from ProductManager
            const imageName = item.name.replace(/\s+/g, '');

            li.innerHTML = `
                <div class="item-info">
                    <img src="images/products/${imageName}.png" alt="${item.name}" onerror="this.src='images/products/placeholder.png';">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div class="quantity-control">
                    <button class="decrease" data-id="${productId}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${productId}">+</button>
                </div>
            `;
            this.cartItemsContainer.appendChild(li);

            // Only add separator if it's not the last item
            if (index < array.length - 1) {
                const separator = document.createElement("div");
                separator.className = "cart-separator";
                this.cartItemsContainer.appendChild(separator);
            }
        });

        const totalElement = document.getElementById("cart-total");
        if (totalElement) {
            totalElement.textContent = `$${this.calculateTotal()}`;
        } else if (this.cartContainer && this.checkoutButton) {
            const totalDiv = document.createElement("div");
            totalDiv.className = "cart-total-container";
            totalDiv.innerHTML = `
                <span>Total:</span>
                <span id="cart-total">$${this.calculateTotal()}</span>
            `;
            this.cartContainer.insertBefore(totalDiv, this.checkoutButton);
        }

        try {
            localStorage.setItem("cart", JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

    addToCart(id, name, price) {
        // Validate input
        if (!id || !name || price === undefined) {
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
                quantity: 1
            };
        }

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
                this.updateCartUI();
            }
        } else if (event.target.classList.contains("decrease")) {
            if (this.cart[productId]) {
                if (this.cart[productId].quantity > 1) {
                    this.cart[productId].quantity--;
                } else {
                    delete this.cart[productId];
                }
                this.updateCartUI();
            }
        }
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
    }
}

export default CartManager;