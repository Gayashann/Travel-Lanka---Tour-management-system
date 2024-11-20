require('events').EventEmitter.defaultMaxListeners = 20; 
const express = require("express");
const dbConnection = require("./config/db");
const routes = require("./routes/packages");
const bookingRoutes = require("./routes/PackageBookings");
const cors = require("cors");
const bodyParser = require("body-parser");
const hotelRoutes = require("./routes/hotelroutes");
const hotelBookingRoutes = require("./routes/bookingroutes");
const path = require('path');
const campingGearRoutes = require('./routes/campingGearRoutes');
const campingBookingsRoute = require('./routes/campingBookings');
const Vehiclesroutes = require('./routes/Vehicles');
const VehicleBookingrouter = require('./routes/VehiclebookingRoutes');
const feedbackRoutes = require('./routes/feedback.routes');

const app = express();
app.use(cors({ origin: true, credentials: true }));


//DB connection 
dbConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));


app.get("/", (req, res) => res.send("Hello world"));
app.use("/api/packages", routes);
app.use("/api/book", bookingRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/hotels", hotelRoutes);
app.use("/bookings", hotelBookingRoutes);

app.use('/api/camping-gear', campingGearRoutes);
app.use('/api/campingbookings', campingBookingsRoute);

app.use("/api/vehicles", Vehiclesroutes);
app.use("/api/VehicleBooking", VehicleBookingrouter);

app.use('/feedback', feedbackRoutes);

const PORT = 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


