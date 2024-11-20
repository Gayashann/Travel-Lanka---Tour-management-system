// routes/campingGearRoutes.js

const express = require('express');
const CampingGear = require('../models/CampingGear');

const router = express.Router();

// Create a new camping gear item
router.post('/', async (req, res) => {
  try {
    const gear = new CampingGear(req.body);
    await gear.save();
    res.status(201).json(gear);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all camping gear items
router.get('/', async (req, res) => {
  try {
    const gearItems = await CampingGear.find();
    res.status(200).json(gearItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a camping gear item
router.put('/:id', async (req, res) => {
  try {
    const gear = await CampingGear.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(gear);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a camping gear item
router.delete('/:id', async (req, res) => {
  try {
    await CampingGear.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
