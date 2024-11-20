const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  VehicleID: {
    type: String,
  },
  BrandName :{
    type: String,
    required: true,
    
  },
  Transmission: {
    type: String,
    required: true,
    enum: ['manual', 'automatic'],

  },
  VehicleName: {
    type: String,
    required: true,
  },
  VehicleProductYear: {
    type: Number,
    required: true,
  },
  rentalPrice: {
    type: String,
  },
  rentalTerms: {
    type: String,
    required: true,
  },
  Capacity: {
    type: Number,
    required: true,
  },
  FuelType: {
    type: String,
    required: true,
    enum: ['hybrid', 'electric', 'petrol', 'diesel'],
  },
  // New field to store the image URL
  image: {
    type: String,
  },
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
