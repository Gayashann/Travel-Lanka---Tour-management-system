import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import './BookingTable.css';
import logo from '../../../assets/logo.png';

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/VehicleBooking');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/VehicleBooking/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleUpdate = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
    setErrorMessage('');
  };

  const handleSaveUpdate = async () => {
    if (!isValidBooking(selectedBooking)) {
      return; 
    }

    try {
      await axios.put(`http://localhost:4000/api/Vehiclebooking${selectedBooking._id}`, selectedBooking);
      fetchBookings();
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedBooking({ ...selectedBooking, [name]: value });
  };

  const isValidBooking = (booking) => {
    const { customerName, contactNumber, email, bookingDate, rentalDuration } = booking;
    const namePattern = /^[a-zA-Z\s]*$/;

    // Validate Customer Name
    if (!namePattern.test(customerName)) {
      setErrorMessage('Customer Name cannot contain numbers or special characters.');
      return false;
    }

    // Validate Contact Number
    if (!/^\d{10}$/.test(contactNumber)) {
      setErrorMessage('Contact Number must be exactly 10 digits.');
      return false;
    }

    // Validate Email Format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Email format is invalid.');
      return false;
    }

    // Validate Booking Date
    const today = new Date();
    today.setDate(today.getDate() + 1); // Start booking from tomorrow
    const maxBookingDate = new Date(today);
    maxBookingDate.setMonth(maxBookingDate.getMonth() + 2);
    const selectedDate = new Date(bookingDate);
    if (selectedDate < today || selectedDate > maxBookingDate) {
      setErrorMessage('Booking Date must be from tomorrow and within the next two months.');
      return false;
    }

    // Validate Rental Duration
    if (rentalDuration < 1 || rentalDuration > 10) {
      setErrorMessage('Rental Duration must be between 1 and 10 days.');
      return false;
    }

    setErrorMessage(''); // Clear error message if all validations pass
    return true;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const imgData = logo;
    const imgWidth = 30;
    const imgHeight = 30;

    doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    doc.setFontSize(16);
    doc.text('Travel Lanka', 50, 25);

    const currentDateTime = new Date().toLocaleString();
    doc.setFontSize(12);
    const rightMargin = 10;
    const dateX = doc.internal.pageSize.getWidth() - rightMargin;
    doc.text(`Date & Time: ${currentDateTime}`, dateX, 20, { align: 'right' });

    const headers = ['Customer Name', 'Contact Number', 'Email', 'Booking Date', 'Rental Duration'];
    const tableData = bookings.map((booking) => [
      booking.customerName,
      booking.contactNumber,
      booking.email,
      new Date(booking.bookingDate).toLocaleDateString(),
      booking.rentalDuration,
    ]);

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 70,
    });

    doc.save('bookings_report.pdf');
  };

  return (
    <div className="table-container">
      <Button variant="contained" color="primary" onClick={generatePDF}>
        Generate PDF
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label="booking table">
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>NIC</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>Rental Duration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} className="table-row">
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.customerNIC}</TableCell>
                <TableCell>{booking.contactNumber}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{new Date(booking.bookingDate).toLocaleDateString()}</TableCell>
                <TableCell>{booking.rentalDuration}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdate(booking)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(booking._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Booking</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="customerName"
                label="Customer Name"
                type="text"
                fullWidth
                value={selectedBooking.customerName}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Allow only letters and spaces
                  const regex = /^[a-zA-Z\s]*$/;
                  if (!regex.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                required
              />
              <TextField
                margin="dense"
                name="contactNumber"
                label="Contact Number"
                type="text"
                fullWidth
                value={selectedBooking.contactNumber}
                onChange={handleChange}
                inputProps={{
                  maxLength: 10,
                  pattern: "\\d{10}",
                  title: "Contact Number must be exactly 10 digits.",
                  required: true,
                }}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={selectedBooking.email}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="bookingDate"
                label="Booking Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={new Date(selectedBooking.bookingDate).toISOString().substring(0, 10)}
                onChange={handleChange}
                inputProps={{
                  min: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], // Tomorrow
                  max: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split("T")[0], // Two months from today
                }}
              />
              <TextField
                margin="dense"
                name="rentalDuration"
                label="Rental Duration (days)"
                type="number"
                fullWidth
                value={selectedBooking.rentalDuration}
                onChange={handleChange}
                inputProps={{
                  min: 1,
                  max: 10,
                }}
              />
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingTable;
