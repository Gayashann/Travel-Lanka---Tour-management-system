import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';

const PaymentPage = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment logic here
    console.log("Payment Data Submitted: ", paymentData);
    // Redirect to confirmation or another page if needed
  };

  return (
    <div className="payment-page">
      <Typography variant="h4" gutterBottom>
        Payment Details
      </Typography>
      <form onSubmit={handleSubmit} className="payment-form">
        <TextField
          label="Card Number"
          name="cardNumber"
          value={paymentData.cardNumber}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Cardholder Name"
          name="cardName"
          value={paymentData.cardName}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Expiry Date"
          name="expiryDate"
          type="month" // Change input type for month
          value={paymentData.expiryDate}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="CVV"
          name="cvv"
          type="number"
          value={paymentData.cvv}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Pay Now
        </Button>
      </form>
    </div>
  );
};

export default PaymentPage;
