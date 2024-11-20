import React, { useEffect, useState } from "react";
import jsPDF from "jspdf"; // Import jsPDF
import html2canvas from "html2canvas"; // Import html2canvas
import './BookingsTable.css';

const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]); // Store filtered bookings
  const [editBookingId, setEditBookingId] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState({});
  const [searchDate, setSearchDate] = useState(''); // Store search date

  // Fetch all bookings from the API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/campingbookings");
        const data = await response.json();
        setBookings(data);
        setFilteredBookings(data); // Initially, show all bookings
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await fetch(`http://localhost:4000/api/campingbookings/${id}`, {
          method: "DELETE",
        });
        setBookings(bookings.filter((booking) => booking._id !== id));
        setFilteredBookings(filteredBookings.filter((booking) => booking._id !== id)); // Update filtered bookings
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  // Handle edit action
  const handleEdit = (booking) => {
    setEditBookingId(booking._id);
    setUpdatedBooking(booking);
  };

  // Handle input change for the editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBooking((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update action
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/campingbookings/${editBookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      });
      const updatedBookingData = await response.json();
      setBookings(
        bookings.map((booking) =>
          booking._id === editBookingId ? updatedBookingData : booking
        )
      );
      setFilteredBookings(
        filteredBookings.map((booking) =>
          booking._id === editBookingId ? updatedBookingData : booking
        )
      );
      setEditBookingId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditBookingId(null);
    setUpdatedBooking({});
  };

  // Search bookings by date
  const handleSearch = (e) => {
    setSearchDate(e.target.value);
    const filtered = bookings.filter((booking) => {
      const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
      return bookingDate === new Date(e.target.value).toLocaleDateString(); // Compare date strings
    });
    setFilteredBookings(filtered); // Update filtered bookings
  };

  // Logo image URL
  const logoImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYRj_oNWSTZkQ2xVePvXZPRpXs4X-pTqAOTSrd2HPMlnX2UxyjA9GnJFP9VC2NOvwWCeE&usqp=CAU";

  // Function to generate PDF of filtered bookings
  const generatePDF = () => {
    const input = document.getElementById("filtered-bookings-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add the company logo
      pdf.addImage(logoImageUrl, "PNG", 10, 10, 40, 20); // Add logo at top left
      pdf.setFontSize(16);
      pdf.text("Travel Lanka", 50, 20); // Add company name
      pdf.setFontSize(10);
      pdf.text(`Downloaded on: ${new Date().toLocaleString()}`, 10, 35); // Add download date and time

      pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight); // Add filtered table image
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("filtered_bookings.pdf"); // Save the PDF
    });
  };

  return (
    <div>
      <h1>Bookings List</h1>
      {/* Search input for filtering bookings by date */}
      <input
        type="date"
        value={searchDate}
        onChange={handleSearch}
        placeholder="Search by Booking Date"
        style={{ marginBottom: "20px", padding: "10px" }}
      />
      <button
        onClick={generatePDF}
        style={{
          margin: "20px 0",
          padding: "10px 15px",
          borderRadius: "5px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Generate PDF
      </button>
      {filteredBookings.length > 0 ? (
        <table id="filtered-bookings-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>NIC</th>
              <th>Booking Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id}>
                {editBookingId === booking._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={updatedBooking.name || ""}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={updatedBooking.email || ""}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="contactNumber"
                        value={updatedBooking.contactNumber || ""}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="address"
                        value={updatedBooking.address || ""}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="nic"
                        value={updatedBooking.nic || ""}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="bookingDate"
                        value={
                          updatedBooking.bookingDate
                            ? new Date(updatedBooking.bookingDate)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleUpdate}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{booking.name}</td>
                    <td>{booking.email}</td>
                    <td>{booking.contactNumber}</td>
                    <td>{booking.address}</td>
                    <td>{booking.nic}</td>
                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEdit(booking)}>Edit</button>
                      <button onClick={() => handleDelete(booking._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings available for the selected date.</p>
      )}
    </div>
  );
};

export default BookingsTable;
                  