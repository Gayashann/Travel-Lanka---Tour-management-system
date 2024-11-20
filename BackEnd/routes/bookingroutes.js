const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingmodel"); // Make sure to replace this with your actual Booking model
const Hotel = require("../models/hotelmodel"); // Replace with your actual Hotel model
const sendMail = require("../utils/sendMail");

// POST: Create a new booking
router.post("/add", async (req, res) => {
  const { hotelId, name, email, mobile, roomQuantity, bookingDate } = req.body;

  try {
    // Create a new booking record
    const newBooking = new Booking({
      hotelId,
      name,
      email,
      mobile,
      roomQuantity,
      bookingDate,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking created successfully", data: newBooking });

    const htmlContent = `
    <html>
        <body>
        <h2>Your booking has been confirmed!</h2>
        <p>
            <strong>Booking ID:</strong> ${newBooking._id}<br>
            <strong>Hotel ID:</strong> ${hotelId}<br>
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Mobile:</strong> ${mobile}<br>
            <strong>Room Quantity:</strong> ${roomQuantity}<br>
            <strong>Booking Date:</strong> ${bookingDate}<br>
        </p>
        <p>Thank you for choosing our service!</p>
        </body>
    </html>
    `;

    await sendMail({
      to: email,
      subject: "Booking Confirmation",
      text: `Your booking has been confirmed.`,
      html: htmlContent,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
});

// GET: Fetch hotel details by ID
router.get("/hotel/:id", async (req, res) => {
  const hotelId = req.params.id;

  try {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ data: hotel });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching hotel details", error: error.message });
  }
});

// GET: Fetch all bookings
router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetch all bookings
    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
});

// DELETE: Delete booking by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res
      .status(500)
      .json({ message: "Error deleting booking", error: error.message });
  }
});

module.exports = router;
