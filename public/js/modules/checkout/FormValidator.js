export default class FormValidator {
    constructor(formElement) {
        this.formElement = formElement;
    }

    validate() {
        const address = this.formElement.querySelector('#address').value;
        const city = this.formElement.querySelector('#city').value;
        const postalCode = this.formElement.querySelector('#postal-code').value;

        if (!address || !city || !postalCode) {
            alert('Please fill in all address fields.');
            return false;
        }

        // Validate postal code for Australian format (e.g., 3000)
        const postalCodePattern = /^\d{4}$/;
        if (!postalCodePattern.test(postalCode)) {
            alert('Please enter a valid postal code.');
            return false;
        }

        return true;
    }
}