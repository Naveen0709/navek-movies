import React, { useRef, useState, useEffect, useCallback } from "react";
import Controls from "./Controls";
import "../../styles/player.css";

const VideoPlayer = ({ movie, onNext }) => {
  const videoRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState("720p");
  const [language, setLanguage] = useState(movie?.audioLanguages?.[0]?.lang || "English");
  const [isBuffering, setIsBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [playerType, setPlayerType] = useState("yt"); // 'native' or 'yt'
  const controlsTimeout = useRef(null);
  const progressInterval = useRef(null);

  const stopYTProgress = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
  }, []);

  const startYTProgress = useCallback(() => {
    stopYTProgress();
    progressInterval.current = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        setCurrentTime(ytPlayerRef.current.getCurrentTime());
      }
    }, 500);
  }, [stopYTProgress]);

  // 🛠️ Check Source Type on Mount/Movie Change
  useEffect(() => {
    const hasLocalSource = movie?.videoUrls?.["720p"] || movie?.videoUrls?.["480p"] || movie?.videoUrls?.["1080p"];
    if (hasLocalSource) {
      setPlayerType("native");
    } else {
      setPlayerType("yt");
    }
  }, [movie]);

  // 🎬 YouTube API Integration Logic
  useEffect(() => {
    if (playerType !== "yt") return;

    // Loading script if not present
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initYT = () => {
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
          ytPlayerRef.current.destroy();
      }

      ytPlayerRef.current = new window.YT.Player("yt-player-container", {
        videoId: movie?.trailerId || "fT-l6K7K44A", // Fallback trailer
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            setDuration(event.target.getDuration());
            event.target.setVolume(volume * 100);
            setIsBuffering(false);
            startYTProgress();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            else if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            else if (event.data === window.YT.PlayerState.BUFFERING) setIsBuffering(true);
            else { setIsBuffering(false); }

            if (event.data === window.YT.PlayerState.ENDED) {
              if (onNext) onNext();
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      window.onYouTubeIframeAPIReady = initYT;
    }

    return () => stopYTProgress();
  }, [movie, playerType, onNext, startYTProgress, stopYTProgress, volume]);

  const togglePlay = () => {
    if (playerType === "native" && videoRef.current) {
      if (videoRef.current.paused) videoRef.current.play();
      else videoRef.current.pause();
    } else if (playerType === "yt" && ytPlayerRef.current) {
      if (isPlaying) ytPlayerRef.current.pauseVideo();
      else ytPlayerRef.current.playVideo();
    }
  };

  const handleSeek = (time) => {
    if (playerType === "native" && videoRef.current) {
      videoRef.current.currentTime = time;
    } else if (playerType === "yt" && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(time, true);
    }
    setCurrentTime(time);
  };

  const skip = (amount) => {
    const newTime = Math.min(Math.max(0, currentTime + amount), duration);
    handleSeek(newTime);
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (playerType === "native" && videoRef.current) {
      videoRef.current.playbackRate = speed;
    } else if (playerType === "yt" && ytPlayerRef.current) {
      ytPlayerRef.current.setPlaybackRate(speed);
    }
  };

  const updateVolume = (val) => {
    setVolume(val);
    if (playerType === "native" && videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) videoRef.current.muted = true;
      else videoRef.current.muted = false;
    } else if (playerType === "yt" && ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      if (val === 0) {
        if (ytPlayerRef.current.mute) ytPlayerRef.current.mute();
      } else {
        if (ytPlayerRef.current.unMute) ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(val * 100);
      }
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector(".netflix-player-container");
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      className="netflix-player-container" 
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
    >
      <div className="video-wrapper">
        {playerType === "native" ? (
          <video
            ref={videoRef}
            className="main-video-element"
            src={`https://navek-movies-xu0e.onrender.com/api/movies/${movie?._id}/stream?quality=${quality}`}
            onTimeUpdate={() => setCurrentTime(videoRef.current.currentTime)}
            onLoadedMetadata={() => setDuration(videoRef.current.duration)}
            onPlaying={() => setIsBuffering(false)}
            onWaiting={() => setIsBuffering(true)}
            onEnded={onNext}
            autoPlay
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <div id="yt-player-container" style={{ width: "100%", height: "120%", marginTop: "-5%" }}></div>
        )}
      </div>

      {isBuffering && (
        <div className="player-loader">
          <div className="spinner"></div>
        </div>
      )}

      <Controls
        movie={movie}
        isPlaying={isPlaying}
        togglePlay={(e) => { e.stopPropagation(); togglePlay(); }}
        currentTime={currentTime}
        duration={duration}
        handleSeek={handleSeek}
        skip={skip}
        volume={volume}
        setVolume={updateVolume}
        playbackSpeed={playbackSpeed}
        changeSpeed={changeSpeed}
        quality={quality}
        setQuality={setQuality}
        language={language}
        setLanguage={setLanguage}
        toggleFullscreen={toggleFullscreen}
        visible={showControls}
        playerType={playerType}
      />
    </div>
  );
};

export default VideoPlayer;

