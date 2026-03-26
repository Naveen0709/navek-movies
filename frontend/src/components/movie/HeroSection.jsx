import React from "react";
import "./HeroSection.css";

const HeroSection = ({ movie }) => {
    if (!movie) return null;

    return (
        <div className="hero-container">
            <div className="hero-overlay"></div>
            <img src={movie.poster} alt={movie.title} className="hero-image" />

            <div className="hero-content">
                <span className="hero-badge">Trending #1</span>
                <h1 className="hero-title">{movie.title}</h1>

                <div className="hero-metadata">
                    <span className="rating">⭐ {movie.rating}</span>
                    <span className="year">{movie.year}</span>
                    <span className="genre">{movie.genre}</span>
                </div>

                <p className="hero-description">{movie.description}</p>

                <div className="hero-actions">
                    <button className="play-btn">
                        <span className="icon">▶</span> Play Now
                    </button>
                    <button className="more-info-btn">
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
