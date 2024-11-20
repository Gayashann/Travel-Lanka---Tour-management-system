// src/components/Admin/UpdateVehicleForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Use useLocation to receive state

const UpdateVehicleForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Extract vehicle data from state
  const [vehicle, setVehicle] = useState(state.vehicle || {});

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/vehicles/${vehicle._id}`, vehicle);
      // Redirect to the vehicle list after updating
      navigate('/admin/vehicle-list');
    } catch (error) {
      console.error("Error updating vehicle:", error);
    }
  };

  return (
    <div className='container mt-5'>
      <h2>Update Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='vehicleName'>Vehicle Name</label>
          <input
            type='text'
            id='vehicleName'
            name='vehicleName'
            value={vehicle.vehicleName || ''}
            onChange={handleChange}
            className='form-control'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            id='price'
            name='price'
            value={vehicle.price || ''}
            onChange={handleChange}
            className='form-control'
          />
        </div>

        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            name='description'
            value={vehicle.description || ''}
            onChange={handleChange}
            className='form-control'
          />
        </div>

        <button type='submit' className='btn btn-success mt-3'>
          Update Vehicle
        </button>
      </form>
    </div>
  );
};

export default UpdateVehicleForm;
