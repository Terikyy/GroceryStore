export default class FormValidator {
    constructor(formElement) {
        this.formElement = formElement;

        // Bind event listeners for real-time validation
        this.bindEventListeners();
    }

    bindEventListeners() {
        // Add input listeners for real-time validation
        const fields = [
            { selector: '#email', validate: this.validateEmail },
            { selector: '#mobile', validate: this.validateMobile },
            { selector: '#first-name', validate: this.validateName },
            { selector: '#last-name', validate: this.validateName },
            { selector: '#street', validate: this.validateNotEmpty },
            { selector: '#area-code', validate: this.validatePostalCode },
            { selector: '#state', validate: this.validateNotEmpty }
        ];

        fields.forEach(field => {
            const inputElement = this.formElement.querySelector(field.selector);

            if (inputElement) {
                inputElement.addEventListener('input', (event) => {
                    const isValid = field.validate(event.target.value.trim());
                    this.toggleFieldError(event.target, isValid);
                });
            }
        });
    }

    toggleFieldError(field, isValid) {
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
        }
    }

    validateNotEmpty(value) {
        return value.length > 0;
    }

    validateEmail(value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
    }

    validateMobile(value) {
        const mobilePattern = /^\d{10}$/;
        return mobilePattern.test(value);
    }

    validateName(value) {
        const namePattern = /^[a-zA-Z\s]+$/;
        return namePattern.test(value);
    }

    validatePostalCode(value) {
        const postalCodePattern = /^\d{4}$/;
        return postalCodePattern.test(value);
    }

    validateForm() {
        // Perform full validation on form submission
        const email = this.formElement.querySelector('#email').value.trim();
        const mobile = this.formElement.querySelector('#mobile').value.trim();
        const firstName = this.formElement.querySelector('#first-name').value.trim();
        const lastName = this.formElement.querySelector('#last-name').value.trim();
        const street = this.formElement.querySelector('#street').value.trim();
        const areaCode = this.formElement.querySelector('#area-code').value.trim();
        const state = this.formElement.querySelector('#state').value;

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
            alert('Please fix the errors in the form before submitting.');
            return false;
        }
    }
}