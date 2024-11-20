const express = require("express");
const router = express.Router();
const Packages = require("../models/package");

// Test route
router.get("/test", (req, res) => res.send("package routes working"));

// Add a new package
router.post("/", (req, res) => {
    Packages.create(req.body)
        .then(() => res.json({ msg: "Package added successfully" }))
        .catch(() => res.status(400).json({ msg: "Failed to add package" }));
});

// Get all packages
router.get("/", (req, res) => {
    Packages.find()
        .then((packages) => res.json(packages))
        .catch(() => res.status(400).json({ msg: "No packages found" }));
});

// Get a package by ID
router.get("/:id", (req, res) => {
    Packages.findById(req.params.id)
        .then((pkg) => res.json(pkg))
        .catch(() => res.status(400).json({ msg: "Cannot find this package" }));
});

// Update a package by ID
router.put("/:id", (req, res) => {
    Packages.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedPkg) => res.json(updatedPkg))
        .catch(() => res.status(400).json({ msg: "Failed to update package" }));
});

// Delete a package by ID
router.delete("/:id", (req, res) => {
    Packages.findByIdAndDelete(req.params.id)
        .then(() => res.json({ msg: "Deleted successfully" }))
        .catch(() => res.status(400).json({ msg: "Failed to delete package" }));
});

module.exports = router;
