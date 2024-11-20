import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboardLayout from "./layouts/AdminDashboard";
import AdminHome from "./pages/AdminHome";
import NavBar from "./components/NavBar";
import "./App.css";
import AddEvent from "./pages/event management/AddEvent";
import { Toaster } from "react-hot-toast";
import ManageUser from "./pages/user-management/ManageUser";
import Login from "./pages/user-management/Login";
import Register from "./pages/user-management/Register";
import AuthRequired from "./utils/AuthRequired";
import AuthRequiredUser from "./utils/AuthRequiredUser";
import UserAllReadyLogin from "./utils/UserAllReadyLogin";
import NotFound from "./pages/NotFound";
import EventList from "./pages/event management/EventList";
import EditEvent from "./pages/event management/EditEvent";
import Events from "./pages/event management/Events";
import Service from "./pages/Service";
import Hotel from "./pages/Hotel";
import Vehicle from "./pages/Vehicle";
import Package from "./pages/Package";

import UserDash from "./pages/UserDash";
import Profile from "./pages/user-management/Profile";

import AddUser from "./pages/user-management/AddUser";
import EditUser from "./pages/user-management/EditUser";
import Inquiry from "./pages/Inquiry";
import Inquiries from "./pages/Inquiry Management/Inquiries";
import InquiryHistory from "./pages/Inquiry Management/InquiryHistory";
import InquiryList from "./pages/InquiryList";
import SingleEventPage from "./pages/event management/SingleEventPage";
import Finance from "./pages/user-management/Finance";
import FinanceList from "./pages/user-management/FinanceList";
import FinanceReport from "./pages/user-management/FinanceReport";
import EditFinance from "./pages/user-management/EditFinance";
function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<AuthRequiredUser />}>
          <Route path="" element={<NavBar />}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<SingleEventPage />} />
            <Route path="services" element={<Service />} />
            <Route path="hotel" element={<Hotel />} />
            <Route path="vehicle" element={<Vehicle />} />
            <Route path="package" element={<Package />} />

            <Route element={<UserDash />}>
              <Route path="profile" element={<Profile />} />
              <Route path="inquiry" element={<Inquiry />} />
              <Route path="inquiry-list" element={<InquiryList />} />
            </Route>
          </Route>
        </Route>
        <Route element={<AuthRequired />}>
          <Route path="dashboard" element={<AdminDashboardLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="add-event" element={<AddEvent />} />
            <Route path="events" element={<EventList />} />
            <Route path="edit-events/:id" element={<EditEvent />} />
            <Route path="inquiry" element={<Inquiry />} />
            <Route path="inquiry-list" element={<Inquiries />} />
            <Route path="inquiry-history" element={<InquiryHistory />} />

            {/**
             * manage user route
             */}
            <Route path="manage-user" element={<ManageUser />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="finance" element={<Finance />} />
            <Route path="finance-list" element={<FinanceList />} />
            <Route path="edit-finance/:id" element={<EditFinance />} />
            <Route path="generate-finance-report" element={<FinanceReport />} />
            <Route path="edit-user/:id" element={<EditUser />} />
          </Route>
        </Route>
        <Route element={<UserAllReadyLogin />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
