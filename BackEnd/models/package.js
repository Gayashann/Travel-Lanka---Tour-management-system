const mongoose = require("mongoose");
const PackageSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    }, 
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    duration: {
      type: String, // You can also use Number if it's hours/days as a number
      required: true,
    }
});

module.exports = Package = mongoose.model("package", PackageSchema);
