import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Button, Badge } from "react-bootstrap";
import { getMovieById } from "../services/movieService";
import TrailerModal from "../components/movie/TrailerModal";
import "../styles/moviedetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  const FALLBACK_POSTER =
    "https://via.placeholder.com/600x900.png?text=No+Poster";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await getMovieById(id);
        setMovie(res.data);
      } catch (err) {
        console.log("Movie details fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

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

  // Loading
  if (loading) {
    return (
      <div className="details-page">
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="info" />
          <p className="mt-3 text-light">Loading movie details...</p>
        </Container>
      </div>
    );
  }

  // No Movie
  if (!movie) {
    return (
      <div className="details-page">
        <Container className="py-5 text-center">
          <h3 className="text-danger fw-bold">Movie Not Found ❌</h3>
          <Button
            className="mt-3"
            variant="info"
            onClick={() => navigate("/")}
          >
            ⬅ Back to Home
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="details-page">
      <Container className="py-4">
        {/* Back Button */}
        <div className="mb-4">
          <Button variant="outline-info" onClick={() => navigate("/")}>
            ⬅ Back
          </Button>
        </div>

        {/* Main Layout */}
        <div className="details-wrap">
          {/* Poster */}
          <div className="details-poster">
            <img
              src={movie.poster || FALLBACK_POSTER}
              alt={movie.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_POSTER;
              }}
            />
          </div>

          {/* Info */}
          <div className="details-info">
            <h1 className="details-title">{movie.title}</h1>

            <div className="details-tags">
              <Badge bg="info" className="tag">
                {movie.genre}
              </Badge>
              <Badge bg="secondary" className="tag">
                {movie.language}
              </Badge>
              <Badge bg="dark" className="tag">
                {movie.year}
              </Badge>
              <Badge bg="warning" text="dark" className="tag">
                ⭐ {movie.rating}
              </Badge>
            </div>

            <p className="details-desc">
              {movie.description || "No description available."}
            </p>

            <div className="details-actions">
              <Button 
                variant="info" 
                className="me-2"
                onClick={() => navigate(`/watch/${movie._id}`, { state: { movie } })}
              >
                ▶ Watch Full Movie/Trailer
              </Button>
              <Button 
                variant="outline-light" 
                onClick={() => toggleWatchlist(movie)}
              >
                {watchlist.find(m => m.title === movie.title) ? "✔ In Watchlist" : "➕ Add to Watchlist"}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        selectedMovie={movie}
        toggleWatchlist={toggleWatchlist}
      />
    </div>
  );
}
