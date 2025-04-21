class CheckoutManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("cart")) || [];
        this.checkoutItemsContainer = document.getElementById("checkout-items");
        this.checkoutTotal = document.getElementById("checkout-total");

        this.populateOrderSummary();
        document.getElementById("submit-order").addEventListener("click", () => this.processCheckout());
    }

    populateOrderSummary() {
        this.checkoutItemsContainer.innerHTML = "";
        this.cart.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
            this.checkoutItemsContainer.appendChild(li);
        });

        this.checkoutTotal.textContent = `$${this.calculateTotal()}`;
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    }

    processCheckout() {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "thankyou.html";
    }
}

document.addEventListener("DOMContentLoaded", () => new CheckoutManager());
