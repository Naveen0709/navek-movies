import React, { useState, useEffect, useRef } from "react";
import TrailerModal from "../components/movie/TrailerModal";
import "./CinematicAI.css";
import { Send, Sparkles, Brain, Search, Info, Trash2, User, Bot } from "lucide-react";
import { actors, actresses, directors, comedians, villains, maleMusicians, femaleMusicians } from "../data/starsData";

export default function CinematicAI() {
    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "Hey buddy! 👋 I'm **CINEMATIC AI**, your professional movie expert and personal film buddy. \n\nI live and breathe cinema—from IMDb rankings and Reddit discussions to global trends. Whether you're feeling bored, looking for a hidden gem, or need a specific vibe, I'm here to fix you up with the perfect watchlist. \n\nWhat's your current movie mood?",
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userText = inputValue.trim();
        setMessages(prev => [...prev, { role: "user", text: userText }]);
        setInputValue("");
        setIsThinking(true);

        try {
            // 🔍 EXTRA FEATURE: Star Recognition System
            const allStars = [...actors, ...actresses, ...directors, ...comedians, ...villains, ...maleMusicians, ...femaleMusicians];
            const lowerText = userText.toLowerCase();
            const matchedStar = allStars.find(s => lowerText.includes(s.name.toLowerCase()));

            if (matchedStar) {
                // Determine Role
                let role = "Star";
                if (directors.find(d => d.name === matchedStar.name)) role = "Director";
                else if (maleMusicians.find(m => m.name === matchedStar.name) || femaleMusicians.find(f => f.name === matchedStar.name)) role = "Musician";

                // Fetch Person Data from TMDB - Using a slightly more robust search
                const searchRes = await fetch(`https://api.themoviedb.org/3/search/person?api_key=eb46ebb646eea7183b734797b40cb202&query=${encodeURIComponent(matchedStar.name)}`);
                const searchData = await searchRes.json();
                
                // Pick the most popular result that matches the name
                const person = searchData.results?.sort((a,b) => b.popularity - a.popularity)[0];
                const personId = person?.id;

                if (personId) {
                    const credRes = await fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=eb46ebb646eea7183b734797b40cb202`);
                    const credData = await credRes.json();
                    
                    let rawMovies = [];
                    if (role === "Director") {
                        rawMovies = credData.crew?.filter(m => m.job === "Director" && m.poster_path) || [];
                    } else if (role === "Musician") {
                        rawMovies = credData.crew?.filter(m => ["Original Music Composer", "Soundtrack", "Music"].includes(m.job) && m.poster_path) || [];
                    } else {
                        rawMovies = credData.cast?.filter(m => m.poster_path) || [];
                    }

                    if (rawMovies.length > 0) {
                        const formattedMovies = rawMovies
                            .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0)) // Sort by popularity/votes
                            .slice(0, 10)
                            .map(m => ({
                                title: m.title,
                                poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                                rating: m.vote_average?.toFixed(1) || "7.5",
                                year: m.release_date?.split("-")[0] || "N/A",
                                genre: role,
                                description: m.overview,
                                id: m.id,
                                whyWatch: `One of the most defining works in ${matchedStar.name}'s career.`
                            }));

                        setMessages(prev => [...prev, {
                            role: "ai",
                            text: `Oh, you're looking for **${matchedStar.name}** movies? Excellent choice! 🎬 \n\nI've analyzed the cinematic archives and found these top-rated bangers for you. Check them out:`,
                            movies: formattedMovies
                        }]);
                        setIsThinking(false);
                        return;
                    }
                }
            }

            // Standard Backend AI Path - We include the user's message as is
            const response = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userText })
            });
            const data = await response.json();

            if (data.text) {
                setMessages(prev => [...prev, { role: "ai", text: data.text }]);
            } else if (data.recommendations) {
                setMessages(prev => [...prev, {
                    role: "ai",
                    text: "Analyzing global archives... Found these hits for you! 🔥",
                    movies: data.recommendations,
                    explanation: data.explanation
                }]);
            } else {
                setMessages(prev => [...prev, { role: "ai", text: "I encountered a slight glitch. Try again!" }]);
            }
        } catch (err) {
            console.error("AI Error:", err);
            setMessages(prev => [...prev, { role: "ai", text: "Signal weak! 📡 Check connection." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleMovieClick = (movie) => {
        const formatted = {
            ...movie,
            poster: movie.poster || "https://via.placeholder.com/300x450?text=Poster+Missing",
            rating: movie.rating || "7.5",
            year: movie.year || "2024",
            genre: movie.genre || "AI Hit",
            description: movie.description || "An AI recommended cinematic choice."
        };

        setSelectedMovie(formatted);
        setIsTrailerOpen(true);

        // 📝 Tracking Click History for Profile Page
        let history = JSON.parse(localStorage.getItem("clickedHistory")) || [];
        if (!history.find(m => m.title === formatted.title)) {
            history.push(formatted);
            // Keep recent 50
            if (history.length > 50) history.shift();
            localStorage.setItem("clickedHistory", JSON.stringify(history));
        }
    };

    const clearChat = () => {
        if(window.confirm("Do you want to clear our movie discussion?")) {
            setMessages([{
                role: "ai",
                text: "Hey buddy! 👋 I'm back. Ready for a fresh start. What kind of movie mood are you in now?",
            }]);
        }
    };

    // Helper to format text with markdown-lite
    const formatText = (text) => {
        if (!text) return "";
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\[SIMULATING DATA FROM (.*?)\]/g, '<span class="sim-badge">$1</span>') // Simulation Badge
            .replace(/Memory Sync:/g, '<span class="memory-sync">🧠 Memory Sync:</span>'); // Memory Sync
        
        return { __html: formatted };
    };

    return (
        <div className="cinematic-ai-container">
            <div className="ai-header">
                <div className="ai-logo">
                    <Brain className="brain-icon" />
                </div>
                <h1 className="premium-title">CINEMATIC <span className="highlight">AI PRO</span></h1>
            </div>

            <div className="chat-window">
                <div className="chat-controls">
                    <div className="status-indicator">
                        <span className="dot"></span>
                        ONLINE: GLOBAL DATA FEED ACTIVE
                    </div>
                    <button className="clear-btn" onClick={clearChat} title="Clear Conversation">
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="messages-area">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-wrapper ${msg.role === 'user' ? 'user-wrapper' : 'ai-wrapper'}`}>
                            <div className="avatar">
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'ai-message'} ${msg.movies ? 'has-movies' : ''}`}>
                                <div className="text-content" dangerouslySetInnerHTML={formatText(msg.text)} />

                                {msg.explanation && (
                                    <div className="explanation-area">
                                        <div className="explanation" dangerouslySetInnerHTML={formatText(msg.explanation)} />
                                    </div>
                                )}

                                {msg.movies && (
                                    <div className="ai-movies-grid">
                                        {msg.movies.map((movie, mIdx) => (
                                            <div key={mIdx} className="ai-movie-card" onClick={() => handleMovieClick(movie)}>
                                                <div className="card-poster-wrapper">
                                                    <img src={movie.poster} alt={movie.title} onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=Poster+Missing" }} />
                                                    <div className="rating-corner">⭐ {movie.rating}</div>
                                                    <div className="card-overlay">
                                                        <button className="watch-now-btn">Quick Look</button>
                                                    </div>
                                                </div>
                                                <div className="ai-movie-info">
                                                    <div className="ai-movie-title">{movie.title} <span className="y">({movie.year})</span></div>
                                                    <div className="movie-details-strip">
                                                        {movie.matchScore && <span className="match-score">Score: {Math.round(movie.matchScore)}</span>}
                                                        <span className="genre-tag">{movie.genre?.split(',')[0]}</span>
                                                    </div>
                                                    {movie.whyWatch && (
                                                        <div className="why-watch-badge">
                                                            <Sparkles size={12} className="sparkle" />
                                                            <span className="text">{movie.whyWatch}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="message-wrapper ai-wrapper">
                            <div className="avatar ai-glow">
                                <Bot size={20} />
                            </div>
                            <div className="message-bubble ai-message thinking-bubble">
                                <div className="thinking">
                                    <span></span><span></span><span></span>
                                </div>
                                <span className="thinking-text">Searching global trends...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="ai-input-area">
                    <div className="ai-input-wrapper">
                        <Search className="input-search-icon" size={20} />
                        <input
                            type="text"
                            className="ai-chat-input"
                            placeholder="Tell your buddy what you're in the mood for... (e.g., 'Bored, need something like Batman')"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                    </div>
                    <button className="send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
                        <Send size={20} />
                    </button>
                </div>
            </div>

            <div className="ai-footer-info">
                <span><Info size={14} /> Data simulated from Real-time Reddit, IMDb & Google Movie Trends</span>
            </div>

            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                selectedMovie={selectedMovie}
                toggleWatchlist={(movie) => {
                    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
                    if (watchlist.find(m => m.title === movie.title)) {
                        watchlist = watchlist.filter(m => m.title !== movie.title);
                    } else {
                        watchlist.push(movie);
                    }
                    localStorage.setItem("watchlist", JSON.stringify(watchlist));
                }}
            />
        </div>
    );
}
