const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    numberOfPeople: { type: Number, required: true },
    address: { type: String, required: true },
    tourGuide: { type: Boolean, default: false },
    totalPrice: { type: Number, required: true },
    startDate: { type: Date, required: true }, // Added startDate field
    bookingDate: {
        type: Date,
        default: Date.now, // Automatically sets the booking date to the current date
    },
}, { timestamps: true });

module.exports = mongoose.model('Packagebooking', bookingSchema);
