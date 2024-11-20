import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Search term state
    const [filteredHotels, setFilteredHotels] = useState([]); // Filtered hotels
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('http://localhost:4000/hotels/hotel');
                setHotels(response.data.data);
                setFilteredHotels(response.data.data); // Initially set all hotels as filtered
            } catch (error) {
                console.error(error);
                alert('Error fetching hotels: ' + error.response?.data.message);
            }
        };

        fetchHotels();
    }, []);

    useEffect(() => {
        const filtered = hotels.filter(
            hotel =>
                hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredHotels(filtered);
    }, [searchTerm, hotels]);

    const handleBook = (id) => {
        navigate(`/booking/${id}`); // Redirect to the booking page with the hotel ID
    };

    return (
        <div className="container">
            <style>
                {`
                    .container {
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                    .innerContainer {
                        max-width: 1200px;
                        margin: auto;
                    }
                    .title {
                        text-align: center;
                        color: #000000;
                        margin-bottom: 20px;
                    }
                    .searchBarContainer {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .searchInput {
                        padding: 10px;
                        width: 80%;
                        max-width: 400px;
                        border: 2px solid #9e972f;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                    .hotelsGrid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 20px;
                    }
                    .hotelCard {
                        border: 1px solid #E2E8CE;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        background-color: white;
                        transition: transform 0.2s;
                    }
                    .hotelCard:hover {
                        transform: scale(1.02);
                    }
                    .hotelImage {
                        width: 100%;
                        height: 200px;
                        object-fit: cover;
                    }
                    .hotelDetails {
                        padding: 15px;
                    }
                    .hotelName {
                        font-size: 1.5em;
                        margin: 0;
                        color: #9e972f;
                    }
                    .hotelInfo {
                        margin: 10px 0;
                        font-size: 14px;
                    }
                    .buttonContainer {
                        text-align: center;
                        margin-top: 10px;
                    }
                    .bookButton {
                        background-color: #9e972f;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: background-color 0.3s;
                    }
                    .bookButton:hover {
                        background-color: #7a7a23;
                    }
                    .noHotels {
                        text-align: center;
                        font-size: 18px;
                        color: #9e972f;
                    }
                `}
            </style>

            <div className="innerContainer">
                <h1 className="title">Find Your Perfect Stay</h1>

                {/* Search Bar */}
                <div className="searchBarContainer">
                    <input
                        type="text"
                        placeholder="Search hotels by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="searchInput"
                    />
                </div>

                {/* Hotels Grid */}
                <div className="hotelsGrid">
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map(hotel => (
                            <div key={hotel._id} className="hotelCard">
                                <img
                                    src={hotel.imageUrl}
                                    alt={hotel.name}
                                    className="hotelImage"
                                />
                                <div className="hotelDetails">
                                    <h2 className="hotelName">{hotel.name}</h2>
                                    <p className="hotelInfo">
                                        <strong>Location:</strong> {hotel.location}
                                    </p>
                                    <p className="hotelInfo">
                                        <strong>Price:</strong> ${hotel.price}
                                    </p>
                                    <p className="hotelInfo">
                                        <strong>Rooms Available:</strong> {hotel.roomsAvailable}
                                    </p>
                                    <p className="hotelInfo">
                                        <strong>Amenities:</strong> {hotel.amenities.join(', ')}
                                    </p>
                                    <div className="buttonContainer">
                                        <button
                                            onClick={() => handleBook(hotel._id)}
                                            className="bookButton"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="noHotels">No hotels found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewHotels;
