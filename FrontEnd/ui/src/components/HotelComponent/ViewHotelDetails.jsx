import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewHotelDetails = () => {
    const [hotels, setHotels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('http://localhost:4000/hotels/hotel');
                setHotels(response.data.data);
            } catch (error) {
                console.error(error);
                alert('Error fetching hotels: ' + error.response?.data.message);
            }
        };

        fetchHotels();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hotel?')) {
            try {
                const response = await axios.delete(`http://localhost:4000/hotels/hotel_delete/${id}`);
                alert(response.data.message);
                setHotels(hotels.filter(hotel => hotel._id !== id));
            } catch (error) {
                console.error(error);
                alert('Error deleting hotel: ' + error.response?.data.message);
            }
        }
    };

    const handleUpdate = (id) => {
        navigate(`/update-hotel/${id}`);
    };

    const handleAddHotel = () => {
        navigate('/addhotel'); // Navigate to the add hotel page
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBookingDetails = () => {
        navigate('/showbooking'); // Navigate to the hotel booking details page
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text('Hotel Details Report', 14, 22);
        doc.autoTable({
            head: [['Hotel Name', 'Location', 'Price', 'Rooms Available', 'Amenities']],
            body: hotels
                .filter(hotel => 
                    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(hotel => [
                    hotel.name,
                    hotel.location,
                    `$${hotel.price}`,
                    hotel.roomsAvailable,
                    hotel.amenities.join(', '),
                ]),
            startY: 30,
        });
        doc.save('hotel_report.pdf');
    };

    const filteredHotels = hotels.filter(hotel => 
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="hotel-details-page" style={styles.container}>
            <h1 style={styles.header}>Hotel Details</h1>
            <div style={styles.actions}>
                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={styles.searchInput}
                />
                <div style={styles.buttonGroup}>
                    <button onClick={handleAddHotel} style={styles.btnAdd}>Add Hotel</button>
                    <button onClick={generatePDF} style={styles.btnGenerate}>Generate Report</button>
                    <button onClick={handleBookingDetails} style={styles.btnBookingDetails}>Hotel Booking Details</button>
                </div>
            </div>
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th>Hotel Name</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Rooms Available</th>
                            <th>Amenities</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHotels.map((hotel, index) => (
                            <tr key={hotel._id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                <td>{hotel.name}</td>
                                <td>{hotel.location}</td>
                                <td>${hotel.price}</td>
                                <td>{hotel.roomsAvailable}</td>
                                <td>{hotel.amenities.join(', ')}</td>
                                <td>
                                    {hotel.image && (
                                        <img
                                            src={hotel.imageUrl}
                                            alt={hotel.name}
                                            style={styles.image}
                                        />
                                    )}
                                </td>
                                <td style={styles.actionButtons}>
                                    <button onClick={() => handleUpdate(hotel._id)} style={styles.btnUpdate}>Update</button>
                                    <button onClick={() => handleDelete(hotel._id)} style={styles.btnDelete}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredHotels.length === 0 && (
                    <div style={styles.noResults}>No hotels found.</div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '10px auto',
        padding: '20px',
        height: '100vh',
        background: 'linear-gradient(135deg, #f7fafc, #e2e8f0)', // Gradient from light to darker shade
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    header: {
        fontSize: '2.5rem',
        color: '#2d3748',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    searchInput: {
        padding: '0.75rem 1rem',
        width: '300px',
        border: '2px solid #cbd5e0',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease-in-out',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
    },
    btnAdd: {
        padding: '0.75rem 1.25rem',
        borderRadius: '8px',
        backgroundColor: '#3182ce',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
    },
    btnGenerate: {
        padding: '0.75rem 1.25rem',
        borderRadius: '8px',
        backgroundColor: '#38a169',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
    },
    btnBookingDetails: {
        padding: '0.75rem 1.25rem',
        borderRadius: '8px',
        backgroundColor: '#4c51bf',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
    },
    tableContainer: {
        overflowX: 'auto',
        padding: '10px',
    },
    table: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#4a5568',
        color: '#ffffff',
        borderRadius: '12px',
    },
    evenRow: {
        backgroundColor: '#f0f4f8',
    },
    oddRow: {
        backgroundColor: '#ffffff',
    },
    actionButtons: {
        display: 'flex',
        gap: '5px',
    },
    btnUpdate: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        backgroundColor: '#667eea',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
    },
    btnDelete: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        backgroundColor: '#e53e3e',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
    },
    noResults: {
        padding: '10px',
        textAlign: 'center',
        color: '#4a5568',
    },
    image: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
    },
};

export default ViewHotelDetails;
``
