// src/components/TravelManagement.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TravelManagement.css'; // Ensure this CSS file exists

const TravelManagement = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  return (
    <div className="travel-management">
      <h1>Travel Lanka</h1>
      <h1>Welcome to Our Travel Management System</h1>
      <div className="button-container">
        <button onClick={() => navigate('/admin')} className="btn">Packages</button>
        <button onClick={() => navigate('/admin/bookings')} className="btn">Bookings</button>
      </div>
    </div>
  );
};

export default TravelManagement;
