import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddHotelPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        price: '',
        roomsAvailable: '',
        amenities: '',
        image: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await axios.post('http://localhost:4000/hotels/hotel_create', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
            navigate('/viewhoteldetails');
        } catch (error) {
            console.error(error);
            alert('Error creating hotel: ' + error.response.data.message);
        }
    };

    return (
        <div className="add-hotel-page">
            <style>
                {`
                    .hotel-form {
                        background: #F9FAFB;
                        border-radius: 20px;
                        padding: 2.5rem;
                        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                        max-width: 650px;
                        margin: auto;
                        border: 2px solid #E2E8F0;
                    }
                    .hotel-form h1 {
                        font-size: 2.2rem;
                        text-align: center;
                        color: #2B6CB0;
                        margin-bottom: 2rem;
                        font-weight: bold;
                    }
                    .form-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1.5rem;
                    }
                    .form-grid div {
                        display: flex;
                        flex-direction: column;
                    }
                    .hotel-form label {
                        font-size: 1.2rem;
                        font-weight: 600;
                        color: #4A5568;
                        margin-bottom: 0.5rem;
                    }
                    .hotel-form input {
                        padding: 0.8rem;
                        border: 2px solid #CBD5E0;
                        border-radius: 12px;
                        font-size: 1.1rem;
                        color: #2D3748;
                        transition: border-color 0.3s ease;
                    }
                    .hotel-form input:focus {
                        border-color: #2B6CB0;
                        outline: none;
                        box-shadow: 0 0 10px rgba(43, 108, 176, 0.2);
                    }
                    .hotel-form button {
                        width: 100%;
                        padding: 0.85rem;
                        background: linear-gradient(135deg, #2B6CB0, #2C5282);
                        color: white;
                        font-size: 1.3rem;
                        font-weight: bold;
                        border: none;
                        border-radius: 12px;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        margin-top: 1.5rem;
                    }
                    .hotel-form button:hover {
                        background: linear-gradient(135deg, #2C5282, #2B6CB0);
                    }
                    @media (max-width: 768px) {
                        .form-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                `}
            </style>
            <div className="hotel-form">
                <h1>Add a New Hotel</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div>
                            <label>Hotel Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Rooms Available</label>
                            <input
                                type="number"
                                name="roomsAvailable"
                                value={formData.roomsAvailable}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Amenities (comma separated)</label>
                            <input
                                type="text"
                                name="amenities"
                                value={formData.amenities}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <button type="submit">Add Hotel</button>
                </form>
            </div>
        </div>
    );
};

export default AddHotelPage;
