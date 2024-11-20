import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackReplies = ({ userRole, username }) => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [replyMessage, setReplyMessage] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(""); // Error state

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true); // Start loading
                const response = await axios.get(`http://localhost:8070/feedbacks/${username}`); // Fetch feedback by username
                setFeedbackList(response.data);
            } catch (error) {
                console.error("Error fetching feedback:", error);
                setError("Failed to load feedback. Please try again."); // Set error message
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchFeedbacks();
    }, [username]);

    const handleReplySubmit = async (feedbackId) => {
        if (!replyMessage) return;
    
        // Optimistically update the feedback list
        const newReply = { _id: Date.now(), username, replyMessage }; // Temporary ID
        const updatedFeedbackList = feedbackList.map(feedback =>
            feedback._id === feedbackId
                ? { ...feedback, replies: [...feedback.replies, newReply] }
                : feedback
        );
        setFeedbackList(updatedFeedbackList);
    
        try {
            await axios.post('http://localhost:8070/feedback/replies/reply', {
                username,
                feedbackId,
                replyMessage,
            });
            setReplyMessage(""); // Clear reply message
        } catch (error) {
            console.error("Error submitting reply:", error);
            setError("Failed to submit reply. Please try again.");
            // Optionally revert optimistic update
            const revertedFeedbackList = feedbackList.map(feedback =>
                feedback._id === feedbackId
                    ? { ...feedback, replies: feedback.replies.filter(reply => reply._id !== newReply._id) }
                    : feedback
            );
            setFeedbackList(revertedFeedbackList);
        }
    };
    

    return (
        <div>
            <h3>Feedback and Replies for {username}</h3>
            {loading && <p>Loading feedback...</p>} {/* Loading indicator */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}

            {feedbackList.map(feedback => (
                <div key={feedback._id} style={{ marginBottom: '20px' }}>
                    <p><strong>Feedback:</strong> {feedback.message}</p>
                    <div>
                        <h5>Replies:</h5>
                        {feedback.replies.length > 0 ? (
                            feedback.replies.map(reply => (
                                <div key={reply._id} style={{ marginLeft: '20px' }}>
                                    <p>{reply.replyMessage}</p>
                                </div>
                            ))
                        ) : (
                            <p>No replies yet.</p> // Message if no replies exist
                        )}
                        {userRole === 'admin' && (
                            <div>
                                <textarea 
                                    value={replyMessage} 
                                    onChange={(e) => setReplyMessage(e.target.value)} 
                                    placeholder="Type your reply here..."
                                    rows={3} // Adjust the height of the textarea
                                    style={{ width: '100%', marginTop: '10px' }} // Full width
                                />
                                <button 
                                    onClick={() => handleReplySubmit(feedback._id)}
                                    style={{ marginTop: '10px' }} // Margin for better spacing
                                >
                                    Submit Reply
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedbackReplies;

