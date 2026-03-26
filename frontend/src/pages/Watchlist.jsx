import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import TrailerModal from "../components/movie/TrailerModal";
import "../styles/watchlist.css";

export default function Watchlist() {
    const [list, setList] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("watchlist")) || [];
        setList(data);
    }, []);

    const removeFromWatchlist = (movie) => {
        const newList = list.filter((m) => m.title !== movie.title);
        setList(newList);
        localStorage.setItem("watchlist", JSON.stringify(newList));
    };

    const handlePlay = (movie) => {
        setSelectedMovie(movie);
        setIsTrailerOpen(true);

        let history = JSON.parse(localStorage.getItem("clickedHistory")) || [];
        if (!history.find(m => m.title === movie.title)) {
            history.push(movie);
            if (history.length > 50) history.shift();
            localStorage.setItem("clickedHistory", JSON.stringify(history));
        }
    };

    return (
        <div className="watchlist-page">
            <Container className="py-5">
                <div className="watchlist-header">
                    <h1 className="watchlist-title">
                        <span>✨</span> My Watchlist
                    </h1>
                    <p className="watchlist-count">
                        {list.length} {list.length === 1 ? "Masterpiece" : "Masterpieces"} saved to your collection
                    </p>
                </div>

                {list.length === 0 ? (
                    <div className="empty-watchlist">
                        <div className="empty-icon">🎬</div>
                        <h3>Your watchlist is empty</h3>
                        <p className="text-muted">Explore our collection and add your favorite movies here.</p>
                        <Link to="/recommendations" className="browse-btn">
                            Explore Movies
                        </Link>
                    </div>
                ) : (
                    <div className="watchlist-grid">
                        {list.map((m, i) => (
                            <div key={i} className="watch-card">
                                <div className="watch-actions-top">
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromWatchlist(m)}
                                        title="Remove from Watchlist"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="watch-poster-wrapper" onClick={() => handlePlay(m)} style={{ cursor: "pointer" }}>
                                    <img
                                        src={m.poster}
                                        className="watch-poster"
                                        alt={m.title}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                                        }}
                                    />
                                    <div className="watch-overlay">
                                        <button className="watch-play-btn" onClick={(e) => { e.stopPropagation(); handlePlay(m); }}>▶ Play Now</button>
                                    </div>
                                </div>

                                <div className="watch-details">
                                    <div className="watch-meta-info">
                                        <span className="watch-genre-tag">{m.genre?.split(',')[0]}</span>
                                        <span>⭐ {m.rating || "8.5"}</span>
                                    </div>
                                    <h5>{m.title}</h5>
                                    <div className="watch-meta-info">
                                        <span>{m.year || "2024"}</span>
                                        <span>•</span>
                                        <span>{m.runtime || "2h 15m"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>

            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                selectedMovie={selectedMovie}
                toggleWatchlist={(m) => {
                    const newList = list.filter((x) => x.title !== m.title);
                    setList(newList);
                    localStorage.setItem("watchlist", JSON.stringify(newList));
                    // Because Watchlist only shows added ones, toggling means removing
                }}
            />
        </div>
    );
}