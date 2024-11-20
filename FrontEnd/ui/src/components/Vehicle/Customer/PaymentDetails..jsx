import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Checkbox, FormControlLabel, Typography, Snackbar } from '@mui/material';
import CustomerVehicleCard from './CustomerVehicleCard';

const PaymentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  // Ensure you have rentalPrice and rentalDuration passed in state
  const {rentalPrice, rentalDuration } = location.state || { rentalPrice: 0, rentalDuration: 1 };

  const [additionalCharges, setAdditionalCharges] = useState({
    driver: false,
    spareWheel: false,
    toolkit: false,
  });

  const [isBookingSuccess, setIsBookingSuccess] = useState(false); // Success state for Snackbar

  const TAX_PERCENTAGE = 8; // Example tax percentage

  // Calculate total price before tax
  const calculateSubTotal = () => {
    let total = rentalPrice * rentalDuration;
    if (additionalCharges.driver) total += 1500; // Example charge for driver
    if (additionalCharges.spareWheel) total += 500; // Example charge for spare wheel
    if (additionalCharges.toolkit) total += 500; // Example charge for toolkit
    return total;
  };

  // Calculate total including taxes
  const calculateTotalWithTax = () => {
    const subTotal = calculateSubTotal();
    const taxAmount = (subTotal * TAX_PERCENTAGE) / 100;
    return (subTotal + taxAmount).toFixed(2); // Return total with taxes, rounded to 2 decimals
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAdditionalCharges((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePayment = () => {
    // You can include logic to process the payment here.
    // After payment processing, show the success notification:
    setIsBookingSuccess(true);
  };

  const handleCloseSnackbar = () => {
    setIsBookingSuccess(false); // Close the success notification
    navigate('/payment'); // Navigate to home after closing the snackbar
  };

  console.log("Rental Price:", rentalPrice);
  console.log("Rental Duration:", rentalDuration);

  return (
    <div style={styles.container}>
      <Typography variant="h5" style={styles.heading}>Payment Details</Typography>
      <Typography variant="body1" style={styles.text}>
        Rental Price (per day): <span style={styles.price}>LKR {rentalPrice}</span>
      </Typography>
      <Typography variant="body1" style={styles.text}>
        Rental Duration: <span style={styles.price}>{rentalDuration} days</span>
      </Typography>

      <div style={styles.checkboxContainer}>
        <FormControlLabel
          control={
            <Checkbox
              checked={additionalCharges.driver}
              onChange={handleCheckboxChange}
              name="driver"
              style={styles.checkbox}
            />
          }
          label="Add Driver (LKR 1500)"
          style={styles.label}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={additionalCharges.spareWheel}
              onChange={handleCheckboxChange}
              name="spareWheel"
              style={styles.checkbox}
            />
          }
          label="Add Spare Wheel (LKR 500)"
          style={styles.label}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={additionalCharges.toolkit}
              onChange={handleCheckboxChange}
              name="toolkit"
              style={styles.checkbox}
            />
          }
          label="Add Toolkit (LKR 500)"
          style={styles.label}
        />
      </div>

      <Typography variant="body1" style={styles.text}>
        Subtotal: <span style={styles.price}>LKR {calculateSubTotal()}</span>
      </Typography>
      <Typography variant="body1" style={styles.text}>
        Total (including {TAX_PERCENTAGE}% tax): <span style={styles.price}>LKR {calculateTotalWithTax()}</span>
      </Typography>

      <Button variant="contained" color="primary" onClick={handlePayment}>
        Confirm Payment
      </Button>

      {/* Snackbar for booking success message */}
      <Snackbar
        open={isBookingSuccess}
        onClose={handleCloseSnackbar}
        message="Booking Successful!"
        autoHideDuration={3000} // Automatically hide after 3 seconds
      />
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff', 
  },
  heading: {
    marginBottom: '20px',
  },
  text: {
    marginBottom: '10px',
  },
  price: {
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginBottom: '20px',
  },
  checkbox: {
    color: '#1976d2', // Change checkbox color
  },
  label: {
    marginRight: '20px', // Space between labels
  },
};

export default PaymentDetails;
