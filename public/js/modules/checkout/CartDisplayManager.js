export default class CartDisplayManager {
    constructor() {
        // Initialize the cart by retrieving it from local storage
        this.cart = this.getCartFromLocalStorage();
    }

    // Retrieve the cart data from local storage
    getCartFromLocalStorage() {
        const cart = localStorage.getItem("cart");
        if (cart) {
            const parsedCart = JSON.parse(cart);
            // Validate that the parsed cart is an object
            if (parsedCart && typeof parsedCart === "object") {
                return parsedCart;
            }
        }
        // Return an empty object if the cart is invalid or not found
        return {};
    }

    // Display the cart items in the DOM
    displayCartItems() {
        const cartContainer = document.getElementById("checkout-items");
        if (!cartContainer) {
            console.error("Cart container (checkout-items) not found in the DOM.");
            return;
        }

        // Clear the cart container before rendering items
        cartContainer.innerHTML = "";

        const cartEntries = Object.entries(this.cart);
        if (cartEntries.length === 0) {
            // Show a message if the cart is empty
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "Your cart is empty.";
            cartContainer.appendChild(emptyMessage);
            return;
        }

        // Loop through each cart item and render it
        cartEntries.forEach(([productId, item]) => {
            if (!item || !item.name || !item.price) {
                console.warn(`Invalid cart item for product ${productId}:`, item);
                return;
            }

            // Create a list item for each cart product
            const itemElement = document.createElement("li");
            itemElement.innerHTML = `
                <span>${item.name} <br>(${item.size})</span>
                <span>Price: $${(item.price * item.quantity).toFixed(2)}</span>
                <span>Quantity: ${item.quantity}</span>
            `;
            cartContainer.appendChild(itemElement);
        });
    }

    // Calculate the total price of all items in the cart
    calculateTotalPrice() {
        return Object.values(this.cart).reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0).toFixed(2);
    }

    // Display the total price in the DOM
    displayTotalPrice() {
        const totalPriceElement = document.getElementById("checkout-total");
        if (!totalPriceElement) {
            console.error("Total price element (checkout-total) not found in the DOM.");
            return;
        }

        // Calculate and display the total price
        const totalPrice = this.calculateTotalPrice();
        totalPriceElement.textContent = `$${totalPrice}`;
    }
}