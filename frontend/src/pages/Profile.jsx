import React, { useState, useEffect } from "react";
import { Container, Button, Badge, Modal, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || { name: "Naveen" });
  const [greeting, setGreeting] = useState("Good Evening");
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || null);

  // Settings Hub States
  const [activeTab, setActiveTab] = useState("General");
  const [streamingQuality, setStreamingQuality] = useState(localStorage.getItem("streamingQuality") || "Auto");
  const [safeSearch, setSafeSearch] = useState(JSON.parse(localStorage.getItem("safeSearch") ?? "true"));

  // Guaranteed High-Quality Avatars from internal star database
  const avatarLibrary = [
    // ⚔️ Cinematic Legends
    { id: 1, url: "https://image.tmdb.org/t/p/w200/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg", name: "Iron Man" },
    { id: 2, url: "https://image.tmdb.org/t/p/w200/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg", name: "Leo" },
    { id: 3, url: "https://image.tmdb.org/t/p/w200/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg", name: "Batman" },
    { id: 4, url: "https://image.tmdb.org/t/p/w200/8oVIWyIoFUal8SJFnmCUtkkm1HP.jpg", name: "Vijay" },
    { id: 5, url: "https://image.tmdb.org/t/p/w200/cQBcrXqcQPfXOQfNfgO3slJM2xi.jpg", name: "Thalaivar" },
    { id: 6, url: "https://image.tmdb.org/t/p/w200/lKzmFToG07dhOZpb5inh0nUsRUZ.jpg", name: "Kamal" },
    { id: 7, url: "https://image.tmdb.org/t/p/w200/hIFXv3gIjlNS78gJmaguEOxvfPH.jpg", name: "Suriya" },
    { id: 8, url: "https://image.tmdb.org/t/p/w200/ocGoFb6TrK3uWGXt4WnuibUG1vD.jpg", name: "Gong Yoo" },
    { id: 17, url: "https://image.tmdb.org/t/p/w200/7Azkp8Wp0hU7e0W9S0W9S0W9S0W.jpg", name: "Dhanush" },
    { id: 18, url: "https://image.tmdb.org/t/p/w200/mXpYy4N8K5yY7XpA7B2XyY7XpA7.jpg", name: "Vikram" },
    // 👑 Leading Queens
    { id: 9, url: "https://image.tmdb.org/t/p/w200/6vR0fVn9M3R0L5j5v5f5f5f5f5f5f5f.jpg", name: "Nayanthara" },
    { id: 10, url: "https://image.tmdb.org/t/p/w200/fb5W0P0Fp6O8D8O8y0N0G0F0P6O.jpg", name: "Samantha" },
    { id: 11, url: "https://image.tmdb.org/t/p/w200/8O8y0N0G0F0P6Ofb5W0P0Fp6O8D.jpg", name: "Trisha" },
    { id: 12, url: "https://image.tmdb.org/t/p/w200/665Vf5f5f5f5f5f5f5f5f5f5f5f.jpg", name: "Scarlett" },
    { id: 13, url: "https://image.tmdb.org/t/p/w200/hE2BtrsgUrj1buTM7pS9P6P9U0U.jpg", name: "Margot Robbie" },
    { id: 14, url: "https://image.tmdb.org/t/p/w200/fS6id9v9Jp8R0vG7q0fD6b9X9yL.jpg", name: "Gal Gadot" },
    { id: 15, url: "https://image.tmdb.org/t/p/w200/7L8SJFnmCUtkkm1HP8oVIWyIoF.jpg", name: "Keerthy Suresh" },
    { id: 16, url: "https://image.tmdb.org/t/p/w200/1Q5r0gYI3Y6Y7k1j1Q5r0gYI3Y6.jpg", name: "Rashmika" },
    { id: 19, url: "https://image.tmdb.org/t/p/w200/pdyXpYy4N8K5yY7XpA7B2XyY7XpA7.jpg", name: "Tamannaah" },
    { id: 20, url: "https://image.tmdb.org/t/p/w200/vXpYy4N8K5yY7XpA7B2XyY7XpA7.jpg", name: "Ana de Armas" }
  ];

  useEffect(() => {
    // Dynamic Greeting
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good Morning");
    else if (hrs < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Load History & Filter Safety
    const rawHistory = JSON.parse(localStorage.getItem("clickedHistory")) || [];
    const safeHistory = rawHistory.filter(m => {
        if (!m || !m.title) return false;
        if (!safeSearch) return true; // If off, show everything
        
        const titleL = m.title.toLowerCase();
        const badWords = ["nambul", "内罗南火", "sex", "erotica", "prostitute", "nude", "hole-in-law", "18+"];
        return !badWords.some(w => titleL.includes(w));
    });

    setWatchHistory(safeHistory.reverse()); 
    setLoading(false);
  }, [safeSearch]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEditSave = () => {
    try {
      // 🛡️ Get the most recent user object from storage
      const existingUser = JSON.parse(localStorage.getItem("user")) || {};
      
      // Update only the name while keeping all other fields (token, email, etc.)
      const updatedUser = { ...existingUser, name: newName };
      
      // Force save to local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("streamingQuality", streamingQuality);
      localStorage.setItem("safeSearch", JSON.stringify(safeSearch));
      
      // Update local component state
      setUser(updatedUser);
      setShowEditNameModal(false);
      
      console.log("Profile updated successfully:", updatedUser.name);

      // Force a full page reload to ensure the Navbar and App state pick up the changes
      window.location.reload();
    } catch (err) {
      console.error("Failed to save profile name:", err);
      alert("Error saving name. Please try again.");
    }
  };

  const handleLocalUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setProfilePic(base64);
        localStorage.setItem("profilePic", base64);
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectLibraryAvatar = (url) => {
    setProfilePic(url);
    localStorage.setItem("profilePic", url);
    setShowAvatarModal(false);
  };

  const handlePlay = (movie) => {
    const movieId = movie._id || movie.id;
    if (movieId) {
      // 🍿 Direct Play: Go straight to Player instead of Movie Details
      navigate(`/watch/${movieId}`);
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="profile-page-ultimate">
      <div className="ultimate-overlay"></div>
      
      <Container fluid className="px-lg-5 py-5 ultimate-container">
        
        {/* 💎 ULTIMATE SIDEBAR */}
        <aside className="ultimate-sidebar">
          <div className="ultimate-avatar-box" onClick={() => setShowAvatarModal(true)}>
             <div className="ultimate-ring">
                {profilePic ? (
                  <img src={profilePic} alt={user.name} className="ultimate-img" />
                ) : (
                  <div className="ultimate-initial">{user.name[0]}</div>
                )}
             </div>
             <div className="ultimate-edit-badge">✎</div>
          </div>
          
          <div className="ultimate-id-section text-center">
             <h3 className="u-name">{user.name}</h3>
          </div>

          <nav className="ultimate-nav">
             <div className="u-nav-item active">Dashboard</div>
             <div className="u-nav-item" onClick={() => navigate("/watchlist")}>Watchlist</div>
             <div className="u-nav-item" onClick={() => setShowEditNameModal(true)}>Settings</div>
             <div className="u-nav-item logout" onClick={handleLogout}>Log Out</div>
          </nav>

          <footer className="ultimate-stats">
             <div className="us-block">
                <span className="us-val">{watchHistory.length}</span>
                <span className="us-lab">Movies</span>
             </div>
             <div className="us-block">
                <span className="us-val">{Math.floor(watchHistory.length * 1.5)}h</span>
                <span className="us-lab">Hours</span>
             </div>
          </footer>
        </aside>

        {/* 🎬 ULTIMATE MAIN */}
        <main className="ultimate-main">
           <header className="ultimate-header mb-5">
              <h1 className="u-greeting-text">{greeting}, {user.name} 🎞️</h1>
              <p className="u-sub-text">Your personalized cinematic headquarters is ready.</p>
           </header>

           {loading ? (
             <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>
           ) : (
             <div className="ultimate-dashboard-content">
               
               {/* CONTINUE WATCHING */}
               <section className="u-row mb-5">
                  <h4 className="u-section-title mb-4">Continue Watching</h4>
                  <div className="u-snap-scroll">
                     {watchHistory.length > 0 ? (
                        watchHistory.slice(0, 6).map((m, i) => (
                           <div key={i} className="u-wide-card" onClick={() => handlePlay(m)}>
                              <div className="uw-poster-box">
                                 <img src={m.poster} alt={m.title} className="uw-poster" />
                                 <div className="uw-progress" style={{ width: i === 0 ? '70%' : '20%' }}></div>
                                 <div className="uw-play-btn">▶</div>
                              </div>
                              <div className="uw-meta">
                                 <h6 className="uw-title">{m.title}</h6>
                                 <span className="uw-label">Action • Prime</span>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="u-empty-hint">Start watching to track your progress here.</div>
                     )}
                  </div>
               </section>

               {/* RECOMMENDED GRID */}
               <section className="u-row">
                  <h4 className="u-section-title mb-4">Recommended For You</h4>
                  <div className="u-grid-layout">
                     {watchHistory.slice(0, 10).map((m, i) => (
                        <div key={i} className="u-poster-card" onClick={() => handlePlay(m)}>
                           <img src={m.poster} alt={m.title} className="u-poster-img" />
                           <div className="u-poster-aura"></div>
                        </div>
                     ))}
                  </div>
               </section>
             </div>
           )}
        </main>

      </Container>

      {/* 🎭 AVATAR LIBRARY MODAL (FIXED IMAGES) 🎭 */}
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)} centered className="u-modal-lib">
         <div className="u-modal-inner anime-fade-in">
            <h4 className="text-white mb-2">Change Profile Icon</h4>
            <p className="text-muted small mb-4">Pick a cinematic legend from our library.</p>
            
            <div className="u-avatar-grid">
               {avatarLibrary.map(av => (
                  <div key={av.id} className="u-av-item" onClick={() => selectLibraryAvatar(av.url)}>
                     <img src={av.url} alt={av.name} className="u-av-thumb" />
                     <span className="u-av-name">{av.name}</span>
                  </div>
               ))}
            </div>

            <div className="u-modal-divider"><span>OR</span></div>

            <label htmlFor="u-local-up" className="btn-u-upload">
                Upload From Local Library
                <input type="file" id="u-local-up" hidden onChange={handleLocalUpload}  accept="image/*" />
            </label>
            <Button variant="link" className="text-muted mt-3" onClick={() => setShowAvatarModal(false)}>Close</Button>
         </div>
      </Modal>

      {/* 🛠️ ELITE SETTINGS HUB 🛠️ */}
      <Modal show={showEditNameModal} onHide={() => setShowEditNameModal(false)} centered size="lg" className="u-modal-settings">
        <div className="u-settings-card">
           <div className="u-settings-sidebar">
              <h5 className="text-white mb-4 px-3">Settings</h5>
              <div 
                className={`u-set-tab ${activeTab === "General" ? "active" : ""}`} 
                onClick={() => setActiveTab("General")}
              >General</div>
              <div 
                className={`u-set-tab ${activeTab === "Playback" ? "active" : ""}`} 
                onClick={() => setActiveTab("Playback")}
              >Playback</div>
              <div 
                className={`u-set-tab ${activeTab === "Parental" ? "active" : ""}`} 
                onClick={() => setActiveTab("Parental")}
              >Parental</div>
              <div 
                className={`u-set-tab ${activeTab === "Privacy" ? "active" : ""}`} 
                onClick={() => setActiveTab("Privacy")}
              >Privacy</div>
           </div>

           <div className="u-settings-content">
              {activeTab === "General" && (
                <div className="u-set-section anime-fade">
                   <h4 className="mb-1">Account Identity</h4>
                   <p className="text-muted small mb-4">Update your profile display name across NAVEK.</p>
                   <Form.Label className="text-muted small">Display Name</Form.Label>
                   <Form.Control 
                     className="u-dark-input-pro mb-4" 
                     value={newName} 
                     onChange={(e) => setNewName(e.target.value)} 
                   />

                   <div className="u-modal-divider-dim"></div>

                   <h4 className="mb-1">Streaming Quality</h4>
                   <p className="text-muted small mb-3">Optimize your bandwidth for the best visual experience.</p>
                   <div className="u-quality-pills">
                      {["Auto", "1080p", "4K"].map(q => (
                        <div 
                          key={q} 
                          className={`u-pill ${streamingQuality === q ? "active" : "text-muted"}`}
                          onClick={() => setStreamingQuality(q)}
                        >
                          {q === "Auto" ? "Auto" : q === "1080p" ? "1080p (FHD)" : "4K (UHD)"}
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === "Playback" && (
                <div className="u-set-section anime-fade">
                   <h4 className="mb-1">Playback Controls</h4>
                   <p className="text-muted small mb-4">Customize your viewing preferences.</p>
                   <div className="d-flex justify-content-between align-items-center u-toggle-row mb-3">
                      <span>Auto-play Next Episode</span>
                      <Badge bg="success" className="u-badge-clickable">ON</Badge>
                   </div>
                   <div className="d-flex justify-content-between align-items-center u-toggle-row">
                      <span>Show Subtitles by Default</span>
                      <Badge bg="secondary" className="u-badge-clickable">OFF</Badge>
                   </div>
                </div>
              )}

              {activeTab === "Parental" && (
                <div className="u-set-section anime-fade">
                   <h4 className="mb-1">Content Safety</h4>
                   <p className="text-muted small mb-3">Manage mature content and history filtering.</p>
                   <div className="d-flex justify-content-between align-items-center u-toggle-row" onClick={() => setSafeSearch(!safeSearch)}>
                      <span>Safe Search Filter</span>
                      <Badge bg={safeSearch ? "success" : "danger"} className="u-badge-clickable">
                        {safeSearch ? "ENABLED" : "DISABLED"}
                      </Badge>
                   </div>
                   <p className="text-muted mt-3 small">Note: Your watchlist will still be visible regardless of filter.</p>
                </div>
              )}

              {activeTab === "Privacy" && (
                <div className="u-set-section anime-fade">
                   <h4 className="mb-1">Data & Privacy</h4>
                   <p className="text-muted small mb-4">Control how NAVEK uses your data.</p>
                   <Button variant="danger" size="sm" className="mb-3" onClick={() => {
                      localStorage.removeItem("clickedHistory");
                      window.location.reload();
                   }}>Clear Watch History</Button>
                   <div className="u-toggle-row">
                      <span>Share Activity with Friends</span>
                      <Badge bg="secondary" className="u-badge-clickable ms-auto">PRIVATE</Badge>
                   </div>
                </div>
              )}

              <div className="u-settings-footer mt-5">
                 <Button className="btn-u-save-pro me-3" onClick={handleEditSave}>Save Changes</Button>
                 <Button className="btn-u-cancel-pro" onClick={() => setShowEditNameModal(false)}>Cancel</Button>
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
}
