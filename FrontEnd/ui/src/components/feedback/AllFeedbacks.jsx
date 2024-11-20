import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from './images/logo.png';
import "./AllFeedbacks.css";


export default function AllFeedbacks({ userRole }) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState('public');
    const [ratingFilter, setRatingFilter] = useState('all');  
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                // Determine username for user-specific feedback
                const username = userRole === 'user' ? 'specific_username' : '';  // Update with actual logic to get the username

                // Fetch feedbacks based on user role
                const response = await axios.get('http://localhost:4000/feedback/', {
                    params: { username, role: userRole }
                });
                setFeedbacks(response.data);
            } catch (err) {
                console.error('Error fetching feedbacks:', err);
                alert('Failed to fetch feedbacks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [userRole]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            setDeletingId(id);
            try {
                await axios.delete(`http://localhost:4000/feedback/delete/${id}`);
                setFeedbacks(feedbacks.filter(feedback => feedback._id !== id));
                alert('Feedback deleted successfully');
            } catch (err) {
                console.error('Error deleting feedback:', err);
                alert('Failed to delete feedback. Please try again.');
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleUpdate = (feedback) => {
        navigate(`/feedback/admin/update/${feedback.username}`, { state: { feedback } });
    };

   const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
        <i 
            key={index + 1} 
            className={index < rating ? "fas fa-star text-warning" : "far fa-star text-warning"}
            style={{ fontSize: '1.5rem' }}  
        ></i>
    ));
};


    const filteredFeedbacks = feedbacks.filter(feedback => {
        const username = feedback.username ? feedback.username.toLowerCase() : '';
        const service = feedback.service ? feedback.service.toLowerCase() : '';
        return username.includes(searchTerm.toLowerCase()) || service.includes(searchTerm.toLowerCase());
    });
    
    const displayedFeedbacks = filteredFeedbacks.filter(feedback => {
        const isVisible = userRole === 'admin' 
            ? (visibilityFilter === 'public' ? feedback.visibility === 'public' : feedback.visibility === 'private')
            : feedback.visibility === 'public';

        const matchesRating = ratingFilter === 'all' || feedback.ratings === parseInt(ratingFilter);

        return isVisible && matchesRating;
    });

    const generatePDF = async () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
    
        const imgData = logo; // Your logo image
    
        // Set opacity for the watermark
        doc.setGState(new doc.GState({ opacity: 0.1 }));
        doc.addImage(imgData, 'PNG', 0, 0, 210, 297);
        doc.setGState(new doc.GState({ opacity: 1 }));
    
        // Title and headings
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Feedback Report", 20, 20);
        
        doc.setFontSize(14);
        doc.text("Travel Lanka", 20, 30);
    
        // Add the creation date
        const creationDate = new Date().toLocaleString();
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Date Created: ${creationDate}`, 20, 40);
    
        let y = 50;
    
        displayedFeedbacks.forEach((feedback, index) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
    
            // Draw outline for each feedback section
           
    
            // Feedback title
            doc.setFillColor(230, 230, 250);
            doc.rect(15, y - 5, 180, 15, 'F');
            doc.setFontSize(12);
            doc.setTextColor(0, 51, 102);
            doc.setFont("helvetica", "bold");
            doc.text(`Feedback ${index + 1}`, 20, y);
    
            // User section
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text("User:", 20, y + 15);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(34, 139, 34);
            doc.text(feedback.username, 50, y + 15);
    
            // Rating section
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text("Rating:", 20, y + 25);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(255, 165, 0);
            const starCount = Math.min(feedback.ratings, 5);
            const ratingDisplay = "⭐".repeat(starCount);
            doc.text(ratingDisplay, 50, y + 25);
    
            // Service section
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text("Service:", 20, y + 35);
            doc.setFont("helvetica", "normal");
            doc.text(feedback.service, 50, y + 35);
    
            // Message section
            const message = feedback.message ? feedback.message.replace(/[\uFFFD]/g) : 'N/A';
            const messageY = y + 45;
            const messageLines = doc.splitTextToSize(`Message: ${message}`, 170);
            const messageHeight = Math.max(messageLines.length * 7, 10); 

            doc.setFillColor(245, 245, 245);
            doc.rect(15, messageY - 5, 180, messageHeight + 10, 'F');
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            doc.text(messageLines, 20, messageY + 5);  

    
            // Visibility and Date section
            const visibilityY = messageY + messageHeight + 10;
            doc.setFont("helvetica", "bold");
            doc.text("Visibility:", 20, visibilityY);
            doc.setFont("helvetica", "normal");
            doc.text(feedback.visibility, 50, visibilityY);
    
            doc.setFont("helvetica", "bold");
            doc.text("Date:", 20, visibilityY + 10);
            doc.setFont("helvetica", "normal");
            doc.text(new Date(feedback.createdAt).toLocaleString(), 50, visibilityY + 10);
    
            // Update Y position for the next feedback
            y = visibilityY + 20;
        });
    
        // Save the PDF
        doc.save("feedback_report.pdf");
    };
    
    
    if (loading) {
        return <div>Loading feedbacks...</div>;
    }

    if (displayedFeedbacks.length === 0) {
        return <div>No feedbacks available.</div>;
    }

    return (
        <div className="bg d-flex flex-column align-items-center min-vh-100">
            <div className="container">
                <div className="d-flex justify-content-between my-4">
                <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }} className='text-black'>
                    All Feedbacks
                    </h2>
                    {userRole === 'user' && (
                        <button className="btn btn-primary" onClick={() => navigate('/feedback/user/add')}>
                            Submit Feedback
                        </button>
                    )}
                    {userRole === 'admin' && (
                        <button className="btn btn-secondary" onClick={generatePDF}>
                            Download PDF
                        </button>
                    )}
                </div>
                {/* Go Back Button */}
                <div className="d-flex justify-content-start mb-3">
                    <button className="btn btn-light" onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by username or service"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        />
                    </div>
                    {userRole === 'admin' && (
                        <div className="col-md-4">
                            <select 
                                className="form-select" 
                                value={visibilityFilter} 
                                onChange={(e) => setVisibilityFilter(e.target.value)}
                            >
                                <option value="public">Public Feedbacks</option>
                                <option value="private">Private Feedbacks</option>
                            </select>
                        </div>
                    )}
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                        >
                            <option value="all">All Ratings</option>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    {displayedFeedbacks.map(feedback => (
                        <div key={feedback._id} className="col-md-4 mb-4">
                            <div className="card card-custom text-white">
                                <div className="card-body ">
                                <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '8px' }}>
                                        {feedback.username}
                                    </p>
                                    <p className="card-subtitle mb-2">{renderStars(feedback.ratings)}</p>
                                    <p className="card-text" style={{ color: 'white' }}>
                                        <strong style={{ color: 'white', fontWeight: 'bold' }}>Service:</strong> {feedback.service}
                                    </p>
                                    <p className="card-text" style={{ color: 'white' }}>
                                        <strong style={{ color: 'white', fontWeight: 'bold' }}>Message:</strong> {feedback.message}
                                    </p>

                                    
                                    <p className="card-text"><small>{new Date(feedback.createdAt).toLocaleString()}</small></p>
                                    {userRole === 'admin' && (
                                        <div className="d-flex justify-content-between">
                                            <button 
                                                className="btn btn-success" 
                                                onClick={() => handleUpdate(feedback)}
                                            >
                                                Update
                                            </button>
                                            <button 
                                                className="btn btn-danger" 
                                                onClick={() => handleDelete(feedback._id)}
                                                disabled={deletingId === feedback._id}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}








































 