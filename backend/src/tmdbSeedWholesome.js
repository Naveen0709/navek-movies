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

const EXCLUDE_KEYWORDS = "15865|191062|156434|180540|1556|159392";

const fetchSuperSafeMovies = async (url, categoryName) => {
    let movies = [];
    try {
        const fullUrl = `${url}&api_key=${API_KEY}&include_adult=false&without_keywords=${EXCLUDE_KEYWORDS}`;
        const response = await axios.get(fullUrl);
        const results = response.data.results;

        for (const m of results) {
            if (!m.poster_path) continue;
            if (m.adult) continue;

            const forbiddenWords = ["sex", "nude", "busty", "erotic", "uncut", "r-rated", "adult", "18+", "erotica", "girl friend", "bed", "body", "sexual"];
            const textToCheck = (m.title + " " + m.overview).toLowerCase();
            if (forbiddenWords.some(word => textToCheck.includes(word))) continue;

            const releaseYear = m.release_date ? parseInt(m.release_date.split("-")[0]) : 0;
            if (releaseYear < 2015) continue;

            let genres = m.genre_ids.map(id => genresMap[id]).filter(Boolean).join(", ");
            if (!genres) genres = categoryName;
            if (!genres.includes(categoryName)) genres = `${categoryName}, ${genres}`;

            movies.push({
                title: m.title,
                poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                rating: m.vote_average.toFixed(1),
                year: releaseYear.toString(),
                genre: genres,
                description: m.overview,
                language: m.original_language,
                runtime: "2h 05m",
                cast: "International Cast",
                director: "Major Director",
                trailerId: "fT-l6K7K44A"
            });
        }
    } catch (err) {
        console.error(`Error fetching ${categoryName}:`, err.message);
    }
    return movies;
};

const seedWholesomeBoost = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to Boost Wholesome Collection...");

        let wholesomeMovies = [];
        console.log("📡 Fetching 100+ EXTRA Wholesome / Family movies...");

        // Fetch 10 pages of Family/Feel-good movies
        for (let page = 1; page <= 10; page++) {
            const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=${page}&with_genres=10751&primary_release_date.gte=2018-01-01`;
            const movies = await fetchSuperSafeMovies(url, "Wholesome");
            wholesomeMovies.push(...movies);
            console.log(`✅ Wholesome Page ${page}: Got ${movies.length}`);
        }

        // Deduplicate against existing DB or current batch
        const unique = wholesomeMovies.reduce((acc, current) => {
            const x = acc.find(item => item.title === current.title);
            if (!x) return acc.concat([current]);
            else return acc;
        }, []);

        console.log(`🎬 Total Unique Wholesome to Seed: ${unique.length}`);

        // We use insertMany with ordered: false to skip duplicates if any exist in DB
        try {
            await Movie.insertMany(unique, { ordered: false });
        } catch (e) {
            // Ignore duplicate key errors
        }

        console.log("🎉 SUCCESS: Wholesome Movie slider boosted!");
        process.exit();
    } catch (err) {
        console.error("❌ Seed Error:", err);
        process.exit(1);
    }
};

seedWholesomeBoost();
