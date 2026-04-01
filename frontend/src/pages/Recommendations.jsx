import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import "../styles/recommendations.css";
import { getMovies } from "../services/movieService";
import {
  slider1, slider2, slider3, slider4, slider5, slider6,
  slider7, slider8, slider9, slider10, slider11, slider12,
  slider13, slider14, slider15, slider16
} from "../data/movieData";
import {
  CloudRain, Flame, Heart, Laugh, Ghost, Brain, Sun, Coffee, Lightbulb, Crown, Music, Sparkles, Armchair, Eye, Crosshair, Compass, MapPin, Wind, GraduationCap, Utensils, Waves, Plane, Home as HomeIcon
} from "lucide-react";

const genres = [
  { title: "🇮🇳 Indian Movies", key: "Indian" },
  { title: "🇰🇷 Korean Movies", key: "Korean" },
  { title: "🔥 Action Movies", key: "Action" },
  { title: "👻 Horror Movies", key: "Horror" },
  { title: "😂 Comedy Movies", key: "Comedy" },
  { title: "🦸 Superhero Movies", key: "Superhero" },
  { title: "🚀 Sci-Fi Movies", key: "Sci-Fi" },
  { title: "❤️ Love Movies", key: "Romance" },
  { title: "🍥 Anime Movies", key: "Anime" },
  { title: "🧒 Kids Movies", key: "Kids" },
  { title: "😄 Happy Movies", key: "Comedy" },
  { title: "😢 Sad Movies", key: "Drama" },
  { title: "🔥 Motivational Movies", key: "Motivational" },
  { title: "✨ Wholesome Movies", key: "Wholesome" },
  { title: "🔞 R Rated Movies", key: "Thriller" },
  { title: "🕵️ Mystery & Thriller", key: "Mystery" },
  { title: "🎬 Tamil Movies", key: "", lang: "ta" },
  { title: "🎬 English Movies", key: "", lang: "en" },
  { title: "🎬 Korean Movies", key: "", lang: "ko" },
  { title: "🎬 Japanese Movies", key: "", lang: "ja" },
  { title: "🎬 Hindi Movies", key: "", lang: "hi" },
  { title: "🎬 Telugu Movies", key: "", lang: "te" }
];

const emotionsList = [
  { id: "sad", name: "Sad", Icon: CloudRain, color: "#0088ff", genres: ["Drama", "Inspirational"] },
  { id: "motivated", name: "Motivated", Icon: Flame, color: "#ff5500", genres: ["Sport", "Biography"] },
  { id: "romantic", name: "Romantic", Icon: Heart, color: "#ff007f", genres: ["Romance"] },
  { id: "funny", name: "Funny", Icon: Laugh, color: "#00ffd5", genres: ["Comedy"] },
  { id: "scared", name: "Scared", Icon: Ghost, color: "#a200ff", genres: ["Horror", "Thriller"] },
  { id: "mindblown", name: "Mind-Blown", Icon: Brain, color: "#00d2ff", genres: ["Science Fiction", "Mystery", "Sci-Fi"] },
  { id: "feelgood", name: "Feel Good", Icon: Sun, color: "#ff66b2", genres: ["Family", "Drama"] },
  { id: "relaxed", name: "Relaxed", Icon: Coffee, color: "#4dff4d", genres: ["Comedy", "Slice of Life"] },
  { id: "thoughtful", name: "Thoughtful", Icon: Lightbulb, color: "#a52a2a", genres: ["Drama", "Philosophy"] },
  { id: "confident", name: "Confident", Icon: Crown, color: "#ffd700", genres: ["Action", "Adventure"] },
  { id: "partymood", name: "Party Mood", Icon: Music, color: "#ff1493", genres: ["Music", "Comedy"] },
  { id: "lazy", name: "Lazy", Icon: Armchair, color: "#8a2be2", genres: ["Comedy"] },
  { id: "mysterymood", name: "Mystery Mood", Icon: Eye, color: "#808080", genres: ["Thriller", "Crime"] },
  { id: "revenge", name: "Revenge Mood", Icon: Crosshair, color: "#b22222", genres: ["Action", "Thriller"] },
  { id: "adventure", name: "Adventure Mood", Icon: Compass, color: "#228b22", genres: ["Adventure", "Fantasy"] }
];

const emotionMap = {};
emotionsList.forEach(e => {
  emotionMap[e.id] = e.genres;
});

export default function Recommendations() {
  const navigate = useNavigate();
  const [extraMovies, setExtraMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [activeMood, setActiveMood] = useState("");
  const [sliderData, setSliderData] = useState({});
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist")) || []
  );

  // 🤖 Cinematic AI Engine State
  const [allMovies, setAllMovies] = useState([]);
  const [cinematicAI, setCinematicAI] = useState({
    location: "Analyzing...",
    time: "Day",
    weather: "Clear",
    detectedState: "Connecting to NAVEK sensors...",
  });
  const [cinematicMovies, setCinematicMovies] = useState(null); 
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [fusionBasis, setFusionBasis] = useState("fusion"); 
  const ai_ref = useRef(null); 

  // 🔋 Battery-Based Logic State
  const [battery, setBattery] = useState({ level: 100, charging: false });
  const [batteryMovies, setBatteryMovies] = useState([]);
  const br_ref = useRef(null); 


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [extraRes, ...genreRes] = await Promise.all([
          getMovies(500),
          ...genres.map(g => getMovies(300, g.key, g.lang || ""))
        ]);

        const filterValid = (list, isFamilyStrict = false) => {
          return list.filter(m => {
            const hasPoster = m.poster && !m.poster.includes("null") && !m.poster.includes("undefined");

            // 🚫 Global Restriction: Remove Adult / 18+ / Erotic / Porn B-movies across ALL sliders
            const genreLower = (m.genre || "").toLowerCase();
            const titleLower = (m.title || "").toLowerCase();
            const descLower = (m.description || "").toLowerCase();

            const isExplicitGenre = genreLower.includes("18+") || genreLower.includes("erotic") || genreLower.includes("adult") || genreLower.includes("sex");

            // Korean and general 18+ B-Movie title patterns to block
            const isAdultTitle = titleLower.includes("sister-in-law") ||
              titleLower.includes("mother-in-law") ||
              titleLower.includes("stepmother") ||
              titleLower.includes("stepsister") ||
              titleLower.includes("affair") ||
              titleLower.includes("young mother") ||
              titleLower.includes("mom's friend") ||
              titleLower.includes("mother's friend") ||
              titleLower.includes("wife's friend") ||
              titleLower.includes("boarding house") ||
              titleLower.includes("tutor") ||
              titleLower.includes("hole-in-law") ||
              titleLower.includes("big breasted") ||
              titleLower.includes("sange") ||
              titleLower.includes("18+") ||
              titleLower.includes("nude") ||
              titleLower.includes("erotic") ||
              (titleLower.includes("son's") && titleLower.includes("girlfriend")) ||
              descLower.includes("erotica") ||
              descLower.includes("sensual") ||
              descLower.includes("sexually") ||
              descLower.includes("steamy") ||
              descLower.includes("threesome") ||
              descLower.includes("naked") ||
              descLower.includes("strip") ||
              descLower.includes("prostitute");

            if (isExplicitGenre || isAdultTitle) return false;

            // 🛑 Strict Family Filter: For Wholesome/Kids/Korean/Motivational sliders
            if (isFamilyStrict) {
              const isScary = genreLower.includes("r-rated") || genreLower.includes("thriller") || genreLower.includes("horror");
              if (isScary) return false;
            }

            return hasPoster;
          });
        };

        setExtraMovies(filterValid(extraRes.data));

        const newData = {};
        genres.forEach((g, idx) => {
          const isFamily = ["Korean", "Motivational", "Wholesome", "Kids"].includes(g.key);
          let filtered = filterValid(genreRes[idx].data, isFamily);

          // 🇮🇳 South Indian Focus: Sort or filter here if needed,
          // but the new seed script already prioritized Tamil/Telugu/Malayalam/Kannada
          newData[g.title] = filtered;
        });
        setSliderData(newData);

        // Populate allMovies state
        const raw = [
          ...slider1, ...slider2, ...slider3, ...slider4, ...slider5, ...slider6,
          ...slider7, ...slider8, ...slider9, ...slider10, ...slider11, ...slider12,
          ...slider13, ...slider14, ...slider15, ...slider16, ...filterValid(extraRes.data)
        ];

        const filteredAllMovies = raw.filter(m => {
          const genreLower = (m.genre || "").toLowerCase();
          const titleLower = (m.title || "").toLowerCase();
          const descLower = (m.description || "").toLowerCase();

          const isExplicitGenre = genreLower.includes("18+") || genreLower.includes("erotic") || genreLower.includes("adult") || genreLower.includes("sex");

          const isAdultTitle = titleLower.includes("sister-in-law") ||
            titleLower.includes("mother-in-law") ||
            titleLower.includes("stepmother") ||
            titleLower.includes("stepsister") ||
            titleLower.includes("affair") ||
            titleLower.includes("young mother") ||
            titleLower.includes("mom's friend") ||
            titleLower.includes("mother's friend") ||
            titleLower.includes("wife's friend") ||
            titleLower.includes("boarding house") ||
            titleLower.includes("tutor") ||
            (titleLower.includes("son's") && titleLower.includes("girlfriend")) ||
            descLower.includes("erotica") ||
            descLower.includes("sensual") ||
            descLower.includes("sexually") ||
            descLower.includes("steamy");

          return !isExplicitGenre && !isAdultTitle && m.poster && !m.poster.includes("null");
        });
        setAllMovies(filteredAllMovies);

      } catch (err) {
        console.error("Failed to fetch movies", err);
      }
    };
    fetchAll();
  }, []);

  // 🎬 Streaming Logic 
  const handlePlay = (movie) => {
    // Navigate to Premium Streaming Player Page
    navigate(`/watch/${movie._id || 'local'}`, { state: { movie } });

    // Tracking Click History
    let history = JSON.parse(localStorage.getItem("clickedHistory")) || [];
    if (!history.find(m => m.title === movie.title)) {
      history.push(movie);
      if (history.length > 50) history.shift();
      localStorage.setItem("clickedHistory", JSON.stringify(history));
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

  // refs
  const r0 = useRef(null);
  const r1 = useRef(null);
  const r2 = useRef(null);
  const r3 = useRef(null);
  const r4 = useRef(null);
  const r5 = useRef(null);
  const r6 = useRef(null);
  const r7 = useRef(null);
  const r8 = useRef(null);
  const r9 = useRef(null);
  const r10 = useRef(null);
  const r11 = useRef(null);
  const r12 = useRef(null);
  const r13 = useRef(null);
  const r14 = useRef(null);
  const r15 = useRef(null);
  const r16 = useRef(null);
  const r17 = useRef(null);
  const r18 = useRef(null);
  const r19 = useRef(null);
  const r20 = useRef(null);
  const r21 = useRef(null);
  const r22 = useRef(null);
  const r23 = useRef(null);
  const rh = useRef(null); // Hybrid Ref

  // =========================
  // 🔄 AUTO-SCROLL ENGINE (Netflix Style)
  // =========================
  /*
  useEffect(() => {
    const allRefs = [r0, rh, r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23];

    const interval = setInterval(() => {
      allRefs.forEach(ref => {
        if (ref.current && !query.trim()) {
          const { scrollLeft, scrollWidth, clientWidth } = ref.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            ref.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            ref.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        }
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [query]);
  */
  const fetchCinematicMovies = useCallback(async (context, basis = "fusion") => {
    if (!allMovies || allMovies.length === 0) return;
    setIsAiLoading(true);
    setFusionBasis(basis);
    try {
      let keywords = ["Drama"];
      const { weather, time, location } = context;

      // 1. Precise Category Mapping based on User Request
      if (basis === "location") {
        if (location === "College") keywords = ["Motivational", "Study", "Inspirational", "Thoughtful", "School", "Education"];
        else if (location === "Social Spot") keywords = ["Food", "Chef", "Cooking", "Restaurant", "Gourmet", "Dining"];
        else if (location === "Beach") keywords = ["Beach", "Summer", "Holiday", "Island", "Ocean", "Waves"];
        else if (location === "Travel") keywords = ["Vacation", "Travel", "Adventure", "Road Trip", "Explore", "Journey"];
        else if (location === "Home") keywords = ["Action", "Comedy", "Drama", "Family", "Relaxing"];
        else keywords = ["Drama", "Comedy"];
      } else if (basis === "atmosphere") {
        if (weather === "Rainy" || time === "Night") keywords = ["Romance", "Mystery", "Noir", "Thriller", "Deep"];
        else if (weather === "Sunny") keywords = ["Comedy", "Fun", "Adventure", "Feel Good", "Bright"];
        else if (weather === "Stormy") keywords = ["Thriller", "Horror", "Action", "Suspense", "Dark"];
        else keywords = ["Drama", "Comedy", "Peaceful"];
      } else {
        // FUSION MODE (Logical combinations)
        if (location === "College") keywords = ["Motivational", "Inspirational", "School"];
        else if (location === "Social Spot") keywords = ["Food", "Chef", "Restaurant"];
        else if (location === "Beach") keywords = ["Summer", "Holiday", "Beach"];
        else if (location === "Travel") keywords = ["Adventure", "Vacation", "Travel"];
        else if (weather === "Rainy") keywords = ["Romance", "Melancholy", "Drama"];
        else if (time === "Night") keywords = ["Thriller", "Action", "Mystery"];
        else keywords = ["Drama", "Comedy"];
      }

      // 2. Initial Fetch from Backend
      const movieRes = await getMovies(200, keywords[0]);

      // 3. Robust Multi-Keyword Filter from Local allMovies pool
      const filtered = allMovies.filter(m => {
        const text = `${m.genre || ""} ${m.title || ""} ${m.description || ""}`.toLowerCase();
        return keywords.some(k => text.includes(k.toLowerCase()));
      });

      let results = [...(movieRes.data || []), ...filtered];
      if (results.length < 5) results = allMovies.sort(() => 0.5 - Math.random()).slice(0, 20);

      const unique = Array.from(new Map(results.map(m => [m.title, m])).values());
      setCinematicMovies(unique.sort(() => 0.5 - Math.random()).slice(0, 120));
    } catch (e) {
      console.error("Fusion Logic Error", e);
      setCinematicMovies(allMovies.slice(0, 15));
    } finally {
      setIsAiLoading(false);
    }
  }, [allMovies]);

  // Expose to window for external/legacy access if needed, but we use direct calls in JSX
  useEffect(() => {
    window.refreshFusionBasis = (basis) => fetchCinematicMovies(cinematicAI, basis);
  }, [fetchCinematicMovies, cinematicAI]);


  // =========================
  // 🤖 NAVEK FUSION ENGINE
  // (Environment Detection)
  // =========================
  useEffect(() => {
    if (allMovies.length === 0) return;

    const getDetailedTime = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) return "Morning";
      if (hour >= 11 && hour < 17) return "Afternoon";
      return "Night";
    };

    const getCinematicStateText = (l, t, w) => {
      if (t === "Night" && w.includes("Rain")) return `A deep, immersive internal voyage through the rainy night.`;
      if (l === "College") return `Growth and learning vibes in your current academic environment.`;
      if (l === "Social Spot") return `Gourmet cinematic picks curated for your current dining atmosphere.`;
      if (l === "Beach") return `Summer heat and holiday vibes detected! Enjoy the sun.`;
      if (l === "Travel") return `Adventure awaits! Fast-paced recommendations for your journey.`;
      return `A ${w.toLowerCase()} ${t.toLowerCase()} atmosphere at ${l} specifically curated for NAVEK.`;
    };

    const detectContext = async () => {
      const time = getDetailedTime();
      let weather = "Clear";

      try {
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current_weather=true`);
        const wData = await wRes.json();
        const code = wData.current_weather.weathercode;
        if (code >= 61) weather = "Rainy";
        else if (code >= 1 && code <= 3) weather = "Cloudy";
        else if ([95, 96, 99].includes(code)) weather = "Stormy";
        else if (code === 0) weather = "Sunny";
      } catch (e) { console.warn("Weather Fail"); }

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          let locType = "Home";

          try {
            const gRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
            const gData = await gRes.json();
            const addr = gData.address || {};
            const display = (gData.display_name || "").toLowerCase();
            const typeValue = (gData.type || gData.category || gData.addresstype || "").toLowerCase();
            const combined = `${Object.values(addr).join(" ")} ${display} ${typeValue}`.toLowerCase();

            const academic = ["college", "university", "school", "library", "campus", "academy", "institute"];
            const social = ["restaurant", "cafe", "bistro", "food", "hotel", "canteen", "dining"];
            const beach = ["beach", "coast", "ocean", "sea", "shore", "island"];
            const travelSymbols = ["airport", "station", "terminal", "highway", "travel", "railway", "train", "bus"];

            if (academic.some(v => combined.includes(v))) locType = "College";
            else if (social.some(v => combined.includes(v))) locType = "Social Spot";
            else if (beach.some(v => combined.includes(v))) locType = "Beach";
            else if (travelSymbols.some(v => combined.includes(v))) locType = "Travel";
          } catch (e) { console.warn("Geo Fail"); }

          const final = { location: locType, time, weather, detectedState: getCinematicStateText(locType, time, weather) };
          setCinematicAI(final);
          fetchCinematicMovies(final);
        }, (err) => {
          const final = { location: "Home", time, weather, detectedState: getCinematicStateText("Home", time, weather) };
          setCinematicAI(final);
          fetchCinematicMovies(final);
        });
      }
    };
    detectContext();
  }, [allMovies, fetchCinematicMovies]);


  // =========================
  // 🔋 BATTERY DETECTION ENGINE
  // =========================
  useEffect(() => {
    const parseRuntime = (rt) => {
      if (!rt) return 120;
      const h = rt.match(/(\d+)h/);
      const m = rt.match(/(\d+)m/);
      let total = 0;
      if (h) total += parseInt(h[1]) * 60;
      if (m) total += parseInt(m[1]);
      return total;
    };

    const updateBatteryMovies = (level, charging) => {
      let minLen = 0;
      let maxLen = 300;
      let msg = "";

      if (charging) {
        msg = "Charging detected. Enjoy any movie without restriction!";
      } else if (level < 20) {
        minLen = 60; maxLen = 90;
        msg = "Low battery detected. Here are some short movies you can finish quickly.";
      } else if (level >= 20 && level < 50) {
        minLen = 90; maxLen = 120;
        msg = "Medium battery. Perfect for these mid-length features.";
      } else if (level >= 50 && level < 80) {
        minLen = 120; maxLen = 150;
        msg = "Good battery level. Enjoy a regular length movie.";
      } else {
        minLen = 150; maxLen = 300;
        msg = "Your battery is strong. Ideal for epic cinematic journeys!";
      }

      setBattery({ level, charging, message: msg });

      const filtered = allMovies.filter(m => {
        const time = parseRuntime(m.runtime);
        return charging ? true : (time >= minLen && time <= maxLen);
      });

      setBatteryMovies(filtered.sort(() => 0.5 - Math.random()).slice(0, 15));
    };

    if ('getBattery' in navigator) {
      navigator.getBattery().then(bat => {
        updateBatteryMovies(Math.round(bat.level * 100), bat.charging);

        bat.addEventListener('levelchange', () => {
          updateBatteryMovies(Math.round(bat.level * 100), bat.charging);
        });
        bat.addEventListener('chargingchange', () => {
          updateBatteryMovies(Math.round(bat.level * 100), bat.charging);
        });
      });
    } else {
      // Fallback for unsupported browsers
      updateBatteryMovies(85, false);
    }
  }, [allMovies]);

  // =========================
  // 🎬 SLIDER DATA (14)
  // =========================
  // Movie data is now imported from ../data/movieData for cleaner architecture

  // ==========================================
  // 🧠 HYBRID RECOMMENDATION ENGINE
  // (Search-based + Content-based + Popularity)
  // ==========================================
  const hybridPicks = useMemo(() => {
    if (allMovies.length === 0) return [];

    const clickedHistory = JSON.parse(localStorage.getItem("clickedHistory")) || [];

    // 1. Get user preferences from watchlist & clicks
    if (watchlist.length === 0 && clickedHistory.length === 0) {
      // COLD START: Return Top Rated movies
      return [...allMovies]
        .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        .slice(0, 20);
    }

    // CONTENT-BASED: Analyze favorite genres
    const genreCounts = {};
    const combinedHistory = [...watchlist, ...clickedHistory];

    const uniqueHistory = combinedHistory.reduce((acc, current) => {
      const x = acc.find(item => item.title === current.title);
      if (!x) return acc.concat([current]);
      else return acc;
    }, []);

    uniqueHistory.forEach(m => {
      const movieGenres = m.genre?.split(", ") || [];
      movieGenres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    // Sort genres by frequency
    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([g]) => g)
      .slice(0, 3);

    // Filter movies that match top genres
    let recommended = allMovies.filter(m => {
      // Don't recommend what's already in watchlist
      if (watchlist.some(w => w.title === m.title)) return false;

      const mGenres = m.genre?.split(", ") || [];
      return topGenres.some(tg => mGenres.includes(tg));
    });

    // HYBRID STEP: Combine with top rated global movies & shuffle
    recommended = recommended
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 30);

    // Shuffle for variety
    return recommended.sort(() => 0.5 - Math.random());

  }, [allMovies, watchlist]);

  // 🎭 EMOTION SEARCH (Derived from global emotionMap)

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    // 1️⃣ Priority: Match by Mood Emojis (Emotion Map)
    if (emotionMap[q]) {
      const targetGenres = emotionMap[q];
      const moodFiltered = allMovies.filter(m =>
        (m.genre && targetGenres.some(tg => m.genre.toLowerCase().includes(tg.toLowerCase()))) ||
        (m.genre && m.genre.toLowerCase().includes(q)) ||
        (m.mood && m.mood.toLowerCase() === q)
      );
      return moodFiltered.sort(() => 0.5 - Math.random());
    }

    // 2️⃣ Professional Deep Search: Title, Genre, Language, Cast, Director
    const deepSearchFiltered = allMovies.filter((m) => {
      const matchTitle = m.title?.toLowerCase().includes(q);
      const matchGenre = m.genre?.toLowerCase().includes(q);
      const matchLang = m.language?.toLowerCase().includes(q);
      const matchCast = m.cast?.toLowerCase().includes(q);
      const matchDirector = m.director?.toLowerCase().includes(q);

      return matchTitle || matchGenre || matchLang || matchCast || matchDirector;
    });

    return deepSearchFiltered.sort(() => 0.5 - Math.random());
  }, [query, allMovies]);

  const clearSearch = () => {
    setQuery("");
    setActiveMood("");
  };

  // =========================
  // 🎬 SLIDER HELPERS
  // =========================
  const scrollLeft = (ref) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: -700, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: 700, behavior: "smooth" });
  };

  const renderSlider = (title, data, ref) => {
    return (
      <div className="rec-section">
        <div className="rec-head">
          <h3 className="rec-title">{title}</h3>
          <div className="slider-controls">
            <button className="slider-arrow" onClick={() => scrollLeft(ref)}>
              ‹
            </button>
            <button className="slider-arrow" onClick={() => scrollRight(ref)}>
              ›
            </button>
          </div>
        </div>

        <div className="rec-row-wrapper">
          <div className="rec-row" ref={ref}>
            {data.map((m, idx) => (
              <div key={idx} className="rec-card">
                <div className="rec-poster-container" onClick={() => handlePlay(m)}>
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="rec-poster"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                    }}
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
                </div>
                <div className="rec-info">
                  <div className="rec-meta">
                    <span className="rec-rating">⭐ {m.rating || "8.5"}</span>
                    <span className="rec-year">{m.year || "2024"}</span>
                    <span className="rec-duration">{m.runtime || "2h 15m"}</span>
                  </div>
                  <h5>{m.title}</h5>
                  <p className="rec-genre">{m.genre}</p>
                  <p className="rec-desc">{m.description || "A breathtaking cinematic experience that pushes the boundaries of storytelling."}</p>
                  <div className="rec-actions">
                    <button
                      className="play-btn-mini"
                      title="Play"
                      onClick={() => handlePlay(m)}
                    >
                      ▶ Play
                    </button>
                    <button
                      className="watch-btn"
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
        </div>
      </div>
    );
  };

  // =========================
  // ✅ UI
  // =========================
  return (
    <div className={`rec-page mood-${activeMood}`}>
      <Container className="py-4">
        {/* Cinematic Header Section */}
        <div className="rec-header-section">

          <div className="search-container">
            <span className="search-icon">🔍</span>
            <Form.Control
              type="text"
              placeholder="Search movies, genres, or mood..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>




        {/* Mood Emoji Row */}
        <div className="mood-row">
          {emotionsList.map((emotion) => (
            <div
              key={emotion.id}
              className={`mood-btn ${activeMood === emotion.id ? "active" : ""}`}
              onClick={() => {
                setActiveMood(emotion.id);
                setQuery(emotion.id);
              }}
              style={{
                "--mood-color": emotion.color,
                borderColor: activeMood === emotion.id ? emotion.color : ""
              }}
            >
              <div className="mood-icon-wrapper">
                <emotion.Icon
                  size={32}
                  strokeWidth={2.5}
                  color={emotion.color}
                  className={`lucide-icon ${activeMood === emotion.id ? 'active-icon' : ''}`}
                  style={{
                    filter: activeMood === emotion.id ? `drop-shadow(0 0 12px ${emotion.color}) brightness(1.2)` : `drop-shadow(0 0 4px ${emotion.color}) brightness(0.9)`,
                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                />
                <div
                  className="glow-effect"
                  style={{ background: emotion.color }}
                ></div>
              </div>
              <p style={{ color: activeMood === emotion.id ? "#fff" : "rgba(255, 255, 255, 0.5)" }}>
                {emotion.name}
              </p>
            </div>
          ))}
        </div>

        {/* Search Results */}
        {query.trim() && (
          <div className="rec-section">
            <div className="search-header">
              <h3 className="rec-title">
                {activeMood ? `Recommended for: ${activeMood.toUpperCase()}` : "Search Results"}
              </h3>
              <button className="clear-search-btn" onClick={clearSearch}>Back to Sliders ✕</button>
            </div>

            <div className="rec-row results-grid">
              {searchResults.length === 0 ? (
                <p className="no-results">No movies found 😢</p>
              ) : (
                searchResults.map((m, idx) => (
                  <div key={idx} className="rec-card">
                    <div className="rec-poster-container" onClick={() => handlePlay(m)}>
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="rec-poster"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x450?text=No+Poster";
                        }}
                      />
                      <button
                        className="play-overlay-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(m);
                        }}
                      >
                        ▶
                      </button>
                    </div>
                    <div className="rec-info">
                      <h5>{m.title}</h5>
                      <p>{m.genre}</p>
                      <div className="rec-actions">
                        <button
                          className="play-btn-mini"
                          onClick={() => handlePlay(m)}
                        >
                          ▶ Play
                        </button>
                        <button
                          className="watch-btn"
                          onClick={() => toggleWatchlist(m)}
                        >
                          {watchlist.find((x) => x.title === m.title) ? "✔" : "+"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Dynamic Sliders */}
        {!query.trim() && (
          <>
            {/* 🤖 NAVEK FUSION ENGINE - UPGRADED UI */}
            <div className={`ai-fusion-section ${isAiLoading ? 'ai-loading' : ''}`}>
              <div className="fusion-dashboard-bar">
                <div className="fusion-header-compact">
                  <div className="fusion-pill">
                    <Sparkles className="ai-spark-icon-mini" />
                    <span>REAL-WORLD CONTEXT FUSION</span>
                  </div>
                  <div className="ai-scanner-line-mini"></div>
                </div>

                <div className="fusion-sensors-grid">
                  <div
                    className={`sensor-pill ${isAiLoading ? 'loading-pulse' : ''} ${fusionBasis === 'location' ? 'active-fusion-basis' : ''}`}
                    onClick={() => fetchCinematicMovies(cinematicAI, 'location')}
                    title="Filter by Location context"
                  >
                    <div className="sensor-icon location-glow">
                      {cinematicAI.location === 'College' && <GraduationCap size={18} />}
                      {cinematicAI.location === 'Social Spot' && <Utensils size={18} />}
                      {cinematicAI.location === 'Beach' && <Waves size={18} />}
                      {cinematicAI.location === 'Travel' && <Plane size={18} />}
                      {cinematicAI.location === 'Home' && <HomeIcon size={18} />}
                      {(!['College', 'Social Spot', 'Beach', 'Travel', 'Home'].includes(cinematicAI.location) || isAiLoading) && <MapPin size={18} />}
                    </div>
                    <div className="sensor-text">
                      <label>LOCATION</label>
                      <span>{isAiLoading ? "SCANNING..." : cinematicAI.location.toUpperCase()}</span>
                    </div>
                    {fusionBasis === 'location' && <div className="sensor-active-dot"></div>}
                  </div>

                  <div
                    className={`sensor-pill ${isAiLoading ? 'loading-pulse' : ''} ${fusionBasis === 'atmosphere' ? 'active-fusion-basis' : ''}`}
                    onClick={() => fetchCinematicMovies(cinematicAI, 'atmosphere')}
                    title="Filter by Atmospheric context"
                  >
                    <div className="sensor-icon atmosphere-glow">
                      <Wind size={18} />
                    </div>
                    <div className="sensor-text">
                      <label>ATMOSPHERE</label>
                      <span>{isAiLoading ? "SYNCING..." : `${cinematicAI.weather.toUpperCase()} ${cinematicAI.time.toUpperCase()}`}</span>
                    </div>
                    {fusionBasis === 'atmosphere' && <div className="sensor-active-dot"></div>}
                  </div>

                  <div
                    className={`fusion-status-box ${fusionBasis === 'fusion' ? 'active-fusion-basis-text' : ''}`}
                    onClick={() => fetchCinematicMovies(cinematicAI, 'fusion')}
                    style={{ cursor: 'pointer' }}
                    title="Reset to Full Context Fusion"
                  >
                    <div className="status-label">FUSION STATUS</div>
                    <div className="status-message">
                      {isAiLoading ? "Calibrating Sensors..." : cinematicAI.detectedState}
                    </div>
                  </div>
                </div>
              </div>

              {cinematicMovies && cinematicMovies.length > 0 && (
                <div className="rec-row-wrapper fusion-movie-row-compact">
                  <div className="rec-row" ref={ai_ref}>
                    {cinematicMovies.map((m, idx) => (
                      <div key={idx} className="rec-card">
                        <div className="rec-poster-container" onClick={() => handlePlay(m)}>
                          <img
                            src={m.poster}
                            alt={m.title}
                            className="rec-poster"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                            }}
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
                        </div>
                        <div className="rec-info">
                          <div className="rec-meta">
                            <span className="rec-rating">⭐ {m.rating || "8.5"}</span>
                            <span className="rec-year">{m.year || "2024"}</span>
                          </div>
                          <h5>{m.title}</h5>
                          <span className="rec-genre">{m.genre?.split(",")[0]}</span>
                          <div className="rec-actions">
                            <button className="play-btn-mini" onClick={() => handlePlay(m)}>▶ Play</button>
                            <button className="watch-btn" onClick={() => toggleWatchlist(m)}>
                              {watchlist.find((x) => x.title === m.title) ? "✔" : "+"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 🔋 Battery-Level Movie Picks */}
            {batteryMovies.length > 0 && (
              <div className={`battery-section ${battery.charging ? 'battery-charging' : battery.level < 20 ? 'battery-low' : battery.level < 50 ? 'battery-medium' : ''}`}>
                <div className="battery-header">
                  <div className="battery-status-card">
                    <div className="battery-icon-container">
                      <span className="battery-emoji-large">
                        {battery.charging ? "⚡" :
                          battery.level < 20 ? "🪫" :
                            battery.level < 80 ? "🔋" :
                              "🔋"}
                      </span>
                      <div className="battery-glow"></div>
                    </div>
                    <div className="battery-info">
                      <h4>Battery Smart Movie Picks</h4>
                      <p>{battery.charging ? "DEVICE CHARGING" : "POWER OPTIMIZED"}</p>
                    </div>
                    <div className="battery-level-text">{battery.level}%</div>
                  </div>
                  <div className="battery-recommendation-msg">
                    <h5>{battery.level < 20 && !battery.charging ? "Low Power Mode" : "Personalized for you"}</h5>
                    <p>"{battery.message}"</p>
                  </div>
                </div>

                <div className="rec-row-wrapper">
                  <div className="rec-row" ref={br_ref}>
                    {batteryMovies.map((m, idx) => (
                      <div key={idx} className="rec-card">
                        <div className="rec-poster-container" onClick={() => handlePlay(m)}>
                          <img
                            src={m.poster}
                            alt={m.title}
                            className="rec-poster"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
                            }}
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
                        </div>
                        <div className="rec-info">
                          <div className="rec-meta">
                            <span className="rec-rating">⭐ {m.rating || "8.5"}</span>
                            <span className="battery-movie-runtime">{m.runtime || "2h 15m"}</span>
                          </div>
                          <h5>{m.title}</h5>
                          <span className="rec-genre">{m.genre?.split(",")[0]}</span>
                          <div className="rec-actions">
                            <button
                              className="play-btn-mini"
                              onClick={() => handlePlay(m)}
                            >
                              ▶ Play
                            </button>
                            <button
                              className="watch-btn"
                              onClick={() => toggleWatchlist(m)}
                            >
                              {watchlist.find((x) => x.title === m.title) ? "✔" : "+"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}



            {watchlist.length > 0 &&
              renderSlider("❤️ Your Watchlist", watchlist, r0)}

            {hybridPicks.length > 0 &&
              renderSlider("✨ Hybrid Picks For You", hybridPicks, rh)}

            {genres.map((g, idx) => {
              const curatedData = [
                slider1, slider2, slider3, slider4, slider5, slider6, slider7, slider8,
                slider9, slider10, slider11, slider12, slider13, slider14, slider15, slider16
              ][idx] || [];

              const dynamicData = sliderData[g.title] || [];
              const combined = [...curatedData, ...dynamicData].reduce((acc, current) => {
                const x = acc.find(item => item.title === current.title);
                if (!x && current.poster && !current.poster.includes("null")) return acc.concat([current]);
                else return acc;
              }, [])
                .sort(() => 0.5 - Math.random())
                .slice(0, 100);

              const ref = [
                r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16,
                r18, r19, r20, r21, r22, r23
              ][idx];

              return combined.length > 0 ? renderSlider(g.title, combined, ref) : null;
            })}

            {extraMovies.length > 0 && renderSlider("🌐 Discover Global Hits", extraMovies, r17)}
          </>
        )}
      </Container>
    </div>
  );
}
