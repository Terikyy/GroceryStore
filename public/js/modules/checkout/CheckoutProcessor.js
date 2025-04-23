import CartManager from '../index/CartManager.js';

export default class CheckoutProcessor {
    constructor(cartItems) {
        this.apiBaseUrl = '../src/api.php';
        this.cartItems = cartItems; // Object of cart items
    }

    async validateStockWithDatabase() {
        const insufficientStockItems = [];

        for (const item of Object.values(this.cartItems)) {
            const response = await fetch(`${this.apiBaseUrl}?endpoint=check-stock&product_id=${item.id}`);
            if (!response.ok) {
                throw new Error(`Failed to check stock for product ID: ${item.id}`);
            }

            const data = await response.json();
            if (!data.in_stock || item.quantity > data.in_stock) {
                insufficientStockItems.push({
                    name: item.name,
                    requested: item.quantity,
                    available: data.in_stock || 0
                });
            }
        }

        if (insufficientStockItems.length > 0) {
            const message = insufficientStockItems.map(item =>
                `${item.name}: Requested ${item.requested}, Available ${item.available}`
            ).join('\n');
            alert(`The following items are not in sufficient stock:\n\n${message}`);
            return false;
        }

        return true;
    }

    async updateStockInDatabase() {
        for (const item of Object.values(this.cartItems)) {
            const payload = {
                product_id: item.id,
                quantity_change: item.quantity
            };

            const response = await fetch(`${this.apiBaseUrl}?endpoint=update-quantity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Failed to update stock for product ID: ${item.id}. Error: ${responseData.error || 'Unknown error'}`);
            }
        }
    }

    async processCheckout() {
        try {
            const isStockValid = await this.validateStockWithDatabase();
            if (!isStockValid) {
                window.location.href = 'index.html'; // Redirect to index.html with the cart shown
                return false;
            }

            // Update stock in the database
            await this.updateStockInDatabase();

            // Clear the user's shopping cart
            const cartManager = new CartManager();
            cartManager.clearCart();

            // Placeholder for order processing logic (not required for this assignment)

            window.location.href = 'confirmation.html'; // Redirect to confirmation page
            return true;
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout. Please try again.');
            return false;
        }
    }
}