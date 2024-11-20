const mongoose = require('mongoose');

const campingBookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  days: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const CampingBooking = mongoose.model('CampingBooking', campingBookingSchema);

module.exports = CampingBooking;
