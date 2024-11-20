import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerVehicleCard from './CustomerVehicleCard';
import Footer from './Footer';  // Import the Footer component
import './CustomerVehicleList.css';

const CustomerVehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleRows, setVisibleRows] = useState(2); // Start by displaying 2 rows
  const [notificationVisible, setNotificationVisible] = useState(false); // State for notification

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/vehicles');
      console.log('Fetched vehicles:', response.data); // Debug: log the vehicle data
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log('Search term:', e.target.value); // Debug: log the search term
  };

  const handleLoadMore = () => {
    setVisibleRows((prevRows) => prevRows + 2); // Increase the number of displayed rows by 2
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const vehicleName = vehicle.VehicleName || ''; // Use empty string if no name is available
    const brandName = vehicle.BrandName || ''; // Use empty string if no brand name is available
    console.log('Vehicle name:', vehicleName); // Debug: log each vehicle name
    console.log('Brand name:', brandName); // Debug: log each brand name
    return (
      vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brandName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  console.log('Filtered vehicles:', filteredVehicles); // Debug: log the filtered results

  const vehiclesToShow = searchTerm ? filteredVehicles : vehicles.slice(0, visibleRows * 2); // Each row contains 2 vehicles

  // Function to handle booking (replace this with your actual booking logic)
  const handleBooking = () => {
    // Simulate successful booking
    setNotificationVisible(true);
    setTimeout(() => {
      setNotificationVisible(false); // Hide notification after 2 seconds
    }, 2000);
  };

  return (
    <div className="linear-gradient(135deg, #e0f2fe, #38bdf8);">  
      <h1 className="title">Welcome to Vehicle Rental</h1>
      
      {/* Notification for successful booking */}
      {notificationVisible && (
        <div className="notification show">Booking Successful!</div>
      )}

      <div className="images-container">
        <div className="new-image-container image-container">
          <img
            className="new-image"
            src="https://th.bing.com/th/id/R.e13d60811b4cf8601e8512c51e0566f8?rik=wmVZrLI%2b6gcxkg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fcar-png-car-png-picture-2208.png&ehk=SegUg6IQRBEw%2fPPomihDAXDILyhBvk%2bz2Y1JIgJyGNg%3d&risl=&pid=ImgRaw&r=0"
            alt="Welcome Slide"
          />
          <div className="image-overlay">
            Discover the freedom of the open road with Travel Lanka, your trusted partner in vehicle rentals. Our platform provides an extensive range of vehicles, from economical city cars to rugged off-road vehicles, ensuring you find exactly what you need for any journey. With our intuitive search and booking system, you can filter options based on your preferences and budget, making your rental experience smooth and convenient. Plus, benefit from exclusive deals, transparent pricing, and reliable service that prioritizes your satisfaction. Rent with us and embark on your next adventure with ease and comfort!
          </div>
        </div>
        <div className="new-image-right-container image-container">
          <img
            className="new-image-right"
            src="https://th.bing.com/th/id/R.ac46b9d6fa58c1985f5a7dfdae475b36?rik=6fl6YA7A6boNLg&pid=ImgRaw&r=0"
            alt="Right Slide"
          />
          <div className="image-overlay">
            Welcome to Travel Lanka, your ultimate destination for hassle-free vehicle rentals! Whether you're planning a weekend getaway, a business trip, or just need a car for a special occasion, we offer a wide selection of vehicles to suit your needs. Choose from compact cars, luxurious sedans, spacious SUVs, and more—all at competitive prices. Our user-friendly interface allows you to easily browse, compare, and book the perfect vehicle in just a few clicks. Enjoy flexible rental options, 24/7 customer support, and seamless booking experiences. Hit the road with confidence, knowing that Travel Lanka has you covered!
          </div>
        </div>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by vehicle name or brand name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="vehicle-list">
        {vehiclesToShow.length > 0 ? (
          vehiclesToShow.map((vehicle) => (
            <CustomerVehicleCard key={vehicle._id} vehicle={vehicle} onBook={handleBooking} />
          ))
        ) : (
          <p>No vehicles found</p> // Display a message if no vehicles match the search
        )}
      </div>
      <br />

      {visibleRows * 2 < (searchTerm ? filteredVehicles.length : vehicles.length) && (
        <button onClick={handleLoadMore} className="load-more-button">
          Load More
        </button>
      )}

      {/* Add Footer here */}
      <Footer />
    </div>
  );
};

export default CustomerVehicleList;
