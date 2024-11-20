import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import axios from 'axios';
import './CampingGear.css';

const CampingGear = () => {
  const navigate = useNavigate();
  const [gearItems, setGearItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGear, setNewGear] = useState({
    gearName: '',
    pricePerDay: '',
    description: '',
    imageUrl: '',
  });
  const [editGear, setEditGear] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch camping gear items
  const fetchGearItems = () => {
    axios.get('http://localhost:4000/api/camping-gear')
      .then(response => {
        setGearItems(response.data);
      })
      .catch(error => console.error('Error fetching camping gear:', error));
  };

  useEffect(() => {
    fetchGearItems();
    const intervalId = setInterval(fetchGearItems, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation
    if (name === 'gearName' && !/^[A-Za-z\s]*$/.test(value)) {
      setErrors((prev) => ({ ...prev, gearName: 'Please enter only letters' }));
      return;
    }
    if (name === 'pricePerDay' && !/^\d+(\.\d{1,2})?$/.test(value)) {
      setErrors((prev) => ({ ...prev, pricePerDay: 'Please enter a valid price' }));
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
    setNewGear({ ...newGear, [name]: value });
    if (editGear) {
      setEditGear({ ...editGear, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors before submitting");
      return;
    }

    axios.post('http://localhost:4000/api/camping-gear', newGear)
      .then(response => {
        setGearItems((prev) => [...prev, response.data]);
        setShowForm(false);
        setNewGear({ gearName: '', pricePerDay: '', description: '', imageUrl: '' }); // Reset form
        navigate('/camping'); // Redirect to ViewGear after adding
      })
      .catch(error => console.error('Error adding camping gear:', error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:4000/api/camping-gear/${editGear._id}`, editGear)
      .then(response => {
        setGearItems((prev) => prev.map((item) => item._id === editGear._id ? response.data : item));
        setEditGear(null);
      })
      .catch(error => console.error('Error updating camping gear:', error));
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this gear item?');
    if (confirmDelete) {
      axios.delete(`http://localhost:4000/api/camping-gear/${id}`)
        .then(() => {
          setGearItems((prev) => prev.filter((item) => item._id !== id));
        })
        .catch(error => console.error('Error deleting camping gear:', error));
    }
  };

  // Navigate to BookingsTable page
  const handleGearBooking = () => {
    navigate('/BookingsTable');
  };

  return (
    <div className="CampingGear">
      <h1>Camping Gear List</h1>

      {/* Add Gear Booking button */}
      <button onClick={handleGearBooking} className="gear-booking-button">
        Gear Booking
      </button>

      <button onClick={() => setShowForm(true)} className="add-button">Add Camping Gear</button>

      {showForm && (
        <div className="form-popup">
          <form onSubmit={handleSubmit} className="form-container">
            <h2>Add New Camping Gear</h2>
            <label>Gear Name</label>
            <input type="text" name="gearName" value={newGear.gearName} onChange={handleChange} required />
            {errors.gearName && <p className="error">{errors.gearName}</p>}

            <label>Price Per Day (in Rs)</label>
            <input type="text" name="pricePerDay" value={newGear.pricePerDay} onChange={handleChange} required />
            {errors.pricePerDay && <p className="error">{errors.pricePerDay}</p>}

            <label>Description</label>
            <textarea name="description" value={newGear.description} onChange={handleChange} required></textarea>

            <label>Image URL</label>
            <input type="text" name="imageUrl" value={newGear.imageUrl} onChange={handleChange} required />

            <button type="submit">Add Camping Gear</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="card-container">
        {gearItems.map((item) => (
          <div key={item._id} className="card">
            <img src={item.imageUrl} alt={item.gearName} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
            <h3>{item.gearName}</h3>
            <p>Price Per Day: Rs {item.pricePerDay}</p>
            <p>Description: {item.description}</p>
            <button onClick={() => setEditGear(item)} className="edit-button">Edit</button>
            <button onClick={() => handleDelete(item._id)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>

      {editGear && (
        <div className="form-popup">
          <form onSubmit={handleEditSubmit} className="form-container">
            <h2>Edit Camping Gear</h2>
            <label>Gear Name</label>
            <input type="text" name="gearName" value={editGear.gearName} onChange={handleChange} required />
            {errors.gearName && <p className="error">{errors.gearName}</p>}

            <label>Price Per Day (in Rs)</label>
            <input type="text" name="pricePerDay" value={editGear.pricePerDay} onChange={handleChange} required />
            {errors.pricePerDay && <p className="error">{errors.pricePerDay}</p>}

            <label>Description</label>
            <textarea name="description" value={editGear.description} onChange={handleChange} required></textarea>

            <label>Image URL</label>
            <input type="text" name="imageUrl" value={editGear.imageUrl} onChange={handleChange} required />

            <button type="submit">Update Camping Gear</button>
            <button type="button" onClick={() => setEditGear(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CampingGear;
