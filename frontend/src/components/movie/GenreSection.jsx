import React from 'react';
import './GenreSection.css';

const genres = [
    { title: 'Action', image: '/genres/action.png', color: '#ff4d4d' },
    { title: 'Romance', image: '/genres/romance.png', color: '#ff66b2' },
    { title: 'Comedy', image: '/genres/comedy.png', color: '#ffcc00' },
    { title: 'Drama', image: '/genres/drama.png', color: '#4d94ff' },
    { title: 'Family', image: '/genres/family.png', color: '#47d147' },
    { title: 'Horror', image: '/genres/horror.png', color: '#9933ff' }
];

const GenreSection = ({ onGenreSelect }) => {
    return (
        <div className="genre-section">
            <h2 className="section-title">Popular Genres</h2>
            <div className="genre-grid">
                {genres.map((genre, index) => (
                    <div
                        key={index}
                        className="genre-card"
                        onClick={() => onGenreSelect(genre.title)}
                        style={{ '--accent-color': genre.color }}
                    >
                        <div className="genre-card-inner">
                            <img
                                src={genre.image}
                                alt={genre.title}
                                className="genre-img"
                            />
                            <div className="genre-overlay">
                                <span className="genre-name">{genre.title}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GenreSection;
