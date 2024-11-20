const express = require("express");
const router = express.Router();
const VehicleBooking = require("../models/VehicleBooking"); // Import the Booking model
const sendMail = require("../utils/sendMail");

// Test route
router.get("/VehicleBooking", (req, res) => res.send("Booking routes working"));

// Create a booking
router.post("/", async (req, res) => {
  // VehicleBooking.create(req.body)
  //   .then(() => {
  //     res.json({ msg: "Booking added successfully" });
  //   })
  //   .catch(() => res.status(400).json({ msg: "Booking adding failed" }));

  try {
    const bookingDetails = req.body;

    const newBooking = new VehicleBooking(bookingDetails);
    await newBooking.save();

    res
      .status(201)
      .json({ message: "Booking saved successfully", booking: newBooking });

    const htmlContent = `
    <html>
        <body>
        <h2>
            Your vehicle is successfully booked!
        </h2>
        <p>
            <strong>Booking ID:</strong> ${newBooking._id}<br>
            <strong>Customer Name:</strong> ${req.body.customerName}<br>
            <strong>Contact Number:</strong> ${req.body.contactNumber}<br>
            <strong>Email:</strong> ${req.body.email}<br>
            <strong>Booking Date:</strong> ${req.body.bookingDate}<br>
            <strong>Rental Duration:</strong> ${req.body.rentalDuration}<br>
            </p>
        <p>Thank you for choosing our service!</p>
        </body>
    </html>
    `;

    sendMail({
      to: req.body.email,
      subject: "Vehicle Booked",
      text: `Your vehicle has been booked successfully.`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error saving booking:", error.message);
    res
      .status(500)
      .json({ message: "Error saving booking", error: error.message });
  }
});

// Get all bookings
router.get("/", (req, res) => {
  VehicleBooking.find()
    .then((bookings) => res.json(bookings))
    .catch((err) => res.status(400).json({ msg: "Error retrieving bookings" }));
});

// Update a booking
router.put("/:id", (req, res) => {
  VehicleBooking.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({ msg: "Booking updated successfully" }))
    .catch(() => res.status(400).json({ msg: "Booking update failed" }));
});

// Delete a booking
router.delete("/:id", (req, res) => {
  VehicleBooking.findByIdAndDelete(req.params.id)
    .then(() => res.json({ msg: "Booking deleted successfully" }))
    .catch(() => res.status(400).json({ msg: "Booking deletion failed" }));
});

module.exports = router;
