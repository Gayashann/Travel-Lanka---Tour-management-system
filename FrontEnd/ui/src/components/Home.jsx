import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    image: '',
    duration: '', // Duration field
  });
  const [editPackage, setEditPackage] = useState(null);
  const [errors, setErrors] = useState({
    name: '',
    location: '',
    price: '',
  });

  // Fetch packages function
  const fetchPackages = () => {
    axios.get('http://localhost:4000/api/packages')
      .then(response => {
        if (Array.isArray(response.data)) {
          setPackages(response.data);
        } else {
          console.error('API response is not an array:', response.data);
        }
      })
      .catch(error => console.error('Error fetching packages:', error));
  };

  // Automatically fetch packages
  useEffect(() => {
    fetchPackages();
    const intervalId = setInterval(fetchPackages, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle form change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for name and location (letters only)
    if (name === 'name' || name === 'location') {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: 'Please enter only letters' }));
        alert("Please enter only letters for " + name);
        return;
      } else {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
      }
    }

    // Validation for price (must be a valid number)
    if (name === 'price') {
      if (!/^\d*\.?\d*$/.test(value)) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: 'Please enter a valid number' }));
        alert("Please enter a valid number for price");
        return;
      } else {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
      }
    }

    setNewPackage({ ...newPackage, [name]: value });
  };

  // Handle form change for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name' || name === 'location') {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: 'Please enter only letters' }));
        alert("Please enter only letters for " + name);
        return;
      } else {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
      }
    }

    if (name === 'price') {
      if (!/^\d*\.?\d*$/.test(value)) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: 'Please enter a valid number' }));
        alert("Please enter a valid number for price");
        return;
      } else {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
      }
    }

    setEditPackage({ ...editPackage, [name]: value });
  };

  // Handle adding a new package
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent form submission if there are errors
    if (errors.name || errors.location || errors.price) {
      alert("Please fix the errors before submitting");
      return;
    }

    axios.post('http://localhost:4000/api/packages', newPackage)
      .then(response => {
        setPackages(prevPackages => [...prevPackages, response.data]);
        setShowForm(false);
        setNewPackage({
          name: '',
          location: '',
          price: '',
          description: '',
          image: '',
          duration: '', // Reset duration
        });
      })
      .catch(error => console.error('Error adding package:', error));
  };

  // Handle editing a package
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (errors.name || errors.location || errors.price) {
      alert("Please fix the errors before submitting");
      return;
    }

    axios.put(`http://localhost:4000/api/packages/${editPackage._id}`, editPackage)
      .then(response => {
        setPackages(prevPackages =>
          prevPackages.map(pkg => pkg._id === editPackage._id ? response.data : pkg)
        );
        setEditPackage(null);
      })
      .catch(error => console.error('Error updating package:', error));
  };

  // Handle deleting a package with confirmation
  const handleDelete = (packageID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this package?');

    if (confirmDelete) {
      axios.delete(`http://localhost:4000/api/packages/${packageID}`)
        .then(() => {
          setPackages(prevPackages =>
            prevPackages.filter(pkg => pkg._id !== packageID)
          );
        })
        .catch(error => console.error('Error deleting package:', error));
    }
  };

  return (
    <div className="Home">
      <button onClick={() => navigate('/admin/travel')} className="back-button">Back to Travel Management</button>
      <h1>Package List</h1>
      <button onClick={() => setShowForm(true)} className="add-button">Add Package</button>

      {showForm && (
        <div className="form-popup">
          <form onSubmit={handleSubmit} className="form-container">
            <h2>Add a New Package</h2>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={newPackage.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
            
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={newPackage.location}
              onChange={handleChange}
              required
            />
            {errors.location && <p className="error">{errors.location}</p>}
            
            <label>Price (in Rs)</label>
            <input
              type="text"
              name="price"
              value={newPackage.price}
              onChange={handleChange}
              required
            />
            {errors.price && <p className="error">{errors.price}</p>}
            
            <label>Description</label>
            <textarea
              name="description"
              value={newPackage.description}
              onChange={handleChange}
            />
            
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={newPackage.image}
              onChange={handleChange}
            />
            
            <label>Duration (in days/hours)</label>
            <input
              type="text"
              name="duration"
              value={newPackage.duration}
              onChange={handleChange}
            />

            <button type="submit">Add Package</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button> {/* Cancel button */}
          </form>
        </div>
      )}

      <div className="card-container">
        {packages.map((pkg) => (
          <div key={pkg._id} className="card">
            {pkg.image && <img src={pkg.image} alt={pkg.name} className="card-image" />}
            <h3>{pkg.name}</h3>
            <p><strong>Location:</strong> {pkg.location}</p>
            <p><strong>Price:</strong> Rs{pkg.price}</p>
            <p><strong>Duration:</strong> {pkg.duration}</p> {/* Display duration */}
            <p><strong>Description:</strong> {pkg.description}</p>
            
            <button onClick={() => setEditPackage(pkg)} className="card-button edit-button">Edit</button>
            <button onClick={() => handleDelete(pkg._id)} className="card-button delete-button">Delete</button>
          </div>
        ))}
      </div>

      {editPackage && (
        <div className="form-popup">
          <form onSubmit={handleEditSubmit} className="form-container">
            <h2>Edit Package</h2>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={editPackage.name}
              onChange={handleEditChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
            
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={editPackage.location}
              onChange={handleEditChange}
              required
            />
            {errors.location && <p className="error">{errors.location}</p>}
            
            <label>Price (in Rs)</label>
            <input
              type="text"
              name="price"
              value={editPackage.price}
              onChange={handleEditChange}
              required
            />
            {errors.price && <p className="error">{errors.price}</p>}
            
            <label>Description</label>
            <textarea
              name="description"
              value={editPackage.description}
              onChange={handleEditChange}
            />
            
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={editPackage.image}
              onChange={handleEditChange}
            />
            
            <label>Duration (in days/hours)</label>
            <input
              type="text"
              name="duration"
              value={editPackage.duration}
              onChange={handleEditChange}
            />

            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditPackage(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
