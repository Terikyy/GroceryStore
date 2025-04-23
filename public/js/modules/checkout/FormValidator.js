export default class FormValidator {
    constructor(formElement) {
        // Store the form element to validate
        this.formElement = formElement;

        // Bind event listeners for real-time validation
        this.bindEventListeners();
    }

    // Attach input event listeners to form fields for real-time validation
    bindEventListeners() {
        const fields = [
            { selector: '#email', validate: this.validateEmail },
            { selector: '#mobile', validate: this.validateMobile },
            { selector: '#first-name', validate: this.validateName },
            { selector: '#last-name', validate: this.validateName },
            { selector: '#street', validate: this.validateNotEmpty },
            { selector: '#area-code', validate: this.validatePostalCode },
            { selector: '#state', validate: this.validateNotEmpty }
        ];

        // Loop through each field and add an input event listener
        fields.forEach(field => {
            const inputElement = this.formElement.querySelector(field.selector);

            if (inputElement) {
                inputElement.addEventListener('input', (event) => {
                    // Validate the field value and toggle error styling
                    const isValid = field.validate(event.target.value.trim());
                    this.toggleFieldError(event.target, isValid);
                });
            }
        });
    }

    // Toggle error or valid styling for a field
    toggleFieldError(field, isValid) {
        if (isValid) {
            field.classList.remove('error'); // Remove error styling
            field.classList.add('valid');   // Add valid styling
        } else {
            field.classList.remove('valid'); // Remove valid styling
            field.classList.add('error');    // Add error styling
        }
    }

    // Check if a value is not empty
    validateNotEmpty(value) {
        return value.length > 0;
    }

    // Validate email format
    validateEmail(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
    }

    // Validate mobile number format (10 digits)
    validateMobile(value) {
        const mobilePattern = /^\d{10}$/;
        return mobilePattern.test(value);
    }

    // Validate name format (letters and spaces only)
    validateName(value) {
        const namePattern = /^[a-zA-Z\s]+$/;
        return namePattern.test(value);
    }

    // Validate postal code format (4 digits)
    validatePostalCode(value) {
        const postalCodePattern = /^\d{4}$/;
        return postalCodePattern.test(value);
    }

    // Perform full validation on form submission
    validateForm() {
        const email = this.formElement.querySelector('#email').value.trim();
        const mobile = this.formElement.querySelector('#mobile').value.trim();
        const firstName = this.formElement.querySelector('#first-name').value.trim();
        const lastName = this.formElement.querySelector('#last-name').value.trim();
        const street = this.formElement.querySelector('#street').value.trim();
        const areaCode = this.formElement.querySelector('#area-code').value.trim();
        const state = this.formElement.querySelector('#state').value;

        // Validate all fields and return true if all are valid
        if (
            this.validateEmail(email) &&
            this.validateMobile(mobile) &&
            this.validateName(firstName) &&
            this.validateName(lastName) &&
            this.validateNotEmpty(street) &&
            this.validatePostalCode(areaCode) &&
            this.validateNotEmpty(state)
        ) {
            return true;
        } else {
            // Alert the user if there are errors
            alert('Please fix the errors in the form before submitting.');
            return false;
        }
    }
}