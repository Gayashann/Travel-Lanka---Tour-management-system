const mongoose = require('mongoose');

// Check if the model is already defined to prevent overwriting
const BookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  rentalDuration: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  vehicle: {
    type: String,
  },
  customerNIC: {
    type: String,
    required: true,
  },
});

// Export the model only if it's not already compiled
module.exports = mongoose.models.VehicleBooking || mongoose.model('VehicleBooking', BookingSchema);
