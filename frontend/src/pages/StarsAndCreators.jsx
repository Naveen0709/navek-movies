import React, { useRef, useState } from "react";
import { Container, Modal, Spinner } from "react-bootstrap";
import { actors, actresses, directors, comedians, villains, maleMusicians, femaleMusicians } from "../data/starsData";
import TrailerModal from "../components/movie/TrailerModal";
import "../styles/starsandcreators.css";

export default function StarsAndCreators() {
    const r1 = useRef(null);
    const r2 = useRef(null);
    const r3 = useRef(null);
    const r4 = useRef(null);
    const r5 = useRef(null);
    const r6 = useRef(null);
    const r7 = useRef(null);

    const [selectedStar, setSelectedStar] = useState(null);
    const [starMovies, setStarMovies] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [watchlist, setWatchlist] = useState(
        JSON.parse(localStorage.getItem("watchlist")) || []
    );
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    const formatMovie = (m) => ({
        title: m.title,
        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
        rating: m.vote_average?.toFixed(1) || "8.5",
        year: m.release_date?.split("-")[0] || "2024",
        description: m.overview || "An unforgettable cinematic experience.",
        genre: `${selectedStar?.role || 'Top'} Movie`
    });

    const handlePlay = async (rawMovie) => {
        const TMDB_API_KEY = "eb46ebb646eea7183b734797b40cb202";
        let trailerId = "fT-l6K7K44A"; // Default fallback
        let movieCast = "Unknown Cast";
        let movieDirector = "Unknown Director";

        try {
            // 🎬 Fetch Trailer and Credits in Parallel (Include localized results)
            const [videoRes, creditRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/movie/${rawMovie.id}/videos?api_key=${TMDB_API_KEY}`),
                fetch(`https://api.themoviedb.org/3/movie/${rawMovie.id}/credits?api_key=${TMDB_API_KEY}`)
            ]);

            const videoData = await videoRes.json();
            const creditData = await creditRes.json();

            // Pick the best trailer (Search for "Trailer" then "Teaser")
            const videos = videoData.results || [];
            const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || 
                            videos.find(v => v.type === "Teaser" && v.site === "YouTube") ||
                            videos.find(v => v.site === "YouTube");
            
            if (trailer) trailerId = trailer.key;

            // Extract Credits
            movieCast = creditData.cast?.slice(0, 4).map(c => c.name).join(", ") || "Unknown Cast";
            movieDirector = creditData.crew?.find(c => c.job === "Director")?.name || "Unknown Director";
        } catch (err) {
            console.warn("Trailer Fetch Fail:", err);
        }

        const formatted = {
            ...formatMovie(rawMovie),
            trailerId,
            cast: movieCast,
            director: movieDirector
        };

        setSelectedMovie(formatted);
        setIsTrailerOpen(true);

        // 📝 Tracking Click History
        let history = JSON.parse(localStorage.getItem("clickedHistory")) || [];
        if (!history.find(m => m.title === formatted.title)) {
            history.push(formatted);
            if (history.length > 50) history.shift();
            localStorage.setItem("clickedHistory", JSON.stringify(history));
        }
    };

    const toggleWatchlist = (rawMovie) => {
        const formatted = formatMovie(rawMovie);
        let updated;
        if (watchlist.find((x) => x.title === formatted.title)) {
            updated = watchlist.filter((x) => x.title !== formatted.title);
        } else {
            updated = [...watchlist, formatted];
        }
        setWatchlist(updated);
        localStorage.setItem("watchlist", JSON.stringify(updated));
    };

    const fetchStarMovies = async (personName, role) => {
        try {
            setLoadingMovies(true);
            setShowModal(true);
            setSelectedStar({ name: personName, role });
            setStarMovies([]);

            const EXACT_MATCH_IDS = {
                "Vijay": 91547, // Joseph Vijay
                "Lee Jong-suk": 1095818,
                "Park Seo-joon": 1197825,
                "Lee Dong-wook": 1238592,
                "Nagarjuna": 149958,
                "Kim Soo-hyun": 137223,
                "Kim Tae-ri": 1517036,
                "Sunil": 180126,
                "Ali": 1283842,
                "Johnny Lever": 51700
            };

            let personId = EXACT_MATCH_IDS[personName];

            if (!personId) {
                // 1. Get Person ID if no hardcoded exact match
                const searchRes = await fetch(`https://api.themoviedb.org/3/search/person?api_key=eb46ebb646eea7183b734797b40cb202&query=${encodeURIComponent(personName)}`);
                const searchData = await searchRes.json();

                if (searchData.results && searchData.results.length > 0) {
                    // Sort by popularity so we always pick the most famous person with that name
                    const sortedResults = searchData.results.sort((a, b) => b.popularity - a.popularity);
                    personId = sortedResults[0].id;
                }
            }

            if (personId) {

                // 2. Get Movie Credits (Directly from TMDB for maximum results)
                const credRes = await fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=eb46ebb646eea7183b734797b40cb202&language=en-US`);
                const credData = await credRes.json();

                let movies = [];
                if (role === "Director") {
                    movies = credData.crew?.filter(m => m.job === "Director" && m.poster_path) || [];
                } else if (role.includes("Musician")) {
                    // TMDB Music Credits often in Crew (Music, Original Music Composer, Soundtrack)
                    const crewMovies = credData.crew?.filter(m => 
                        ["Original Music Composer", "Music", "Soundtrack", "Songs"].includes(m.job) && m.poster_path
                    ) || [];
                    const castMovies = credData.cast?.filter(m => m.poster_path) || [];
                    movies = [...crewMovies, ...castMovies];
                } else {
                    movies = credData.cast?.filter(m => m.poster_path) || [];
                }

                // Sort by popularity and get top 30
                movies.sort((a, b) => b.popularity - a.popularity);

                // Remove duplicates
                const unique = movies.reduce((acc, current) => {
                    const x = acc.find(item => item.id === current.id);
                    if (!x) return acc.concat([current]);
                    else return acc;
                }, []);

                setStarMovies(unique.slice(0, 30));
            }
        } catch (err) {
            console.error("Failed to fetch star movies:", err);
        } finally {
            setLoadingMovies(false);
        }
    };

    const scroll = (ref, dir) => {
        if (ref.current) {
            const scrollAmount = window.innerWidth * 0.8;
            ref.current.scrollBy({
                left: dir === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const renderSlider = (title, data, ref, role) => {
        if (!data || data.length === 0) return null;

        // 🚀 Filter out any star whose image is missing/placeholder, or if they have amazon/wikimedia links which are currently 403 forbidden.
        const validData = data.filter(p =>
            p.image &&
            !p.image.includes("placeholder") &&
            !p.image.includes("mXfofvKWaF30rNq2fW1rT0s4wzQ.jpg") &&
            !p.image.includes("amazon") &&
            !p.image.includes("wikimedia")
        );

        if (validData.length === 0) return null;

        return (
            <div className="stars-section" key={title}>
                <h3>{title}</h3>
                <div className="stars-slider-container">
                    <button className="stars-arrow left" onClick={() => scroll(ref, "left")}>
                        ‹
                    </button>
                    <div className="stars-row" ref={ref}>
                        {validData.map((person, idx) => (
                            <div key={idx} className="star-card" onClick={() => fetchStarMovies(person.name, role)}>
                                <div className="star-image-container">
                                    <img
                                        src={person.image.replace("/w500/", "/w185/")}
                                        alt={person.name}
                                        className="star-image"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://via.placeholder.com/300x450.png?text=${encodeURIComponent(person.name)}`;
                                        }}
                                    />
                                </div>
                                <div className="star-info">
                                    <h5 className="star-name">{person.name}</h5>
                                    <span className="star-role">{role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="stars-arrow right" onClick={() => scroll(ref, "right")}>
                        ›
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="stars-page">
            <Container className="py-4">
                <div className="stars-header-section">
                    <h1 className="stars-main-title">Stars & Creators</h1>
                    <p className="stars-subtitle">
                        Discover the brilliant minds and faces behind your favorite cinematic masterpieces.
                    </p>
                </div>

                {renderSlider("🎭 Leading Actors", actors, r1, "Actor")}
                {renderSlider("🌟 Leading Actresses", actresses, r2, "Actress")}
                {renderSlider("🎬 Visionary Directors", directors, r3, "Director")}
                {renderSlider("😂 King of Comedy", comedians, r4, "Comedian")}
                {renderSlider("🦹 Iconic Villains", villains, r5, "Villain")}
                {renderSlider("🎹 Top Male Musicians", maleMusicians, r6, "Musician")}
                {renderSlider("🎤 Top Female Musicians", femaleMusicians, r7, "Musician")}

            </Container>

            {/* 🌟 Star Movies Modal */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="xl"
                centered
                className="star-movies-modal"
            >
                <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: "#040b12", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <Modal.Title className="text-white fw-bold d-flex align-items-center gap-2">
                        <span style={{ color: "var(--primary)" }}>{selectedStar?.role}:</span> {selectedStar?.name}'s Top Movies
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#0a131e", borderBottomLeftRadius: "var(--bs-modal-border-radius)", borderBottomRightRadius: "var(--bs-modal-border-radius)", minHeight: "400px" }}>
                    {loadingMovies ? (
                        <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center h-100">
                            <Spinner animation="border" variant="warning" style={{ width: "3rem", height: "3rem" }} />
                            <p className="mt-4 text-white" style={{ fontSize: "1.2rem" }}>Unlocking {selectedStar?.name}'s Masterpieces...</p>
                        </div>
                    ) : starMovies.length > 0 ? (
                        <div className="star-movies-grid">
                            {starMovies.map((m, i) => (
                                <div key={i} className="star-movie-card">
                                    <div className="star-movie-poster-container" onClick={() => handlePlay(m)}>
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                                            alt={m.title}
                                            className="star-movie-poster"
                                        />
                                        <button
                                            className="play-overlay-btn"
                                            title="Play Now"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlay(m);
                                            }}
                                        >
                                            ▶
                                        </button>
                                        <div className="star-movie-overlay">
                                            <span className="star-movie-rating">⭐ {m.vote_average?.toFixed(1) || "N/A"}</span>
                                            <span className="star-movie-year">{m.release_date?.split("-")[0]}</span>
                                        </div>
                                    </div>
                                    <div className="star-movie-info" style={{ padding: "12px", textAlign: "center" }}>
                                        <h6 title={m.title} style={{ fontSize: "14px", color: "#fff", margin: "0 0 10px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</h6>
                                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                            <button
                                                style={{ background: "#00b7ff", border: "none", color: "#fff", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", flex: 1 }}
                                                onClick={() => handlePlay(m)}
                                            >
                                                ▶ Play
                                            </button>
                                            <button
                                                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "4px 10px", borderRadius: "20px", fontSize: "16px", lineHeight: "14px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                                onClick={() => toggleWatchlist(m)}
                                                title="Add to Watchlist"
                                            >
                                                {watchlist.find((x) => x.title === m.title) ? "✔" : "+"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            <h5>No movies found for {selectedStar?.name}!</h5>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            {/* Cinematic Trailer Modal */}
            <TrailerModal
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                selectedMovie={selectedMovie}
                toggleWatchlist={(m) => {
                    let updated;
                    if (watchlist.find((x) => x.title === m.title)) {
                        updated = watchlist.filter((x) => x.title !== m.title);
                    } else {
                        updated = [...watchlist, m];
                    }
                    setWatchlist(updated);
                    localStorage.setItem("watchlist", JSON.stringify(updated));
                }}
            />
        </div>
    );
}
