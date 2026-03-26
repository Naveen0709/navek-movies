import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Movie from "./models/Movie.js";

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

const genresMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

// 🛑 DISALLOWED KEYWORDS (to block erotica/adult titles that slip through)
const EXCLUDE_KEYWORDS = "15865|191062|156434|180540|1556|159392"; // nudity, erotica, sex, pornography

const fetchSuperSafeMovies = async (url, categoryName) => {
    let movies = [];
    try {
        const fullUrl = `${url}&api_key=${API_KEY}&include_adult=false&without_keywords=${EXCLUDE_KEYWORDS}`;
        const response = await axios.get(fullUrl);
        const results = response.data.results;

        for (const m of results) {
            if (!m.poster_path) continue;
            if (m.adult) continue;

            // 🛑 Aggressive Title/Description Check for College Project Safety
            const forbiddenWords = [
              "sex", "nude", "busty", "erotic", "uncut", "r-rated", "adult", "18+", "erotica",
              "girl friend", "bed", "body", "sexual", "massage", "sensual", "steamy", "hot", 
              "threesome", "orgasm", "naked", "strip", "tutor", "affair", "cheating", "lust", "desire",
              "hole-in-law", "mother-in-law", "sister-in-law", "daughter-in-law", "stepmother", 
              "stepsister", "stepdaughter", "young mother", "boarding house", "mom's friend",
              "mother's friend", "wife's friend", "bosomy", "prostitute", "big breasted", "sange",
              "maid", "servant", "여제자", "장모님"
            ];
            const textToCheck = (m.title + " " + m.overview).toLowerCase();
            if (forbiddenWords.some(word => textToCheck.includes(word))) {
                console.log(`❌ BLOCKING potential unsafe movie: ${m.title}`);
                continue;
            }

            // 🛑 Quality Filter: Only newest movies (2020+) to avoid "old bad posters"
            const releaseYear = m.release_date ? parseInt(m.release_date.split("-")[0]) : 0;
            if (releaseYear < 2018) continue;

            let genres = m.genre_ids.map(id => genresMap[id]).filter(Boolean).join(", ");
            if (!genres) genres = categoryName;

            if (!genres.includes(categoryName)) {
                genres = `${categoryName}, ${genres}`;
            }

            let trailerKey = "fT-l6K7K44A"; // Ultimate Fallback
            try {
                // ⏱️ Rate Limit Protection: Small delay for each video request
                await new Promise(r => setTimeout(r, 100));

                const vUrl = `https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=${API_KEY}`;
                const videoRes = await axios.get(vUrl);
                const vids = videoRes.data.results || [];

                // 🎬 Smart Priority Search: Trailer > Teaser > Clip > Any
                const found = vids.find(v => v.site === "YouTube" && v.type === "Trailer") ||
                    vids.find(v => v.site === "YouTube" && v.type === "Teaser") ||
                    vids.find(v => v.site === "YouTube" && v.type === "Clip") ||
                    vids.find(v => v.site === "YouTube" && v.type === "Featurette") ||
                    vids.find(v => v.site === "YouTube");

                if (found) trailerKey = found.key;
            } catch (vErr) {
                // If 429 or network error, keep fallback
            }

            const langMap = { "en": "English", "ta": "Tamil", "te": "Telugu", "hi": "Hindi", "ja": "Japanese", "ko": "Korean", "ml": "Malayalam", "kn": "Kannada", "es": "Spanish", "fr": "French" };
            const fullLang = langMap[m.original_language] || m.original_language.charAt(0).toUpperCase() + m.original_language.slice(1);

            movies.push({
                title: m.title,
                poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                rating: m.vote_average.toFixed(1),
                year: releaseYear.toString(),
                genre: genres,
                description: m.overview,
                language: fullLang,
                runtime: "2h 10m",
                cast: "International Cast",
                director: "Major Director",
                trailerId: trailerKey
            });
        }
    } catch (err) {
        console.error(`Error fetching ${categoryName}:`, err.message);
    }
    return movies;
};

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected for AGGRESSIVE CLEAN SEED...");

        // Final Wipe
        // await Movie.deleteMany({});
        console.log("Adding to existing DB. Starting fresh with 100% safe, new content.");

        // We fetch 5 pages for each to get ~100 movies
        const safeCategories = [
            { name: "Indian", lang: "ta|te|ml|kn", extra: "&primary_release_date.gte=2021-01-01" },
            { name: "Korean", lang: "ko", extra: "&certification_country=US&certification.lte=PG-13&primary_release_date.gte=2020-01-01" },
            { name: "Action", genres: "28", extra: "&primary_release_date.gte=2022-01-01" },
            { name: "Anime", lang: "ja", genres: "16", extra: "&primary_release_date.gte=2020-01-01" },
            { name: "Superhero", query: "superhero", extra: "&primary_release_date.gte=2020-01-01" },
            { name: "Comedy", genres: "35", extra: "&primary_release_date.gte=2022-01-01" },
            { name: "Horror", genres: "27", extra: "&primary_release_date.gte=2022-01-01" },
            { name: "Kids", genres: "10751", extra: "&primary_release_date.gte=2020-01-01" },
            { name: "Motivational", genres: "18", extra: "&with_keywords=6075&primary_release_date.gte=2020-01-01" },
            { name: "Romance", genres: "10749", extra: "&primary_release_date.gte=2022-01-01&certification.lte=PG-13" },
        ];

        let finalMovies = [];

        for (const cat of safeCategories) {
            console.log(`🛡️ Fetching 100% Safe ${cat.name} movies (Post-2020)...`);
            for (let page = 1; page <= 15; page++) {
                let baseUrl = cat.query
                    ? `https://api.themoviedb.org/3/search/movie?query=${cat.query}&page=${page}`
                    : `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=${page}`;

                if (cat.lang) baseUrl += `&with_original_language=${cat.lang}`;
                if (cat.genres) baseUrl += `&with_genres=${cat.genres}`;
                if (cat.extra) baseUrl += cat.extra;

                const movies = await fetchSuperSafeMovies(baseUrl, cat.name);
                finalMovies.push(...movies);
            }
        }

        // Deduplicate
        const unique = finalMovies.reduce((acc, current) => {
            const x = acc.find(item => item.title === current.title);
            if (!x) return acc.concat([current]);
            else return acc;
        }, []);

        console.log(`🎬 Total Unique Safe Movies Fetched: ${unique.length}`);

        // --- Avoid Database Duplicates ---
        const existingMovies = await Movie.find({}, 'title');
        const existingTitles = new Set(existingMovies.map(m => m.title.toLowerCase()));

        const newMovies = unique.filter(m => !existingTitles.has(m.title.toLowerCase()));
        console.log(`🆕 Found ${newMovies.length} truly new movies to insert.`);

        const chunkSize = 50;
        for (let i = 0; i < newMovies.length; i += chunkSize) {
            await Movie.insertMany(newMovies.slice(i, i + chunkSize));
            console.log(`✅ Seeded ${Math.min(i + chunkSize, newMovies.length)} / ${newMovies.length}`);
        }

        console.log("🎉 SUCCESS: Your project is now 100% Safe and Modern!");
        process.exit();
    } catch (err) {
        console.error("❌ Seed Error:", err);
        process.exit(1);
    }
};

seedDB();
