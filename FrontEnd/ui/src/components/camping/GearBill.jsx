import React from 'react';
import { useLocation } from 'react-router-dom';


const GearBill = () => {
  const location = useLocation();
  const { bookingData } = location.state || {}; // Retrieve the booking data from navigation state

  if (!bookingData) {
    return <div>No booking data available.</div>; // Fallback if no data is found
  }

  // Logic to calculate total price based on number of days (optional)
  const pricePerDay = 100; // Example price per day
  const totalPrice = bookingData.days * pricePerDay;

  return (
    <div className="GearBill">
      <h1>Booking Bill</h1>
      <h2>Details</h2>
      <p><strong>Name:</strong> {bookingData.name}</p>
      <p><strong>Email:</strong> {bookingData.email}</p>
      <p><strong>Contact Number:</strong> {bookingData.contactNumber}</p>
      <p><strong>Address:</strong> {bookingData.address}</p>
      <p><strong>NIC:</strong> {bookingData.nic}</p>
      <p><strong>Booking Date:</strong> {bookingData.bookingDate}</p>
      <p><strong>Number of Days:</strong> {bookingData.days}</p>
      <p><strong>Total Price:</strong> Rs. {totalPrice}</p> {/* Display total price */}

      <button onClick={() => window.print()}>Print Bill</button> {/* Button to print the bill */}
    </div>
  );
};

export default GearBill;
