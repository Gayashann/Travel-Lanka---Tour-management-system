import React, { useState } from 'react';
import FeedbackCreate from './FeedbackCreate';
import { useNavigate } from 'react-router-dom';

export default function HomePage({ userRole }) {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (userRole === 'user') {
            navigate('/feedback/user/add'); // Show feedback form for users
        } else if (userRole === 'admin') {
            navigate('/feedback/admin/get'); // Redirect admin to All Feedbacks
        }
    };

    return (
        <div className="home-page bg">
            <div className="hero-section">
                <div className="container text-center">
                    <h1 style={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        {userRole === 'user' ? 'We Value Your Feedback!' : 'Admin Dashboard'}
                    </h1>

                    {userRole === 'user' ? (
                        <>
                            <p style={{ fontWeight: '600', lineHeight: '1.5', marginBottom: '12px', fontSize: '1.25rem' }}>
                                Thank you for being a part of our journey! We genuinely care about your experiences and believe your feedback plays a crucial role in shaping our services. Whether it’s the comfort of your accommodations, the hospitality of our staff, or the quality of your excursions, we want to hear it all. Every trip tells a story—and yours helps us make future journeys even more exciting and seamless for other travelers.
                            </p>
                            <p style={{ fontWeight: '600', lineHeight: '1.5', marginBottom: '12px', fontSize: '1.25rem' }}>
                                Share your thoughts—was there anything that exceeded your expectations, or something we could improve? We’re always striving to refine our offerings and meet your expectations better. Your ratings, comments, and suggestions give us the insight we need to grow and improve, ensuring your next adventure with us will be even better. Don't hesitate to propose new ideas or highlight areas we can enhance!
                            </p>
                            <p style={{ fontWeight: '600', lineHeight: '1.5', marginBottom: '12px', fontSize: '1.25rem' }}>
                                At the heart of our commitment is making every journey with us a memorable one. Your feedback isn't just a message to us—it's a roadmap that guides us toward delivering exceptional travel experiences. Thank you for traveling with us. Let’s make every trip, big or small, something to cherish and remember.
                            </p>
                        </>
                    ) : (
                        <>
                            <p style={{ fontWeight: '600', lineHeight: '1.5', marginBottom: '12px', fontSize: '1.25rem' }}>
                                Welcome to the Admin Dashboard! Your role is pivotal in creating a positive experience for our travelers. By reviewing feedback, you help us understand our customers' perspectives, identify trends, and address challenges that may arise. Your insights ensure that we maintain and exceed the high standards we set for ourselves.
                            </p>
                            <p style={{ fontWeight: '600', lineHeight: '1.5', marginBottom: '12px', fontSize: '1.25rem' }}>
                                Every piece of feedback offers a unique perspective. It's more than just ratings and comments—it’s a conversation with our travelers. Use this information to refine our strategies, improve existing services, and introduce new ideas that align with customer preferences. Whether it's a small issue or a larger pattern, addressing feedback proactively helps us build trust and deliver consistent excellence.
                            </p>
                            <p style={{ fontWeight: '600', lineHeight: '1.5', marginBottom: '12px', fontSize: '1.25rem' }}>
                                Stay connected with your team by sharing key insights and feedback trends. Collaborate to implement improvements, organize surveys, and propose ideas for future services. Remember, each resolved issue reflects our commitment to providing outstanding travel experiences. Together, let’s continue evolving and offering unforgettable journeys that exceed expectations.
                            </p>
                        </>
                    )}

                    <button onClick={handleButtonClick} className="btn btn-primary mt-4">
                        {userRole === 'user' ? 'Make your feedback' : "See User's Feedbacks"}
                    </button>

                    {showFeedbackForm && userRole === 'user' && (
                        <div className="feedback-form-container mt-3">
                            <FeedbackCreate userRole={userRole} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}











