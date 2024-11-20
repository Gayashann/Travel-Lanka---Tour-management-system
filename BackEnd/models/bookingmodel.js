// models/Booking.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/ // Email validation
    },
    mobile: {
        type: String,
        required: true,
        match: /^\d{10}$/ // Mobile number validation (10 digits)
    },
    roomQuantity: {
        type: Number,
        required: true,
        min: 1 // At least one room must be booked
    },
    bookingDate: {
        type: Date,
        required: true // Make this field required
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
