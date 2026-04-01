import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, SkipBack, SkipForward, Play, Pause, Volume2, 
  Maximize, Settings, Info, Globe, Activity, Gauge, Check, 
  ChevronRight, Volume1, VolumeX
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Controls = ({ 
  movie, isPlaying, togglePlay, currentTime, duration, 
  handleSeek, skip, volume, setVolume, 
  playbackSpeed, changeSpeed, 
  quality, setQuality, 
  language, setLanguage,
  toggleFullscreen, visible,
  playerType
}) => {

  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null); // 'main', 'audio', 'quality', 'speed'
  const menuRef = useRef(null);

  const formatTime = (time) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    handleSeek(percent * duration);
  };

  const toggleMenu = (menu, e) => {
    if (e) e.stopPropagation();
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`player-overlay ${visible || activeMenu ? "visible" : "hidden"}`}>
      {/* Top Bar */}
      <div className="player-top-bar" onClick={(e) => e.stopPropagation()}>
        <button className="back-btn" onClick={() => navigate(-1)} title="Back to Browsing">
          <ArrowLeft size={28} />
        </button>
        <div className="player-movie-info">
          <h2 className="p-title">{movie?.title}</h2>
          <div className="p-meta">
            <span className="p-year">{movie?.year || "2025"}</span>
          </div>
        </div>
      </div>

      {/* Settings Popups */}
      {activeMenu && (
        <div 
            className="premium-settings-popup" 
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <button className="p-back" onClick={() => setActiveMenu(activeMenu === 'main' ? null : 'main')}>
              <ArrowLeft size={20} />
            </button>
            <h3>{activeMenu.toUpperCase()} SETTINGS</h3>
          </div>
          <div className="popup-content">
            {activeMenu === 'main' && (
              <>
                {playerType === 'native' && (
                  <>
                    <button className="menu-item" onClick={() => setActiveMenu('audio')}>
                      <Globe size={24} />
                      <span>Audio & Subtitles <span>({language})</span></span>
                      <ChevronRight size={20} className="menu-arrow" />
                    </button>
                    <button className="menu-item" onClick={() => setActiveMenu('quality')}>
                      <Activity size={24} />
                      <span>Video Quality <span>({quality})</span></span>
                      <ChevronRight size={20} className="menu-arrow" />
                    </button>
                  </>
                )}
                <button className="menu-item" onClick={() => setActiveMenu('speed')}>
                  <Gauge size={24} />
                  <span>Playback Speed <span>({playbackSpeed}x)</span></span>
                  <ChevronRight size={20} className="menu-arrow" />
                </button>
              </>
            )}


            {activeMenu === 'audio' && (
              <div className="vertical-options">
                {(movie?.audioLanguages || [{ lang: "English" }]).map(a => (
                  <button 
                    key={a.lang} 
                    className={`option ${language === a.lang ? 'active' : ''}`} 
                    onClick={() => { setLanguage(a.lang); setActiveMenu(null); }}
                  >
                    {a.lang} {language === a.lang && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}

            {activeMenu === 'quality' && (
              <div className="vertical-options">
                {["1080p", "720p", "480p"].map(q => (
                  <button 
                    key={q} 
                    className={`option ${quality === q ? 'active' : ''}`} 
                    onClick={() => { setQuality(q); setActiveMenu(null); }}
                  >
                     {q} {quality === q && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}

            {activeMenu === 'speed' && (
              <div className="vertical-options">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                  <button 
                    key={s} 
                    className={`option ${playbackSpeed === s ? 'active' : ''}`} 
                    onClick={() => { changeSpeed(s); setActiveMenu(null); }}
                  >
                     {s}x {playbackSpeed === s && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Bar: Controls */}
      <div className="player-bottom-bar" onClick={(e) => e.stopPropagation()}>
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar-bg">
            <div 
                className="progress-bar-fill" 
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
                <div className="progress-knob"></div>
            </div>
          </div>
          <div className="timestamp-preview" style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}>
             {formatTime(currentTime)}
          </div>
        </div>

        <div className="controls-row">
          <div className="left-controls">
            <button className="c-btn-circle" onClick={() => skip(-10)} title="Back 10s"><SkipBack size={20} /></button>
            <button className="c-btn-main" onClick={togglePlay}>
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{marginLeft: '5px'}} />}
            </button>
            <button className="c-btn-circle" onClick={() => skip(10)} title="Forward 10s"><SkipForward size={20} /></button>
            
            <div className="vol-container">
              <button 
                className="c-btn-circle" 
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
              >
                {volume === 0 ? <VolumeX size={20} /> : volume > 0.5 ? <Volume2 size={20} /> : <Volume1 size={20} />}
              </button>
              <div className="vol-slider-wrap">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="vol-slider-range"
                  />
              </div>
            </div>
            
            <span className="time-display">{formatTime(currentTime)} <span className="time-sep">/</span> {formatTime(duration)}</span>
          </div>

          <div className="right-controls">
             <button className="c-btn-premium" onClick={(e) => toggleMenu('main', e)} title="Settings">
               <Settings size={24} className={activeMenu ? "rotating" : ""} />
             </button>
             <button className="c-btn-premium" title="Info"><Info size={24} /></button>
             <button className="c-btn-premium" onClick={toggleFullscreen} title="Full Screen"><Maximize size={24} /></button>
          </div>
        </div>
      </div>

      <div className="controls-shadow-top"></div>
      <div className="controls-shadow-bottom"></div>
      
      {/* SKIP INTRO feature removed */}
    </div>
  );
};

export default Controls;
