import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PackageDetails.css';

const PackageDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { card } = location.state;

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    contactNumber: '',
    numberOfPeople: '',
    address: '',
    startDate: '',
  });

  // Function to get today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set minimum start date (today) and maximum start date (2 years from now)
  const [minStartDate, setMinStartDate] = useState(getTodayDate());
  const [maxStartDate, setMaxStartDate] = useState(
    `${new Date().getFullYear() + 2}-12-31` // December 31 of two years from now
  );

  // Handle changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Restrict input to only numbers for contact number field and show alert for invalid input
  const handleNumberKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    const charStr = String.fromCharCode(charCode);

    if (!/^[0-9]+$/.test(charStr)) {
      e.preventDefault();
      window.alert('Only numbers are allowed in the Contact Number.');
    }
  };

  // Restrict input to only letters and spaces for customer name field and show alert for invalid input
  const handleNameKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    const charStr = String.fromCharCode(charCode);

    if (!/^[a-zA-Z\s]+$/.test(charStr)) {
      e.preventDefault();
      window.alert('Only letters and spaces are allowed in the Name.');
    }
  };

  // Prevent keyboard input for number of people and start date
  const handleKeyDown = (e) => {
    e.preventDefault();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const { customerName, email, contactNumber, numberOfPeople, address, startDate } = formData;

    if (!/^[A-Za-z\s]+$/.test(customerName)) {
      window.alert("Name can only contain letters and spaces.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      window.alert("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      window.alert("Contact number must be exactly 10 digits.");
      return;
    }

    if (numberOfPeople < 1 || isNaN(numberOfPeople)) {
      window.alert("Number of people must be a positive number.");
      return;
    }

    if (!address) {
      window.alert("Address is required.");
      return;
    }

    if (!startDate) {
      window.alert("Please select a start date.");
      return;
    }

    const totalPrice = card.price * numberOfPeople;

    navigate('/bill', { state: { formData, packagePrice: totalPrice } });
  };

  return (
    <div className="package-details-container">
      <div className="package-card">
        <h1>{card.name}</h1>
        <img src={card.image} alt={card.name} className="detail-image" />
        <p><strong>Price:</strong> Rs {card.price}</p>
        <p><strong>Location:</strong> {card.location}</p>
        <p><strong>Duration:</strong> {card.duration} </p>
        <p><strong>Description:</strong> {card.description}</p>
        <button className="back-button" onClick={() => window.history.back()}>Back to Packages</button>
      </div>

      <div className="booking-form">
        <h2>Booking Form</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="customerName">Name:</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              onKeyPress={handleNameKeyPress}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="contactNumber">Contact Number:</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              onKeyPress={handleNumberKeyPress}
              maxLength="10"
              required
            />
          </div>
          <div>
            <label htmlFor="numberOfPeople">Number of People:</label>
            <input
              type="number"
              id="numberOfPeople"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Prevent keyboard input
              required
              min="1"
            />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="startDate">Package Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              onKeyDown={handleKeyDown} // Prevent keyboard input
              min={minStartDate}
              max={maxStartDate} // Set max date to 2 years from now
              required
            />
          </div>
          <button type="submit" className="submit-button">Book</button>
        </form>
      </div>
    </div>
  );
};

export default PackageDetails;
