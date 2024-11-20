import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'; 
import StarRating from './StarRating';
import axios from 'axios';
import backgroundImage from './images/Back_new.jpg'; 


export default function FeedbackCreate({ userRole }) {
    const [username, setUsername] = useState('');
    const [ratings, setRating] = useState(0);
    const [service, setService] = useState('All');
    const [visibility, setVisibility] = useState('public');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { username: paramUsername } = useParams(); 
    const location = useLocation(); 

    useEffect(() => {
        if (location.state && location.state.feedback) {
            const feedback = location.state.feedback;
            setUsername(feedback.username);
            setRating(feedback.ratings);
            setService(feedback.service);
            setVisibility(feedback.visibility);
            setMessage(feedback.message);
            setIsEditing(true);
        }
    }, [location.state]);

    const notifyAdmin = (feedbackData) => {
        console.log('New feedback submitted:', feedbackData);
        const audio = new Audio('path/to/notification.mp3');  
        audio.play();
    };

    const validate = () => {
        let tempErrors = {};
        const usernameRegex = /^[A-Za-z]+$/;

        if (!username) {
            tempErrors.username = 'Username is required.';
        } else if (!usernameRegex.test(username)) {
            tempErrors.username = 'Username cannot contain numbers or special characters.';
        }
        
        if (ratings === 0) tempErrors.ratings = 'Please select a rating.';
        if (!message.trim()) tempErrors.message = 'Message is required.';
        setErrors(tempErrors);

        return Object.keys(tempErrors).length === 0; // Return true if no errors
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validate()) return; // Prevent submission if validation fails

        const feedbackData = { username, ratings, service, visibility, message };
        setLoading(true);

        try {
            if (isEditing) {
                await axios.put(`http://localhost:4000/feedback/update/${username}`, feedbackData);
                alert('Feedback updated successfully');
            } else {
                await axios.post('http://localhost:4000/feedback/add', feedbackData);
                alert('Feedback created successfully');
                if (userRole === 'admin') {
                    notifyAdmin(feedbackData); // Notify admin after feedback creation
                }
            }
            // Redirect based on user role
            navigate(`/feedback/${userRole}/user-feedbacks/${username}`);  
        } catch (err) {
            alert('Failed to save feedback: ' + (err.response?.data.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSeeAllFeedbacks = () => {
        navigate(`/feedback/${userRole}/get`); // Navigate to the correct route based on user role
    };

    return (
        <div className="bg d-flex flex-column align-items-center min-vh-100">
            <form 
                onSubmit={submit} 
                className="form-container bg-light p-4" 
                style={{
                    width: '80%', 
                    maxWidth: '600px',  
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <h2 className="text-center mb-4" style={{ fontWeight: 'bold', color: 'black' }}>
                    {isEditing ? 'Update Feedback' : 'Submit Feedback'}
                </h2>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label font-weight-bold">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        disabled={isEditing} 
                        required
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label font-weight-bold">Your Rating</label>
                    <StarRating ratings={ratings} setRating={setRating} />
                    {errors.ratings && <div className="text-danger">{errors.ratings}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="service" className="form-label font-weight-bold">Service</label>
                    <select
                        name="service"
                        value={service}
                        onChange={e => setService(e.target.value)}
                        className="form-select"
                    >
                        <option value="All">All</option>
                        <option value="Transport">Transport</option>
                        <option value="Accommodation">Accommodation</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="visibility" className="form-label font-weight-bold">Select Visibility</label>
                    <select
                        name="visibility"
                        value={visibility}
                        onChange={e => setVisibility(e.target.value)}
                        className="form-select"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label font-weight-bold">Your Message</label>
                    <textarea
                        name="message"
                        id="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                        rows="5"
                        required
                    ></textarea>
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className={`btn w-100 ${loading ? 'btn-secondary' : 'btn-yellow'} text-white`}
                >
                    {loading ? 'Submitting...' : isEditing ? 'Update' : 'Submit'}
                </button>

                <button 
                    type="button"
                    onClick={handleSeeAllFeedbacks}
                    className="btn btn-primary w-100 mt-3"
                >
                    See All Feedbacks
                </button>

                <button 
                    className="btn btn-secondary mt-4" 
                    onClick={() => navigate(`/feedback/${userRole}`)} // Adjust the path based on the user role
                >
                    Go Back
                </button>

                {userRole !== 'admin' && (
                <div className="mt-3">
                    <Link to="/feedback/user/chatbot" className="btn btn-info w-100">
                        Chat with Support
                    </Link>
                </div>
               )}
            </form>
        </div>
    );
}







































































































