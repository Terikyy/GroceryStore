export default class CheckoutProcessor {
    constructor(cartItems) {
        this.cartItems = cartItems; // Array of cart items
    }

    validateStock() {
        // Simulate stock validation
        return this.cartItems.every(item => item.quantity <= item.stock);
    }

    processCheckout() {
        if (!this.validateStock()) {
            alert('Some items in your cart are out of stock.');
            return false;
        }

        // Deduct stock
        this.cartItems.forEach(item => {
            item.stock -= item.quantity;
        });

        alert('Checkout successful!');
        window.location.href = '/confirmation.html'; // Redirect to confirmation page
        return true;
    }
}