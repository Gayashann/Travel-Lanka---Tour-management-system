import React from 'react';

export default function StarRating({ ratings, setRating }) {
    const stars = Array(5).fill(0);

    return (
        <div>
            {stars.map((_, index) => {
                const starValue = index + 1;
                return (
                    <button
                        type="button"
                        key={index}
                        className={starValue <= ratings ? "on" : "off"}
                        onClick={() => setRating(starValue)}
                        style={{
                            fontSize: '2rem',
                            color: starValue <= ratings ? 'gold' : 'gray',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            outline: 'none',
                        }}
                    >
                        <span className="star">&#9733;</span> {/* Unicode for star */}
                    </button>
                );
            })}
        </div>
    );
}
