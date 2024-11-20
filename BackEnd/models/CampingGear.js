// models/CampingGear.js

const mongoose = require('mongoose');

const CampingGearSchema = new mongoose.Schema({
  gearName: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
 
  imageUrl: {
    type: String,
    required: true, // Ensure the imageUrl is a required field
  },
}, { timestamps: true });

const CampingGear = mongoose.model('CampingGear', CampingGearSchema);

module.exports = CampingGear;
