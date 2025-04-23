import CartManager from '../index/CartManager.js';

export default class CheckoutProcessor {
    constructor(cartItems) {
        // Base URL for API requests
        this.apiBaseUrl = '../src/api.php';
        // Cart items to process during checkout
        this.cartItems = cartItems;
    }

    // Validate stock availability for each item in the cart
    async validateStockWithDatabase() {
        const insufficientStockItems = [];

        for (const item of Object.values(this.cartItems)) {
            // Fetch stock information for the current product
            const response = await fetch(`${this.apiBaseUrl}?endpoint=check-stock&product_id=${item.id}`);
            if (!response.ok) {
                throw new Error(`Failed to check stock for product ID: ${item.id}`);
            }

            const data = await response.json();
            // Check if the requested quantity exceeds available stock
            if (!data.in_stock || item.quantity > data.in_stock) {
                insufficientStockItems.push({
                    name: item.name,
                    requested: item.quantity,
                    available: data.in_stock || 0
                });
            }
        }

        // If any items have insufficient stock, alert the user and return false
        if (insufficientStockItems.length > 0) {
            const message = insufficientStockItems.map(item =>
                `${item.name}: Requested ${item.requested}, Available ${item.available}`
            ).join('\n');
            alert(`The following items are not in sufficient stock:\n\n${message}`);
            return false;
        }

        return true; // All items have sufficient stock
    }

    // Update stock quantities in the database after checkout
    async updateStockInDatabase() {
        for (const item of Object.values(this.cartItems)) {
            const payload = {
                product_id: item.id,
                quantity_change: item.quantity
            };

            // Send a POST request to update the stock
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

    // Main method to process the checkout
    async processCheckout() {
        try {
            // Validate stock before proceeding
            const isStockValid = await this.validateStockWithDatabase();
            if (!isStockValid) {
                // Redirect to the cart page if stock is insufficient
                window.location.href = 'index.html?showCart=true';
                return false;
            }

            // Update stock in the database
            await this.updateStockInDatabase();

            // Clear the user's shopping cart
            const cartManager = new CartManager();
            cartManager.clearCart();

            //  Placeholder: Order processing logic could be added here(not required for this assignment)

            // Redirect to the confirmation page after successful checkout
            window.location.href = 'confirmation.html';
            return true;
        } catch (error) {
            // Handle errors during the checkout process
            console.error('Error during checkout:', error);
            alert('An error occurred during checkout. Please try again.');
            return false;
        }
    }
}