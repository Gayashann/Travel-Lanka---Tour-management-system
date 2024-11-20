const express = require("express");
const hotelModel = require("../models/hotelmodel"); // Assuming you have a hotel schema
const upload = require("../middleware/multerConfig"); // Multer configuration for handling image uploads
const path = require("path");

const router = express.Router();

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Get all hotels
router.get("/hotel", async (req, res) => {
    try {
        const hotels = await hotelModel.find({});
        const dataWithImages = hotels.map(hotel => ({
            ...hotel._doc,
            imageUrl: hotel.image ? `${req.protocol}://${req.get('host')}/uploads/${hotel.image}` : null
        }));
        res.json({ success: true, data: dataWithImages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// Create a new hotel with optional image upload
router.post("/hotel_create", upload.single('image'), async (req, res) => {
    try {
        const { name, location, price, roomsAvailable, amenities } = req.body;
        const image = req.file ? req.file.filename : null;

        const newHotel = new hotelModel({
            name,
            location,
            price,
            roomsAvailable,
            amenities: amenities.split(',').map(amenity => amenity.trim()), // assuming amenities come as a comma-separated string
            image
        });

        await newHotel.save();
        res.send({ success: true, message: "Hotel created successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error creating hotel", error: error.message });
    }
});

// Update an existing hotel with an optional image upload and discount ID
router.put('/hotel_update', upload.single('image'), async (req, res) => {
    const { id, discount_id } = req.body;
    const updates = {
        name: req.body.name,
        location: req.body.location,
        price: req.body.price,
        roomsAvailable: req.body.roomsAvailable,
        amenities: req.body.amenities ? req.body.amenities.split(',').map(amenity => amenity.trim()) : undefined,
    };

    if (req.file) {
        updates.image = req.file.filename;
    }

    if (discount_id) {
        updates.discount_id = discount_id;
    }

    try {
        const updatedHotel = await hotelModel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedHotel) {
            return res.status(404).send({ success: false, message: "Hotel not found" });
        }
        const imageUrl = updatedHotel.image ? `${req.protocol}://${req.get('host')}/uploads/${updatedHotel.image}` : '';
        res.send({ success: true, message: "Hotel updated successfully", data: { ...updatedHotel._doc, imageUrl } });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error updating hotel", error: error.message });
    }
});

// **New Route:** Update discount_id of an existing hotel
router.put('/hotel_update_discount/:id', async (req, res) => {
    const id = req.params.id;
    const { discount_id } = req.body;

    if (!discount_id) {
        return res.status(400).json({ success: false, message: "Discount ID is required" });
    }

    try {
        const updatedHotel = await hotelModel.findByIdAndUpdate(id, { discount_id }, { new: true });
        if (!updatedHotel) {
            return res.status(404).json({ success: false, message: "Hotel not found" });
        }

        const imageUrl = updatedHotel.image ? `${req.protocol}://${req.get('host')}/uploads/${updatedHotel.image}` : '';
        res.json({ success: true, message: "Discount assigned to hotel successfully", data: { ...updatedHotel._doc, imageUrl } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating discount for hotel", error: error.message });
    }
});

// Delete a hotel
router.delete("/hotel_delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const data = await hotelModel.deleteOne({ _id: id });
        res.send({ success: true, message: "Hotel deleted successfully", data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting hotel", error: error.message });
    }
});

// Get total hotel count
router.get("/hotel_count", async (req, res) => {
    try {
        const hotels = await hotelModel.find({});
        return res.status(200).json({
            count: hotels.length,
            data: hotels
        });
    } catch (err) {
        console.log(err.message);
        res.json({ success: false, message: "Error fetching hotel count", error: err.message });
    }
});

// Get a single hotel by ID
router.get("/hotel/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const hotel = await hotelModel.findById(id);
        if (!hotel) {
            return res.status(404).send({ success: false, message: "Hotel not found" });
        }

        const imageUrl = hotel.image ? `${req.protocol}://${req.get('host')}/uploads/${hotel.image}` : '';
        res.send({ success: true, data: { ...hotel._doc, imageUrl } });
    } catch (error) {
        res.status(500).send({ success: false, message: "Error fetching hotel", error: error.message });
    }
});

module.exports = router;
