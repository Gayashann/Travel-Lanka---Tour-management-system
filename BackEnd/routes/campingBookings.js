const express = require("express");
const router = express.Router();
const CampingBooking = require("../models/CampingBooking");
const sendMail = require("../utils/sendMail");

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const newBooking = new CampingBooking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);

    sendMail({
      to: req.body.email,
      subject: "Camping Gear Booking Confirmation",
      text: "booking has been confirmed.",
      html: `
      <html>
        <body>
          <h2>booking has been confirmed!</h2>
          <p>
            <strong>Customer Name:</strong> ${req.body.name}<br>
            <strong>Customer Address:</strong> ${req.body.address}<br>
            <strong>Email:</strong> ${req.body.email}<br>
            <strong>Contact Number:</strong> ${req.body.contactNumber}<br>
            <strong>NIC:</strong> ${req.body.nic}<br>
            <strong>Booking Date:</strong> ${req.body.bookingDate}<br>
          </p>
          <p>Thank you for choosing our service!</p>
        </body>
      </html>
      `,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await CampingBooking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await CampingBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a booking by ID
router.delete("/:id", async (req, res) => {
  try {
    const booking = await CampingBooking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
