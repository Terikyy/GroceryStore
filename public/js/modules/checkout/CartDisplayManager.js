export default class CartDisplayManager {
    constructor() {
        this.cart = this.getCartFromLocalStorage();
    }

    getCartFromLocalStorage() {
        const cart = localStorage.getItem("cart");
        if (cart) {
            const parsedCart = JSON.parse(cart);
            // Validate that parsedCart is an object
            if (parsedCart && typeof parsedCart === "object") {
                return parsedCart;
            }
        }
        // Return an empty object if the cart is invalid or not found
        return {};
    }

    displayCartItems() {
        const cartContainer = document.getElementById("checkout-items");
        if (!cartContainer) {
            console.error("Cart container (checkout-items) not found in the DOM.");
            return;
        }

        cartContainer.innerHTML = "";

        const cartEntries = Object.entries(this.cart);
        if (cartEntries.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "Your cart is empty.";
            cartContainer.appendChild(emptyMessage);
            return;
        }

        cartEntries.forEach(([productId, item]) => {
            if (!item || !item.name || !item.price) {
                console.warn(`Invalid cart item for product ${productId}:`, item);
                return;
            }

            const itemElement = document.createElement("li");
            itemElement.innerHTML = `
                <span>${item.name} <br>(${item.size})</span>
                <span>Price: $${(item.price * item.quantity).toFixed(2)}</span>
                <span>Quantity: ${item.quantity}</span>
            `;
            cartContainer.appendChild(itemElement);
        });
    }

    calculateTotalPrice() {
        return Object.values(this.cart).reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0).toFixed(2);
    }

    displayTotalPrice() {
        const totalPriceElement = document.getElementById("checkout-total");
        if (!totalPriceElement) {
            console.error("Total price element (checkout-total) not found in the DOM.");
            return;
        }

        const totalPrice = this.calculateTotalPrice();
        totalPriceElement.textContent = `$${totalPrice}`;
    }
}