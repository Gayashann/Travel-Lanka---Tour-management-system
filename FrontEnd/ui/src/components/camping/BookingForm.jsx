import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    bookingDate: '',
    nic: '',
    days: '', // New field for the number of days
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyPress = (e) => {
    const { name } = e.target;

    if (name === 'days') {
      e.preventDefault(); // Prevent any keyboard input for 'days'
    }

    if (name === 'name') {
      if (!/^[a-zA-Z\s]*$/.test(e.key)) {
        e.preventDefault();
      }
    }

    if (name === 'contactNumber') {
      if (!/^\d$/.test(e.key) || e.target.value.length >= 10) {
        e.preventDefault();
      }
    }

    if (name === 'nic') {
      if (!/^\d$/.test(e.key) && e.key !== 'V') {
        e.preventDefault();
      } else if (e.target.value.length >= 12 && e.key !== 'Backspace') {
        e.preventDefault();
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      errors.name = 'Name can only contain letters.';
    }

    if (formData.contactNumber.length !== 10 || !/^\d+$/.test(formData.contactNumber)) {
      errors.contactNumber = 'Contact number must be exactly 10 digits.';
    }

    if (formData.nic.length !== 12 || !/^\d{12}V?$/.test(formData.nic)) {
      errors.nic = 'NIC must be 12 digits followed by an optional V.';
    }

    if (!formData.days || formData.days <= 0) {
      errors.days = 'Please enter a valid number of days greater than 0.';
    }

    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join('\n'));
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/campingbookings', formData);
      console.log('Booking response:', response.data);
      navigate('/payment', { state: { bookingData: response.data.booking } }); // Pass bookingData to GearBill page
    } catch (error) {
      console.error('Error submitting the booking', error);
      alert('There was an error submitting your booking. Please try again.');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="BookingForm">
      <h1>Booking Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nic"
          placeholder="NIC"
          value={formData.nic}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          required
        />
        <input
          type="date"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          min={getTodayDate()}
          required
        />
        <input
          type="number"
          name="days"
          placeholder="Number of Days"
          value={formData.days}
          onChange={handleChange}
          min="1"
          required
        />
        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
};

export default BookingForm;
