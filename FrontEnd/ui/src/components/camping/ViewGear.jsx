// src/ViewGear.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewGear.css';

const ViewGear = () => {
  const [gearItems, setGearItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search input
  const navigate = useNavigate();

  const fetchGearItems = () => {
    axios.get('http://localhost:4000/api/camping-gear')
      .then(response => {
        setGearItems(response.data);
      })
      .catch(error => console.error('Error fetching camping gear:', error));
  };

  useEffect(() => {
    fetchGearItems();
    const intervalId = setInterval(fetchGearItems, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleBook = () => {
    // Navigate directly to the camping booking page
    navigate('/campingbooking');
  };

  // Function to filter gear items based on the search query
  const filteredGearItems = gearItems.filter(item =>
    item.gearName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ViewGear">
      <h1>Camping Gear List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by gear name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
        className="search-bar"
      />

      <div className="card-container">
        {/* Display filtered gear items */}
        {filteredGearItems.length > 0 ? (
          filteredGearItems.map((item) => (
            <div key={item._id} className="card">
              <img src={item.imageUrl} alt={item.gearName} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
              <h3>{item.gearName}</h3>
              <p>Price Per Day: Rs {item.pricePerDay}</p>
              <p>Description: {item.description}</p>
              <button onClick={handleBook}>Book</button>
            </div>
          ))
        ) : (
          <p>No gear items found</p> // Message when no items match the search
        )}
      </div>
    </div>
  );
};

export default ViewGear;
