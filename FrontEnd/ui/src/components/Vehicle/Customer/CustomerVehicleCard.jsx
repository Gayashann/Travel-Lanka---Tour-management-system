import React, { useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Modal, Typography, Box } from '@mui/material';
import VehicleBookingForm from './VehicleBookingForm';
import { LocalGasStation, Event, AttachMoney, DirectionsCar, People } from '@mui/icons-material';
import './CustomerVehicleCard.css';

const CustomerVehicleCard = ({ vehicle }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    email: '',
    bookingDate: '',
    rentalDuration: '',
    customerNIC: '',
  });

  const handleBook = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/booking', {
        ...formData,
        vehicleId: vehicle._id,
        vehicleName: vehicle.VehicleName,
      });
      console.log('Booking submitted successfully');
      handleClose();
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  return (
    <Card className="vehicle-card">
      <CardContent>
        <img src={vehicle.image} alt={vehicle.VehicleName} className="vehicle-image" />
        <Typography variant="h5" className="vehicle-brand">{vehicle.BrandName}</Typography>

        <Typography variant="h6" className="vehicle-name">{vehicle.VehicleName}</Typography>
        
        {/* Vehicle Details with Icons */}
        <div className="vehicle-details">
          <div className="vehicle-detail-item">
            <DirectionsCar className="detail-icon car" />
            <Typography variant="body2">{vehicle.VehicleProductYear}</Typography>
          </div>
          <div className="vehicle-detail-item">
            <LocalGasStation className="detail-icon fuel" />
            <Typography variant="body2">{vehicle.FuelType}</Typography>
          </div>
          <div className="vehicle-detail-item">
            <AttachMoney className="detail-icon lkr" />
            <Typography variant="body2">LKR {vehicle.rentalPrice}</Typography>
          </div>
          <div className="vehicle-detail-item">
            <People className="detail-icon capacity" />
            <Typography variant="body2">{vehicle.Capacity}</Typography>
          </div>
        </div>

        <Button size="small" color="primary" onClick={handleBook} className="booking-button">
          <span>Book</span>
        </Button>  
      </CardContent>

      <Modal open={open} onClose={handleClose}>
        <Box className="modal-box">
          <div className="modal-content">
            <div className="vehicle-details-modal">
              <img src={vehicle.image} alt={vehicle.VehicleName} className="vehicle-modal-image" />
              <Typography variant="h6" className="vehicle-brand">{vehicle.BrandName}</Typography>
              <Typography variant="h8" className="vehicle-name">{vehicle.VehicleName}</Typography>
              <Typography variant="body2" className="typography">Product Year: {vehicle.VehicleProductYear}</Typography>
              <Typography variant="body2" className="typography">Fuel Type: {vehicle.FuelType}</Typography>
              <Typography variant="body2" className="typography">Capacity: {vehicle.Capacity}</Typography>
              <Typography variant="body2" className="typography price">Price: LKR {vehicle.rentalPrice}</Typography>
              <Typography variant="body2" className="typography rental-terms">Rental Terms: {vehicle.rentalTerms}</Typography>
              <Typography variant="body2" className="typography">Transmission: {vehicle.Transmission}</Typography>
            </div>
            <div className="booking-form-column">
              <VehicleBookingForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                onClose={handleClose} // Pass onClose to the form
              />
            </div>
          </div>
        </Box>
      </Modal>
    </Card>
  );
};

export default CustomerVehicleCard;
