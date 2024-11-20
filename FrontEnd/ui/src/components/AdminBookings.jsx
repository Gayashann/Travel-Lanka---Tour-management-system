import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AdminBookings.css';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/book');
            setBookings(response.data);
            setFilteredBookings(response.data); 
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bookings:', err.message);
            setError('Failed to fetch bookings');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() === '') {
            setFilteredBookings(bookings);
            return;
        }

        const filtered = bookings.filter((booking) => {
            const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
            return (
                booking.customerName.toLowerCase().includes(query.toLowerCase()) ||
                booking.email.toLowerCase().includes(query.toLowerCase()) ||
                bookingDate === query
            );
        });

        setFilteredBookings(filtered); 
    };

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Add logo
        const logoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYRj_oNWSTZkQ2xVePvXZPRpXs4X-pTqAOTSrd2HPMlnX2UxyjA9GnJFP9VC2NOvwWCeE&usqp=CAU';
        const img = new Image();
        img.src = logoUrl;

        // Add logo to PDF and generate table
        img.onload = () => {
            doc.addImage(img, 'PNG', 10, 10, 30, 30);
            doc.setFontSize(20);
            doc.text('Travel Lanka', 50, 30);

            const now = new Date();
            const dateString = now.toLocaleDateString();
            const timeString = now.toLocaleTimeString();
            doc.setFontSize(12);
            doc.text(`Downloaded on: ${dateString} at ${timeString}`, 10, 50);

            generateTable(doc);
        };
    };

    const generateTable = (doc) => {
        autoTable(doc, {
            head: [['Package Name', 'Customer Name', 'Email', 'Contact Number', 'Number of People', 'Address', 'Total Price', 'Booking Date']],
            body: filteredBookings.map(booking => [
                booking.package ? booking.package.name : 'N/A',
                booking.customerName,
                booking.email,
                booking.contactNumber,
                booking.numberOfPeople,
                booking.address,
                `Rs ${booking.totalPrice}`,
                new Date(booking.bookingDate).toLocaleDateString()
            ]),
            startY: 60,
            theme: 'grid',
        });
        doc.save('filtered_bookings.pdf');
    };

    const handleEdit = (booking) => {
        // Implement edit logic
        navigate(`/admin/bookings/edit/${booking._id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await axios.delete(`http://localhost:4000/api/book/${id}`);
                fetchAllBookings();
            } catch (err) {
                console.error('Error deleting booking:', err);
            }
        }
    };

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="admin-bookings-container">
            <h1>All Bookings</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, email, or date (MM/DD/YYYY)"
                />
                <button type="submit">Search</button>
            </form>
            <button onClick={downloadPDF} className="download-pdf-button">Download PDF</button>

            <table>
                <thead>
                    <tr>
                        <th>Package Name</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Number of People</th>
                        <th>Address</th>
                        <th>Total Price</th>
                        <th>Booking Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <tr key={booking._id}>
                                <td>{booking.package ? booking.package.name : 'N/A'}</td>
                                <td>{booking.customerName}</td>
                                <td>{booking.email}</td>
                                <td>{booking.contactNumber}</td>
                                <td>{booking.numberOfPeople}</td>
                                <td>{booking.address}</td>
                                <td>Rs {booking.totalPrice}</td>
                                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(booking)} className="edit-button">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(booking._id)} className="delete-button">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9">No bookings available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <button className="back-button" onClick={() => navigate('/admin/travel')}>
                Back to Travel Management
            </button>
        </div>
    );
};

export default AdminBookings;
