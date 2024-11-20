// frontend/src/App.jsx
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/customer/Navbar";
import Footer from "./components/customer/Footer";
import DisplayPackage from "./components/customer/DisplayPackage";
import PackageDetails from "./components/customer/PackageDetails";
import FrontPage from "./components/customer/frontpage";
import Bill from "./components/customer/Bill";
import Home from "./components/Home";
import AdminBookings from "./components/AdminBookings";
import TravelManagement from "./components/TravelManagement";
import AddHotelPage from "./components/HotelComponent/AddHotelPage";
import ViewHotelDetails from "./components/HotelComponent/ViewHotelDetails";
import UpdateHotelPage from "./components/HotelComponent/UpdateHotelPage";
import ViewHotels from "./components/HotelComponent/ViewHotels";
import BookingPage from "./components/HotelComponent/BookingPage";
import ShowBookings from "./components/HotelComponent/ShowBookings";
import CampingGear from "./components/camping/CampingGear";
import ViewGear from "./components/camping/ViewGear";
import BookingForm from "./components/camping/BookingForm";
import GearBill from "./components/camping/GearBill";
import Payment from "./components/customer/Payment";
import CustomerVehicleList from "./components/Vehicle/Customer/CustomerVehicleList";
import BookingTable from "./components/Vehicle/Customer/BookingTable";
import PaymentDetails from "./components/Vehicle/Customer/PaymentDetails.";
import VehicleBookingForm from "./components/Vehicle/Customer/VehicleBookingForm";
import AddVehicleForm from "./components/Vehicle/Admin/AddVehicleForm";
import AdminVehicleCard from "./components/Vehicle/Admin/AdminVehicleCard";
import AdminVehicleList from "./components/Vehicle/Admin/AdminVehicleList";
import VehicleCard from "./components/Vehicle/Admin/VehicleCard";
import FeedbackCreate from "./components/feedback/FeedbackCreate";
import AllFeedbacks from "./components/feedback/AllFeedbacks";
import HomePage from "./components/feedback/HomePage";
import UserFeedbacks from "./components/feedback/UserFeedbacks";
import Chatbot from "./components/feedback/Chatbot";
import FeedbackReplies from "./components/feedback/FeedbackReplies";
import Login from "./pages/user-management/Login";
import BookingsTable from "./components/camping/BookingsTable";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<FrontPage />} />
          <Route path="/packages" element={<DisplayPackage />} />
          <Route path="/packagedetails" element={<PackageDetails />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/travel" element={<TravelManagement />} />
          <Route path="/payment" element={<Payment />} />

          <Route path="/addhotel" element={<AddHotelPage />} />
          <Route path="/viewhoteldetails" element={<ViewHotelDetails />} />
          <Route path="/update-hotel/:id" element={<UpdateHotelPage />} />
          <Route path="/hotel" element={<ViewHotels />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/showbooking" element={<ShowBookings />} />
          
          <Route path="/camping" element={<CampingGear />} />
          <Route path="/viewgear" element={<ViewGear />} />
          <Route path="/campingbooking" element={<BookingForm />} />
          <Route path="/GearBill" element={<GearBill />} />
          <Route path="/BookingsTable" element={<BookingsTable />} />

          <Route path="/vehicles" element={<CustomerVehicleList />} />
          <Route path="/Vehiclebookings" element={<BookingTable />} />{" "}
          {/* Customer bookings */}
          <Route path="/adminVehicle" element={<AdminVehicleList />} />{" "}
          {/* Admin vehicle list */}
          <Route path="/paymentDetails" element={<PaymentDetails />} />{" "}
          {/* Admin vehicle list */}

          {/* Home Page */}
          <Route path="/feedback/user" element={<HomePage userRole="user" />} />
          <Route
            path="/feedback/admin"
            element={<HomePage userRole="admin" />}
          />
          {/* Admin Routes */}
          <Route
            path="/feedback/admin/get"
            element={<AllFeedbacks userRole="admin" />}
          />
          <Route
            path="/feedback/admin/user-feedbacks/:username"
            element={<UserFeedbacks userRole="admin" />}
          />
          <Route
            path="/feedback/admin/feedback/update/:username"
            element={<FeedbackCreate userRole="admin" />}
          />
          <Route
            path="/feedback/admin/replies/:username"
            element={<FeedbackReplies userRole="admin" />}
          />
          {/* User Routes */}
          <Route
            path="/feedback/user/add"
            element={<FeedbackCreate userRole="user" />}
          />
          <Route
            path="/feedback/user/get"
            element={<AllFeedbacks userRole="user" />}
          />
          <Route
            path="/feedback/user/user-feedbacks/:username"
            element={<UserFeedbacks userRole="user" />}
          />
          <Route
            path="/feedback/user/feedback/update/:username"
            element={<FeedbackCreate userRole="user" />}
          />
          <Route
            path="/feedback/user/replies/:username"
            element={<FeedbackReplies userRole="user" />}
          />
          {/* Chatbot Route */}
          <Route
            path="/feedback/user/chatbot"
            element={<Chatbot userRole="user" />}
          />
          <Route
            path="/feedback/admin/chatbot"
            element={<Chatbot userRole="admin" />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
