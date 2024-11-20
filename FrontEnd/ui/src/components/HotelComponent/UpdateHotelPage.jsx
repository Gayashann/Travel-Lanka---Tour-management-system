import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateHotelPage = () => {
    const { id } = useParams(); // Get hotel ID from the URL
    const navigate = useNavigate(); // Use navigate for redirection
    const [hotel, setHotel] = useState({
        name: '',
        location: '',
        price: '',
        roomsAvailable: '',
        amenities: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/hotels/hotel/${id}`);
                const { name, location, price, roomsAvailable, amenities, imageUrl } = response.data.data;
                setHotel({ name, location, price, roomsAvailable, amenities: amenities.join(', '), image: null });
                setImagePreview(imageUrl); // Set the initial image preview
            } catch (error) {
                console.error(error);
                alert('Error fetching hotel details: ' + error.response?.data.message);
            }
        };

        fetchHotelDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHotel((prevHotel) => ({ ...prevHotel, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setHotel((prevHotel) => ({ ...prevHotel, image: file }));
        setImagePreview(URL.createObjectURL(file)); // Preview the selected image
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', hotel.name);
        formData.append('location', hotel.location);
        formData.append('price', hotel.price);
        formData.append('roomsAvailable', hotel.roomsAvailable);
        formData.append('amenities', hotel.amenities.split(',')); // Convert amenities back to an array
        if (hotel.image) {
            formData.append('image', hotel.image);
        }

        try {
            const response = await axios.put('http://localhost:4000/hotels/hotel_update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            navigate('/viewhoteldetails'); // Redirect to the view hotels page after updating
        } catch (error) {
            console.error(error);
            alert('Error updating hotel: ' + error.response?.data.message);
        }
    };

    return (
        <div className="update-hotel-page">
            <style>
                {`
                    .update-hotel-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                    }
                    .form-container {
                        max-width: 800px;
                        width: 100%;
                        background: white;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .header {
                        font-size: 2rem;
                        font-weight: bold;
                        color: #333;
                        text-align: center;
                    }
                    .label {
                        font-weight: bold;
                        margin-bottom: 0.5rem;
                        color: #555;
                    }
                    .input-field {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                    }
                    .input-field:focus {
                        border-color: #007bff;
                        outline: none;
                        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
                    }
                    .image-preview {
                        width: 100%;
                        margin-top: 1rem;
                        height: 200px;
                        object-fit: cover;
                        border-radius: 5px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    .submit-button {
                        padding: 0.75rem 1.5rem;
                        background-color: #007bff;
                        color: white;
                        font-weight: bold;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        align-self: flex-end;
                    }
                    .submit-button:hover {
                        background-color: #0056b3;
                    }
                `}
            </style>

            <div className="form-container">
                <h2 className="header">Update Hotel</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="label">Hotel Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={hotel.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="label">Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={hotel.location}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="label">Price (per night):</label>
                        <input
                            type="number"
                            name="price"
                            value={hotel.price}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="label">Rooms Available:</label>
                        <input
                            type="number"
                            name="roomsAvailable"
                            value={hotel.roomsAvailable}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="label">Amenities (comma-separated):</label>
                        <input
                            type="text"
                            name="amenities"
                            value={hotel.amenities}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="label">Hotel Image:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="input-field"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Hotel Preview"
                                className="image-preview"
                            />
                        )}
                    </div>
                    <div>
                        <button type="submit" className="submit-button">Update Hotel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateHotelPage;
