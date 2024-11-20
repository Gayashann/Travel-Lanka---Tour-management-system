import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VehicleBookingForm.css';

const VehicleBookingForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    email: '',
    bookingDate: '',
    rentalDuration: '',
    customerNIC: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Updated NIC validation to allow both formats (9 digits + V/v or 12 digits)
  const validateNIC = (nic) => {
    const oldNICPattern = /^\d{10}[Vv]$/; // 9 digits followed by V or v
    const newNICPattern = /^\d{12}$/; // Exactly 12 digits
    return oldNICPattern.test(nic) || newNICPattern.test(nic);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent entering numbers in the name field
    if (name === 'customerName' && /\d/.test(value)) {
      return;
    }

    // Only allow up to 10 digits in the contact number field
    if (name === 'contactNumber' && !/^\d{0,10}$/.test(value)) {
      return;
    }

    // Limit NIC field to 12 characters maximum
    if (name === 'customerNIC' && !/^\d{0,12}[Vv]?$/.test(value)) {
      return;
    }

    // Ensure rental duration is between 1 and 10
    if (name === 'rentalDuration' && (value < 1 || value > 10)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // Validate NIC
    if (!validateNIC(formData.customerNIC)) {
      setErrors({ customerNIC: 'NIC must be either 10 digits followed by V/v or exactly 12 digits' });
      return;
    }

    // Validate contact number length
    if (formData.contactNumber.length !== 10) {
      setErrors({ contactNumber: 'Contact number must be exactly 10 digits' });
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/Vehiclebooking', formData);
      navigate('/paymentDetails', {
        state: {
          rentalPrice: 5000,
          rentalDuration: formData.rentalDuration,
        },
      });
      onClose();
    } catch (error) {
      console.error('Booking submission failed', error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="vehicle-form-container">
      <h2 className="vehicle-form-heading">Vehicle Booking Form</h2>
      <form onSubmit={handleFormSubmit} className="vehicle-form-fields">
        <TextField
          label="Full Name"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="National ID (NIC)"
          name="customerNIC"
          value={formData.customerNIC}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.customerNIC}
          helperText={errors.customerNIC}
        />
        <TextField
          label="Contact Number"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ maxLength: 10 }}
          error={!!errors.contactNumber}
          helperText={errors.contactNumber}
        />
        <TextField
          label="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          type="email"
        />
        <TextField
          label="Booking Date"
          name="bookingDate"
          type="date"
          value={formData.bookingDate}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: getTomorrowDate(),
            max: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
          }}
        />
        <TextField
          label="Rental Duration (days)"
          name="rentalDuration"
          type="number"
          value={formData.rentalDuration}
          onChange={handleChange}
          fullWidth
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="vehicle-form-submit-btn"
        >
          Book Now
        </Button>
      </form>
    </div>
  );
};

export default VehicleBookingForm;
