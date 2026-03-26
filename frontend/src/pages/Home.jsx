import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../services/movieService";
import TrailerModal from "../components/movie/TrailerModal";
import GenreSection from "../components/movie/GenreSection";
import LanguageSection from "../components/movie/LanguageSection";
import "../styles/home.css";

import "../components/movie/GenreSection.css";
import "../components/movie/LanguageSection.css";


export default function Home() {
  const navigate = useNavigate();
  const [globalMovies, setGlobalMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );
  const [genreFilterMovies, setGenreFilterMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [languageFilterMovies, setLanguageFilterMovies] = useState([]);
  const [selectedLanguageName, setSelectedLanguageName] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([
    { title: "Fast & Furious 7", poster: "/slider1/fast7.jpg", rating: "7.1", year: "2015", trailerId: "Skpu5HaVkOc" }, 
    { title: "Your Name", poster: "/slider1/yourname.jpg", rating: "8.4", year: "2016", trailerId: "s0wTd7yguSI" }, 
    { title: "Companion", poster: "/slider1/companion.jpg", rating: "7.0", year: "2025", trailerId: "QY5p-B-v7B4" }, 
    { title: "Justice League", poster: "/slider1/justiceleague.jpg", rating: "6.2", year: "2017", trailerId: "3cxixDgSZWw" }, 
    { title: "Ready Player One", poster: "/slider1/readyplayerone.jpg", rating: "7.4", year: "2018", trailerId: "cSp1dM2Vj48" }, 
    { title: "Spider-Man: Spider-Verse", poster: "/slider1/spiderverse.jpg", rating: "8.4", year: "2018", trailerId: "g4Hbz2jLxvQ" }, 
    { title: "Cars", poster: "/slider1/cars.jpg", rating: "7.2", year: "2006", trailerId: "SbXIj2y-_co" }, 
    { title: "MS Dhoni", poster: "/slider1/msdhoni.jpg", rating: "7.9", year: "2016", trailerId: "6L6XqWoS8tw" }, 
    { title: "Mankatha", poster: "/slider1/mankatha.jpg", rating: "7.7", year: "2011", trailerId: "fT-l6K7K44A" }
  ]);
  const [topPicks, setTopPicks] = useState([
    { title: "Avengers Endgame", poster: "/slider2/endgame.jpg", rating: "8.4", year: "2019", trailerId: "TcMBFSGVi1c" }, 
    { title: "Avatar", poster: "/slider2/avatar.jpg", rating: "7.9", year: "2009", trailerId: "5PSNL1qE6VY" }, 
    { title: "Spider-Man NWH", poster: "/slider2/spiderman.jpg", rating: "8.2", year: "2021", trailerId: "JfVOs4VSpmA" }, 
    { title: "Star Wars", poster: "/slider2/starwars.jpg", rating: "8.6", year: "1977", trailerId: "1g3_CFmnU7k" }, 
    { title: "Titanic", poster: "/slider2/titanic.jpg", rating: "7.9", year: "1997", trailerId: "zq6iZQDuz68" }, 
    { title: "The Conjuring", poster: "/slider2/conjuring.jpg", rating: "7.5", year: "2013", trailerId: "k10ETZ41q5o" }, 
    { title: "Transformers", poster: "/slider2/transformers.jpg", rating: "7.0", year: "2007", trailerId: "bn4LqK65C-E" }, 
    { title: "Godfather", poster: "/slider2/godfather.jpg", rating: "9.2", year: "1972", trailerId: "sY1S34973zA" }, 
    { title: "Superman", poster: "/slider2/superman.jpg", rating: "7.1", year: "1978", trailerId: "pGv1S7v_7kM" }, 
    { title: "Batman", poster: "/slider2/batman.jpg", rating: "7.5", year: "1989", trailerId: "dgC9Q0isXNo" }
  ]);
  const genreRef = useRef(null);

  const languageRef = useRef(null);

  const handlePlay = (movie) => {
    // Instead of Modal, we go to the REAL Streaming Player
    navigate(`/watch/${movie._id || 'local'}`, { state: { movie } });

    let history = JSON.parse(localStorage.getItem("clickedHistory")) || [];
    if (!history.find(m => m.title === movie.title)) {
      history.push(movie);
      if (history.length > 50) history.shift();
      localStorage.setItem("clickedHistory", JSON.stringify(history));
    }
  };

  const handleGenreSelect = async (genre) => {
    setSelectedGenre(genre);
    try {
      const res = await getMovies(100, genre);
      setGenreFilterMovies(res.data);
      // Clear language results when browsing genres
      setLanguageFilterMovies([]);
      // Scroll to the genre results with a slight delay
      setTimeout(() => {
        if (genreRef.current) {
          genreRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } catch (err) {
      console.error("Failed to fetch movies for genre: " + genre, err);
    }
  };

  const handleLanguageSelect = async (code, name) => {
    setSelectedLanguageName(name);

    // ✅ SAVE GLOBAL AUDIO PREFERENCE
    localStorage.setItem("globalAudioPreference", name);

    try {
      const res = await getMovies(100, "", name);
      setLanguageFilterMovies(res.data);
      // Clear genre results when browsing languages
      setGenreFilterMovies([]);
      // Scroll to the language results
      setTimeout(() => {
        if (languageRef.current) {
          languageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } catch (err) {
      console.error("Failed to fetch movies for language: " + name, err);
    }
  };

  const toggleWatchlist = (movie) => {
    let updated;
    if (watchlist.find(m => m.title === movie.title)) {
      updated = watchlist.filter(m => m.title !== movie.title);
    } else {
      updated = [...watchlist, movie];
    }
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  const s1 = useRef(null);
  const s2 = useRef(null);
  const s3 = useRef(null);
  const s4 = useRef(null);
  const s5 = useRef(null);
  const s6 = useRef(null);
  const s7 = useRef(null);
  const s8 = useRef(null);
  const s9 = useRef(null);
  const s10 = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [globalRes, actionRes] = await Promise.all([
          getMovies(100),
          getMovies(100, "Action")
        ]);
        setGlobalMovies(globalRes.data);
        setActionMovies(actionRes.data);
      } catch (err) {
        console.error("Failed to fetch home movies", err);
      }
    };
    fetchHomeData();
  }, []);

  // =========================
  // 🔄 AUTO-SHUFFLE ENGINE (Every 2 Minutes)
  // =========================
  useEffect(() => {
    const shuffleArray = (array) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    const interval = setInterval(() => {
      console.log("🔀 Shuffling movie layouts...");
      
      setGlobalMovies(prev => shuffleArray(prev));
      setActionMovies(prev => shuffleArray(prev));
      setGenreFilterMovies(prev => shuffleArray(prev));
      setLanguageFilterMovies(prev => shuffleArray(prev));
      setTrendingMovies(prev => shuffleArray(prev));
      setTopPicks(prev => shuffleArray(prev));
    }, 120000); // 120,000ms = 2 Minutes

    return () => clearInterval(interval);
  }, []);


  const scroll = (ref, dir) => {
    if (ref.current) {
      const scrollAmount = window.innerWidth * 0.8;
      ref.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const sliders = [
    { 
      title: "🔥 Trending Now", 
      ref: s1, 
      data: trendingMovies
    },
    { 
      title: "⭐ Top Picks For You", 
      ref: s2, 
      data: topPicks
    }
  ];


  const renderSlider = (title, data, ref) => (
    <div className="slider-section">
      <h2 className="section-title">{title}</h2>
      <div className="slider-container">
        <button className="slider-arrow left" onClick={() => scroll(ref, "left")}>‹</button>
        <div className="slider-content" ref={ref}>
          {data.map((m, i) => (
            <div key={i} className="premium-movie-card" onClick={() => handlePlay(m)}>
              <div className="card-inner">
                <img src={m.poster} alt={m.title} className="card-img" />
                <div className="card-overlay">
                  <h3 className="card-title">{m.title}</h3>
                  <div className="card-info">
                    <span className="info-rating">⭐ {m.rating}</span>
                    <span className="info-year">{m.year}</span>
                  </div>
                  <button className="card-play-btn" onClick={(e) => { e.stopPropagation(); handlePlay(m); }}>▶</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-arrow right" onClick={() => scroll(ref, "right")}>›</button>
      </div>
    </div>
  );

  return (
    <div className="premium-home">
      <div className="home-header">
        <h1 className="main-title">🎬 NAVEK <span className="highlight">MOVIES</span></h1>
        <p className="welcome-text">Explore your world of stories.</p>
      </div>

      <div className="main-content-wrapper">
        {/* 1. Trending Now (Top Priority) */}
        {renderSlider(sliders[0].title, sliders[0].data, sliders[0].ref)}

        {/* 2. Popular Genres */}
        <GenreSection onGenreSelect={handleGenreSelect} />

        {/* Genre Results */}
        {genreFilterMovies.length > 0 && (
          <div ref={genreRef}>
            {renderSlider(`✨ Best of ${selectedGenre}`, genreFilterMovies, s7)}
          </div>
        )}

        {/* 3. Explore by Language */}
        <LanguageSection onLanguageSelect={handleLanguageSelect} />

        {/* Language Results */}
        {languageFilterMovies.length > 0 && (
          <div ref={languageRef}>
            {renderSlider(`📽️ Top ${selectedLanguageName} Movies`, languageFilterMovies, s10)}
          </div>
        )}



        {/* 4. Other Sliders (Top Picks) */}
        {sliders.slice(1).map((s, idx) => (
          <React.Fragment key={idx}>
            {renderSlider(s.title, s.data, s.ref)}
          </React.Fragment>
        ))}

        {globalMovies.length > 0 && renderSlider("🌍 NAVEK Global Collection", globalMovies, s8)}
        {actionMovies.length > 0 && renderSlider("💥 Cinematic Action", actionMovies, s9)}
      </div>
    </div>
  );
}
