const express = require('express');
const router = express.Router();
const Vehicle = require("../models/Vehicle"); // Correct the import

// Test route
router.get("/Vehicle", (req, res) => res.send("vehicle routes working"));

// Create a vehicle
router.post("/", (req, res) => {
    Vehicle.create(req.body)
        .then(() => res.json({ msg: "Vehicle added successfully" }))
        .catch(() => res.status(400).json({ msg: "Vehicle Adding failed" }));
});

// Get all vehicles
router.get("/", (req, res) => {
    Vehicle.find()  // Corrected the model name
        .then(vehicles => res.json(vehicles)) // Corrected response variable name
        .catch(err => res.status(400).json({ msg: "Error retrieving vehicles" }));
});

// Get vehicle by ID
router.get("/:id", (req, res) => {
    Vehicle.findById(req.params.id)
        .then(vehicle => {
            if (vehicle) {
                res.json(vehicle);
            } else {
                res.status(404).json({ msg: "Vehicle not found" });
            }
        })
        .catch(() => res.status(400).json({ msg: "Cannot find this vehicle" }));
});

// Update vehicle by ID
router.put("/:id", (req, res) => {
    Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(vehicle => {
            if (vehicle) {
                res.json({ msg: "Update Successfully", vehicle });
            } else {
                res.status(404).json({ msg: "Vehicle not found" });
            }
        })
        .catch(() => res.status(400).json({ msg: "Cannot update this vehicle" }));
});

// Delete vehicle by ID
router.delete("/:id", (req, res) => {
    Vehicle.findByIdAndDelete(req.params.id)
        .then(vehicle => {
            if (vehicle) {
                res.json({ msg: "Delete Successfully" });
            } else {
                res.status(404).json({ msg: "Vehicle not found" });
            }
        })
        .catch(() => res.status(400).json({ msg: "Cannot delete this vehicle" }));
});

module.exports = router;
