import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import VideoPlayer from "../components/player/VideoPlayer";
import axios from "axios";

export default function Player() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const movieFromState = location.state?.movie;
  
  const [movie, setMovie] = useState(movieFromState || null);
  const [loading, setLoading] = useState(!movieFromState);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`https://navek-movies-xu0e.onrender.com/api/movies/${id}`);
        setMovie(res.data);
        
        // Fetch recommendations for next play
        const recRes = await axios.get(`https://navek-movies-xu0e.onrender.com/api/movies?limit=5`);
        setRecommendations(recRes.data.filter(m => m._id !== id));
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Movie not found or server error");
        setLoading(false);
      }
    };

    if (!movie) {
      fetchMovie();
    } else {
        // Just fetch recommendations
        axios.get(`https://navek-movies-xu0e.onrender.com/api/movies?limit=5`).then(res => {
            setRecommendations(res.data.filter(m => m._id !== id));
        });
    }
  }, [id, movie]);

  const handleNextPlay = useCallback(() => {
    if (recommendations.length > 0) {
      const nextMovie = recommendations[0];
      navigate(`/watch/${nextMovie._id}`, { state: { movie: nextMovie } });
    } else {
      navigate("/home");
    }
  }, [recommendations, navigate]);

  if (loading) return (
    <div className="player-loading-wrapper">
        <div className="spinner"></div>
        <p>Preparing Cinematic Experience...</p>
    </div>
  );

  if (error) return (
    <div className="player-error">
        <h2>ERROR</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/home")}>BACK TO HOME</button>
    </div>
  );

  return (
    <div className="movie-page-container">
      <VideoPlayer 
        movie={movie} 
        onNext={handleNextPlay} 
      />
    </div>
  );
}

