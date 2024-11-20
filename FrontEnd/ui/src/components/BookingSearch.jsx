import React, { useState } from 'react';
import axios from 'axios';

const BookingSearch = ({ setBookings }) => {
    const [query, setQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`'http://localhost:4000/api/bookings'/search?query=${query}`);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email"
            />
            <button type="submit">Search</button>
        </form>
    );
};

export default BookingSearch;
