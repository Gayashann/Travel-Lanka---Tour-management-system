import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "./Chatbot.module.css";

const Chatbot = () => {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const notes = [
        'How to send feedback to the system in private.',
        'What types of feedback can I submit?',
        'How long does it take to receive a response?',
        'Can I edit or delete my submitted feedback?',
        'How can I get a report about five-star ratings?',
        'What is the feedback process?',
        'Can I submit anonymous feedback?',
        'What if my feedback is not addressed?',
        'How to view my feedback history?',
        'What happens to my feedback after submission?',
        'How can I contact support?'
    ];
    

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userMessage.trim()) return;  

        setLoading(true);
        const newChatHistory = [...chatHistory, { sender: 'user', message: userMessage }];
        setChatHistory(newChatHistory);
        
        try {
            const response = await axios.post('http://localhost:4000/feedback/chatbot', { message: userMessage });
            const botReply = response.data.reply;  

            setChatHistory([...newChatHistory, { sender: 'bot', message: botReply }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setChatHistory([...newChatHistory, { sender: 'bot', message: "I'm sorry, something went wrong." }]);
        } finally {
            setLoading(false);
            setUserMessage('');
        }
    };

    useEffect(() => {
        const chatHistoryDiv = document.querySelector(`.${styles.chatHistory}`);
        chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
    }, [chatHistory]);

    return (
        <div className={`bg d-flex flex-column align-items-center min-vh-100 ${styles.chatbotContainer}`}>
            <h2 className={styles.heading}>Chat with Support</h2>
            <div className={styles.notes}>
                <h4>Helpful Notes:</h4>
                <ul>
                    {notes.map((note, index) => (
                        <li key={index} className={styles.noteItem}>
                            {note}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.chatHistory}>
                {chatHistory.map((chat, index) => (
                    <div key={index} className={chat.sender === 'user' ? styles.userMessage : styles.botMessage}>
                        <strong>{chat.sender === 'user' ? 'You' : 'Bot'}:</strong> {chat.message}
                    </div>
                ))}
                {loading && <div className={styles.botMessage}><strong>Bot:</strong> Typing...</div>}
            </div>
            <form onSubmit={handleSendMessage} className={styles.form}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message here..."
                    required
                    className={styles.input}
                />
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Send</button>
            </form>
            <button onClick={() => navigate(-1)} className={`${styles.btn} ${styles.btnSecondary} mt-2`}>Go Back</button>
        </div>
    );
};

export default Chatbot;







