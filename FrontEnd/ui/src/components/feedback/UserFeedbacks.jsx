import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from './images/card_back.jpeg';


export default function UserFeedbacks({ userRole }) {
    const { username } = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserFeedbacks = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/feedback/get/${username}`);
                setFeedbacks(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserFeedbacks();
    }, [username]);

    const handleDelete = async (feedbackId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:4000/feedback/delete/${feedbackId}`);
                setFeedbacks(feedbacks.filter(f => f._id !== feedbackId));
                alert("Feedback deleted successfully");
            } catch (err) {
                alert("Failed to delete feedback: " + err.message);
            }
        }
    };

    const handleUpdate = (feedback) => {
        navigate(`/feedback/${userRole}/feedback/update/${feedback.username}`, { state: { feedback } });
    };

    const handleViewAllFeedbacks = () => {
        navigate(`/feedback/${userRole}/get`);
    };

    const renderStars = (rating) => {
        const maxStars = 5;
        const filledStars = '★'.repeat(rating);
        const emptyStars = '☆'.repeat(maxStars - rating);
        return (
            <span style={{ color: '#FFD700' }}>
                {filledStars}{emptyStars}
            </span>
        );
    };

    if (loading) {
        return <div>Loading feedbacks...</div>;
    }

    if (error) {
        return <div>Error fetching feedbacks: {error}</div>;
    }

    return (
        <div className="bg d-flex flex-column align-items-center min-vh-100">
            <h2 className="text-black mb-3">Feedbacks submitted by {username}</h2>
            <button className="btn btn-primary mb-4" onClick={handleViewAllFeedbacks}>
                View All Feedbacks
            </button>
            <ul className="list-group">
                {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                        <li
                            key={feedback._id}
                            className="list-group-item"
                             style={{
                                backgroundImage: `url(${backgroundImage})`, // Use the imported image
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                color: 'white',
                                borderRadius: '8px',
                                padding: '15px',
                                marginBottom: '10px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <strong>Service:</strong> {feedback.service} <br />
                            <strong>Rating:</strong> {renderStars(feedback.ratings)} <br />
                            <strong>Message:</strong> {feedback.message} <br />
                            <div className="flex space-x-2 mt-2">
                                {userRole === 'user' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdate(feedback)}
                                            className="btn btn-success btn-sm me-2"  // Green Update button
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feedback._id)}
                                            className="btn btn-danger btn-sm"  // Red Delete button
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {userRole === 'admin' && (
                                    <button
                                        onClick={() => handleUpdate(feedback)}
                                        className="btn btn-success btn-sm"  // Green Update button for Admin
                                    >
                                        Update
                                    </button>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">No feedbacks found.</li>
                )}
            </ul>
        </div>
    );
}












