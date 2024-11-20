import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const ShowBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch bookings from the server
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:4000/bookings/all');
                setBookings(response.data.data || []); // Fallback to empty array
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        fetchBookings();
    }, []);

    // Handle delete booking
    const deleteBooking = async (bookingId) => {
        try {
            await axios.delete(`http://localhost:4000/bookings/delete/${bookingId}`);
            setBookings(bookings.filter((booking) => booking._id !== bookingId));
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    // Filter bookings based on search term
    const filteredBookings = bookings.filter((booking) =>
        booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingDate?.includes(searchTerm)
    );

    // Generate PDF report
    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Bookings Report', 10, 10);

        filteredBookings.forEach((booking, index) => {
            doc.text(
                `${index + 1}. Name: ${booking.name}, Email: ${booking.email}, Date: ${new Date(
                    booking.bookingDate
                ).toLocaleDateString()}`,
                10,
                20 + index * 10
            );
        });

        doc.save('Bookings_Report.pdf');
    };

    return (
        <div className="booking-container">
            <h1 className="heading">All Bookings</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name, email or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="report-button" onClick={generatePDF}>Generate Report</button>
            </div>

            <table className="booking-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Room Quantity</th>
                        <th>Booking Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map((booking) => (
                        <tr key={booking._id}>
                            <td>{booking.name}</td>
                            <td>{booking.email}</td>
                            <td>{booking.mobile}</td>
                            <td>{booking.roomQuantity}</td>
                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td>
                                <button className="delete-button" onClick={() => deleteBooking(booking._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style jsx>{`
                .booking-container {
                    max-width: 1200px;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .heading {
                    text-align: center;
                    font-size: 2rem;
                    margin-bottom: 20px;
                    color: #333;
                }
                .search-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .search-input {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    width: 100px;
                    margin-right: 10px;
                    font-size: 1rem;
                }
                .report-button {
                    padding: 10px 15px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                }
                .report-button:hover {
                    background-color: #0056b3;
                }
                .booking-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .booking-table th,
                .booking-table td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                .booking-table th {
                    background-color: #f2f2f2;
                    color: #333;
                }
                .booking-table tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .delete-button {
                    padding: 5px 10px;
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .delete-button:hover {
                    background-color: #c82333;
                }
            `}</style>
        </div>
    );
};

export default ShowBookings;
