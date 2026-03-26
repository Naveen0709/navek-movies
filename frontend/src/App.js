import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Recommendations from "./pages/Recommendations";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import StarsAndCreators from "./pages/StarsAndCreators";
import CinematicAI from "./pages/CinematicAI";
import Player from "./pages/Player";


import NavbarComp from "./components/common/Navbar";

export default function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount and when storage changes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Listen for login events (we can trigger this manually or just use a state update if we pass setUser)
  const handleLoginSuccess = () => {
    setUser(JSON.parse(localStorage.getItem("user")));
  };

  return (
    <Router>
      {/* ✅ Navbar only after login */}
      {user && <NavbarComp />}

      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />

        {/* Auth */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />

        <Route
          path="/recommendations"
          element={user ? <Recommendations /> : <Navigate to="/login" />}
        />

        <Route
          path="/watchlist"
          element={user ? <Watchlist /> : <Navigate to="/login" />}
        />

        <Route
          path="/stars"
          element={user ? <StarsAndCreators /> : <Navigate to="/login" />}
        />

        <Route
          path="/cinematic-ai"
          element={user ? <CinematicAI /> : <Navigate to="/login" />}
        />



        <Route
          path="/movie/:id"

          element={user ? <MovieDetails /> : <Navigate to="/login" />}
        />

        <Route
          path="/watch/:id"
          element={user ? <Player /> : <Navigate to="/login" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}