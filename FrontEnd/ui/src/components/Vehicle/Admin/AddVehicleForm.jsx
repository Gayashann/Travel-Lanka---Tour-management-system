import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const VehicleFormModal = ({ open, onClose, onVehicleAdded, vehicle }) => {
  const [formData, setFormData] = useState({
    VehicleName: '',
    VehicleProductYear: '',
    rentalPrice: '',
    rentalTerms: '',
    Capacity: '',
    FuelType: '',
    image: '',
    BrandName: '',
    Transmission: '',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    } else {
      resetForm();
    }
  }, [vehicle]);

  const resetForm = () => {
    setFormData({
      VehicleName: '',
      VehicleProductYear: '',
      rentalPrice: '',
      rentalTerms: '',
      Capacity: '',
      FuelType: '',
      image: '',
      BrandName: '',
      Transmission: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation logic
    if (name === 'rentalPrice' && (!/^\d*$/.test(value) || value > 100000)) return; // Limit rental price
    if (name === 'Capacity' && (value < 1 || value > 20)) return; // Ensure capacity between 1 and 20

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (vehicle) {
        await axios.put(`http://localhost:4000/api/vehicles/${vehicle._id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/vehicles', formData);
      }
      resetForm();
      onVehicleAdded();
      onClose();
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="custom-form-modal">
        <style>
          {`
            .custom-form-modal {
              background-color: #2C2F33;
              padding: 40px;
              border-radius: 15px;
              box-shadow: 0 10px 50px rgba(0, 0, 0, 0.4);
              max-width: 650px;
              margin: 50px auto;
              color: #FFF;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              animation: fadeIn 0.5s ease-in-out;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }

            .form-title {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 25px;
              text-align: center;
              text-transform: uppercase;
              color: #fff;
              letter-spacing: 2px;
              background: -webkit-linear-gradient(left, #6dd5ed, #2193b0);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
            }

            .custom-form {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 20px;
            }

            .custom-form input, .custom-form select {
              padding: 12px;
              font-size: 16px;
              background-color: #444;
              color: white;
              border: 2px solid #555;
              border-radius: 10px;
              transition: border-color 0.3s ease, box-shadow 0.3s ease;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            }

            .custom-form input:focus, .custom-form select:focus {
              border-color: #6dd5ed;
              outline: none;
              box-shadow: 0 0 8px rgba(109, 221, 237, 0.7);
            }

            .form-control {
              margin-bottom: 20px;
            }

            .submit-btn {
              grid-column: 1 / span 2;
              background-color: #6dd5ed;
              color: white;
              font-weight: bold;
              padding: 12px 15px;
              border-radius: 10px;
              margin-top: 25px;
              text-transform: uppercase;
              text-align: center;
              letter-spacing: 1.5px;
              transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
              border: none;
              cursor: pointer;
            }

            .submit-btn:hover {
              background-color: #2193b0;
              transform: translateY(-2px);
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
            }

            @media (max-width: 650px) {
              .custom-form {
                grid-template-columns: 1fr;
              }
            }
          `}
        </style>

        <h2 className="form-title">{vehicle ? 'Update Vehicle' : 'Add New Vehicle'}</h2>

        <form className="custom-form" onSubmit={handleSubmit}>
          {/* Left Side Fields */}
          <TextField
            name="VehicleName"
            label="Vehicle Name"
            value={formData.VehicleName}
            onChange={handleChange}
            fullWidth
            required
            className="text-field"
          />
          <TextField
            name="BrandName"
            label="Brand Name"
            value={formData.BrandName}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel style={{ color: '#bbb' }}>Product Year</InputLabel>
            <Select
              name="VehicleProductYear"
              value={formData.VehicleProductYear}
              onChange={handleChange}
            >
              {/* Generate year options from 1990 to the current year */}
              {[...Array(currentYear - 1990 + 1)].map((_, index) => {
                const year = 1990 + index;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            name="image"
            label="Image URL"
            value={formData.image}
            onChange={handleChange}
            fullWidth
          />

          {/* Right Side Fields */}
          <TextField
            name="rentalPrice"
            label="Rental Price"
            type="number"
            value={formData.rentalPrice}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="rentalTerms"
            label="Rental Terms"
            value={formData.rentalTerms}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="Capacity"
            label="Capacity"
            type="number"
            value={formData.Capacity}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel style={{ color: '#bbb' }}>Transmission</InputLabel>
            <Select
              name="Transmission"
              value={formData.Transmission}
              onChange={handleChange}
            >
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="automatic">Automatic</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel style={{ color: '#bbb' }}>Fuel Type</InputLabel>
            <Select
              name="FuelType"
              value={formData.FuelType}
              onChange={handleChange}
            >
              <MenuItem value="hybrid">Hybrid</MenuItem>
              <MenuItem value="electric">Electric</MenuItem>
              <MenuItem value="petrol">Petrol</MenuItem>
              <MenuItem value="diesel">Diesel</MenuItem>
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button className="submit-btn" type="submit" variant="contained">
            {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default VehicleFormModal;
