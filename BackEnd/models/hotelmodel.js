const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  roomsAvailable: { type: Number, required: true },
  amenities: [String],
  image: { type: String }, // Image URL for the hotel
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
