import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function NavbarComp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ❌ Login/Register la navbar hide
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar
      fixed="top"
      expand="lg"
      className={`premium-nav ${scrolled ? "scrolled" : ""}`}
    >
      <Container fluid className="px-2 px-md-4">
        <Navbar.Brand
          className="brand-font fs-3 fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          NAVEK MOVIES
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-1 gap-lg-2 gap-xl-3">
            <Nav.Link
              className={`nav-item-premium ${location.pathname === "/home" ? "active" : ""}`}
              onClick={() => navigate("/home")}
            >
              Home
            </Nav.Link>

            <Nav.Link
              className={`nav-item-premium ${location.pathname === "/recommendations" ? "active" : ""}`}
              onClick={() => navigate("/recommendations")}
            >
              Recommendations
            </Nav.Link>

            <Nav.Link
              className={`nav-item-premium ${location.pathname === "/cinematic-ai" ? "active" : ""}`}
              onClick={() => navigate("/cinematic-ai")}
            >
              Cinematic AI
            </Nav.Link>

            <Nav.Link
              className={`nav-item-premium ${location.pathname === "/stars" ? "active" : ""}`}
              onClick={() => navigate("/stars")}
            >
              Stars & Creators
            </Nav.Link>

            <Nav.Link
              className={`nav-item-premium ${location.pathname === "/watchlist" ? "active" : ""}`}
              onClick={() => navigate("/watchlist")}
            >
              Watchlist
            </Nav.Link>

            {user && (
              <div 
                className="user-profile ms-3 d-flex align-items-center" 
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
                title="View Profile"
              >
                <div className="user-avatar-nav">
                  {localStorage.getItem("profilePic") ? (
                    <img 
                      src={localStorage.getItem("profilePic")} 
                      alt="profile" 
                      className="nav-profile-img" 
                    />
                  ) : (
                    user.name[0]
                  )}
                </div>
                <div className="ms-2 d-none d-md-block">
                   <div className="nav-hi-text">Hi,</div>
                   <div className="nav-user-name">{user.name}</div>
                </div>
              </div>
            )}

            <Button
              variant="link"
              className="text-white text-decoration-none ms-2 logout-btn"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}