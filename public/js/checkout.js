import CartDisplayManager from './modules/checkout/CartDisplayManager.js';
import CheckoutProcessor from './modules/checkout/CheckoutProcessor.js';
import FormValidator from './modules/checkout/FormValidator.js';

// Initialize managers
const cartDisplayManager = new CartDisplayManager();
const checkoutProcessor = new CheckoutProcessor(cartDisplayManager.cart);
const formValidator = new FormValidator(document.getElementById('checkout-form'));

// Display cart and total price
cartDisplayManager.displayCartItems();
cartDisplayManager.displayTotalPrice();

// Disable "Submit Order" button if the cart is empty
const submitOrderButton = document.getElementById('submit-order');
if (Object.keys(cartDisplayManager.cart).length === 0) {
    submitOrderButton.disabled = true;
}

// Attach event listener for form submission
document.getElementById('checkout-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default submission behavior
    if (formValidator.validateForm()) {
        checkoutProcessor.processCheckout(); // Proceed if form is valid
    }
});