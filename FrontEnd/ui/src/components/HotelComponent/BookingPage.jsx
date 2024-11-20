import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const BookingPage = () => {
    const { id } = useParams(); // Get hotel ID from URL
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        roomQuantity: 1,
        bookingDate: ''
    });

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/hotels/hotel/${id}`);
                setHotel(response.data.data);
            } catch (error) {
                console.error(error);
                alert('Error fetching hotel details: ' + error.response?.data.message);
            }
        };

        fetchHotelDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Additional validation logic for each field
        if (name === 'name') {
            // Allow only letters and spaces
            const regex = /^[a-zA-Z\s]*$/;
            if (regex.test(value) || value === '') {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === 'mobile') {
            // Allow only numbers and ensure length is 10
            const regex = /^[0-9]*$/;
            if (regex.test(value) && value.length <= 10) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:4000/bookings/add`, { ...formData, hotelId: id });
            alert(response.data.message);
            setFormData({
                name: '',
                email: '',
                mobile: '',
                roomQuantity: 1,
                bookingDate: ''
            });
            navigate('/payment');
        } catch (error) {
            console.error(error);
            alert('Error booking hotel: ' + error.response?.data.message);
        }
    };

    return (
        <div className="booking-page">
            <div className="container">
                {/* Left Side: Hotel Details */}
                <div className="hotel-details">
                    {hotel ? (
                        <>
                            <img
                                src={hotel.imageUrl}
                                alt={hotel.name}
                                className="hotel-image"
                            />
                            <h2 className="hotel-name">{hotel.name}</h2>
                            <p><strong>Location:</strong> {hotel.location}</p>
                            <p><strong>Price:</strong> ${hotel.price}</p>
                            <p><strong>Rooms Available:</strong> {hotel.roomsAvailable}</p>
                            <p><strong>Amenities:</strong> {hotel.amenities.join(', ')}</p>
                        </>
                    ) : (
                        <p>Loading hotel details...</p>
                    )}
                </div>

                {/* Right Side: Booking Form */}
                <div className="booking-form">
                    <h1>Book Your Stay</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Mobile</label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className="form-input"
                                maxLength={10} // Limit input to 10 characters
                            />
                        </div>
                        <div className="form-group">
                            <label>Room Quantity</label>
                            <input
                                type="number"
                                name="roomQuantity"
                                value={formData.roomQuantity}
                                onChange={handleChange}
                                min="1"
                                required
                                className="form-input"
                                onKeyDown={(e) => e.preventDefault()} // Prevent keyboard input
                            />
                        </div>
                        <div className="form-group">
                            <label>Booking Date</label>
                            <input
                                type="date"
                                name="bookingDate"
                                value={formData.bookingDate}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="submit-button">Confirm Booking and Pay</button>
                    </form>
                </div>
            </div>
            <style jsx>{`
                .booking-page {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }

                .container {
                    width: 100%;
                    max-width: 800px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                    padding: 20px;
                }

                @media (min-width: 768px) {
                    .container {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .hotel-details {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .hotel-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
                }

                .hotel-name {
                    font-size: 1.8em;
                    font-weight: bold;
                    color: #333;
                }

                .booking-form {
                    background: #f8f8f8;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
                }

                .booking-form h1 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #0056b3;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #555;
                }

                .form-input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 1em;
                }

                .form-input:focus {
                    border-color: #0056b3;
                    outline: none;
                }

                .submit-button {
                    width: 100%;
                    padding: 10px;
                    background-color: #0056b3;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 1.2em;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                .submit-button:hover {
                    background-color: #004494;
                }
            `}</style>
        </div>
    );
};

export default BookingPage;
