const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the upload directory exists
const uploadDir = './uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Folder to save uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);  // Timestamp to avoid filename conflicts
    }
});

// File validation (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Only images are allowed");
        return cb(error, false);  // Reject file
    }
    cb(null, true);  // Accept file
};

// Initialize multer with storage and fileFilter
const upload = multer({ storage, fileFilter });

module.exports = upload;
