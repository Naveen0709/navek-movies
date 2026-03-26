import React from 'react';
import './TrailerModal.css';

const TrailerModal = ({ isOpen, onClose, selectedMovie, toggleWatchlist }) => {
    if (!isOpen || !selectedMovie) return null;

    const { title, trailerId, cast, director, genre, year, rating, description } = selectedMovie;

    // 🎬 NAVEK 30-Second Preview Logic
    // start=30 (skip intro/logo), end=60 (play exactly 30s)
    const validTray = (trailerId && trailerId !== "null" && trailerId !== "undefined") ? trailerId : "fT-l6K7K44A";
    const ytUrl = `https://www.youtube-nocookie.com/embed/${validTray}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1&disablekb=0&fs=1`;

    return (
        <div className="navek-ultra-overlay" onClick={onClose}>
            <div className="navek-ultra-container" onClick={(e) => e.stopPropagation()}>
                {/* Glow Effects */}
                <div className="glow-top"></div>
                <div className="glow-bottom"></div>

                <button className="navek-exit-btn" onClick={onClose}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="navek-cinematic-video">
                    <iframe
                        src={ytUrl}
                        title={`${title} Preview`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    <div className="preview-indicator">
                        <span className="dot"></span> NOW PLAYING • CINEMATIC EXPERIENCE
                    </div>
                </div>

                <div className="navek-metadata-hub">
                    <div className="hub-left">
                        <h1 className="movie-hero-title">{title}</h1>
                        <div className="tags-row">
                            <span className="tag-prime">NAVEK EXCLUSIVE</span>
                            <span className="tag-rating">⭐ {rating || '8.5'}</span>
                            <span className="tag-year">{year || '2024'}</span>
                            <span className="tag-quality">4K Ultra HD</span>
                        </div>
                        <p className="movie-synopsis-text">
                            {description || "A NAVEK original masterpiece. Experience the journey of power, emotion, and survival in this critically acclaimed cinematic event."}
                        </p>
                    </div>

                    <div className="hub-right">
                        <div className="credit-box">
                            <label>Cast</label>
                            <p>{cast || "Internal Data Error"}</p>
                        </div>
                        <div className="credit-box">
                            <label>Director</label>
                            <p>{director || "Internal Data Error"}</p>
                        </div>
                        <div className="credit-box">
                            <label>Genre</label>
                            <p>{genre}</p>
                        </div>
                    </div>
                </div>

                <div className="navek-footer-bar">
                    <button className="navek-main-btn" onClick={onClose}>Stop Watching</button>
                    <button className="navek-alt-btn" onClick={() => toggleWatchlist(selectedMovie)}>+ Watchlist</button>
                </div>
            </div>
        </div>
    );
};

export default TrailerModal;
