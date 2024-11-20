import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddVehicleForm from './AddVehicleForm';
import VehicleCard from './VehicleCard';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminVehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate = useNavigate(); // Create navigate function

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/vehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/vehicles/${id}`);
      setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleUpdate = (vehicle) => {
    setSelectedVehicle(vehicle); // Set selected vehicle for updating
    setIsAddModalOpen(true); // Open modal for updating
  };

  const handleVehicleAdded = (newVehicle) => {
    fetchVehicles();
    setIsAddModalOpen(false);
    setSelectedVehicle(null); // Reset selectedVehicle after adding/updating
  };

  const openAddNewVehicleForm = () => {
    setSelectedVehicle(null); // Clear selected vehicle for adding new
    setIsAddModalOpen(true); // Open modal for adding
  };

  // New function to handle navigation
  const handleViewBookings = () => {
    navigate('/Vehiclebookings'); // Navigate to Booking Table
  };

  return (
    <div
      className='container mt-5'
      style={{
        background: '',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      <Button variant="contained" color="primary" onClick={openAddNewVehicleForm}>
        Add New Vehicle
      </Button>
      <Button variant="contained" color="primary" onClick={handleViewBookings}> {/* Add onClick handler */}
        View Bookings
      </Button>
      <br /><br />
      <div className='row mt-4'>
        {vehicles.map((vehicle) => (
          <div className='col-md-4' key={vehicle._id}>
            <VehicleCard
              vehicle={vehicle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              className='vehicle-card'
            />
          </div>
        ))}
      </div>

      <AddVehicleForm
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onVehicleAdded={handleVehicleAdded}
        vehicle={selectedVehicle} // Pass selected vehicle for updating, null for adding
      />
    </div>
  );
};

export default AdminVehicleList;
