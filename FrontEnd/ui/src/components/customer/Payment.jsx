import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css'; // Add the CSS file for Payment page

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Debugging: log location.state to see what is being passed
    console.log('Location state:', location.state);

    // Extract totalPrice and customerDetails from location.state or use default values if undefined
    const { totalPrice = 0, customerDetails = { customerName: 'Unknown' } } = location.state || {};

    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: ''
    });

    const [expiryError, setExpiryError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Function to format card number (add space after every 4 digits)
    const formatCardNumber = (value) => {
        const digitsOnly = value.replace(/\D/g, ''); // Remove all non-digit characters
        const formattedCardNumber = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 '); // Add a space after every 4 digits
        return formattedCardNumber;
    };

    // Handle card number change and format input
    const handleCardNumberChange = (e) => {
        const formattedValue = formatCardNumber(e.target.value);
        setCardDetails((prev) => ({ ...prev, cardNumber: formattedValue }));
    };

    // Allow only numbers for the card number field
    const handleCardNumberKeyPress = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode < 48 || charCode > 57) { // ASCII range for numbers 0-9
            e.preventDefault();
        }
    };

    // Allow only letters for the cardholder name field
    const handleCardNameKeyPress = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (
            (charCode < 65 || charCode > 90) && // A-Z
            (charCode < 97 || charCode > 122) && // a-z
            charCode !== 32 // Space
        ) {
            e.preventDefault();
        }
    };

    // Validate expiry date input as MM/YY and block invalid entries
    const handleExpiryDateChange = (e) => {
        let input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

        if (input.length > 4) {
            input = input.slice(0, 4); // Limit to 4 digits (MMYY)
        }

        let month = input.slice(0, 2);
        let year = input.slice(2);

        // Validate month (01-12)
        if (month && (parseInt(month, 10) < 1 || parseInt(month, 10) > 12)) {
            month = ''; // Block invalid month input
        }

        // Validate year (current year or future)
        if (year.length === 2) {
            const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
            const enteredYear = parseInt(year, 10);
            if (enteredYear < currentYear) {
                year = ''; // Block past year input
            }
        }

        // Update input field with valid MM/YY
        if (input.length >= 2) {
            input = `${month}/${year}`;
        }

        setCardDetails((prev) => ({ ...prev, expiryDate: input }));
    };

    // Allow only numbers for the expiry date
    const handleExpiryDateKeyPress = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode < 48 || charCode > 57) { // Only allow digits (0-9)
            e.preventDefault();
        }
    };

    // Allow only numbers for the CVV and limit to 3 digits
    const handleCVVKeyPress = (e) => {
        const charCode = e.which ? e.which : e.keyCode;
        if (charCode < 48 || charCode > 57) { // Only allow digits (0-9)
            e.preventDefault();
        }
    };

    const handlePayment = (e) => {
        e.preventDefault();
        if (expiryError) {
            alert('Please fix the errors before submitting.');
            return;
        }
        // Process the payment (API call to payment gateway, etc.)
        alert('Payment successful!');
        navigate('/'); // Redirect to the home page after successful payment
    };

    return (
        <div className="payment-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                Back
            </button>
            <h1>Payment</h1>
            
            <form onSubmit={handlePayment} className="payment-form">
                <div className="form-group">
                    <label>Card Number</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardNumberChange} // Handle card number change and format it
                        onKeyPress={handleCardNumberKeyPress} // Only allow numeric input
                        required
                        maxLength="19" // Max length is 19 (16 digits + 3 spaces)
                        placeholder="1234 5678 9012 3456"
                        title="Card number must be 16 digits"
                    />
                </div>
                <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                        type="text"
                        name="cardHolderName"
                        value={cardDetails.cardHolderName}
                        onChange={handleChange}
                        onKeyPress={handleCardNameKeyPress} // Only allow letters and spaces
                        required
                        pattern="[A-Za-z\s]+"
                        placeholder="John Doe"
                        title="Cardholder name can only contain letters"
                    />
                </div>
                <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                        type="text"
                        name="expiryDate"
                        value={cardDetails.expiryDate}
                        onChange={handleExpiryDateChange} // Handle expiry date change and format to MM/YY
                        onKeyPress={handleExpiryDateKeyPress} // Only allow numbers
                        required
                        maxLength="5" // Max length is 5 (MM/YY)
                        placeholder="MM/YY"
                        title="Expiry date must be in MM/YY format"
                    />
                </div>
                <div className="form-group">
                    <label>CVV</label>
                    <input
                        type="password"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleChange}
                        onKeyPress={handleCVVKeyPress} // Only allow numeric input
                        required
                        maxLength="3" // Max length is 3 digits
                        pattern="\d{3}"
                        placeholder="123"
                        title="CVV must be 3 digits"
                    />
                </div>
                <button type="submit" className="pay-button">Pay</button>
            </form>
        </div>
    );
};

export default Payment;
