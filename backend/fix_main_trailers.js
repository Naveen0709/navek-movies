import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Movie from './src/models/Movie.js';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchTrailer(title, year, language) {
    if (!title) return null;
    try {
        let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
        if (year && year !== "N/A" && year !== "2024" && year !== "2025" && year !== "2026") {
            searchUrl += `&year=${year}`;
        }
        if (language && language !== "en") {
            searchUrl += `&language=${language}`;
        }
        
        const searchRes = await axios.get(searchUrl);
        const movie = searchRes.data.results?.[0];
        
        if (!movie) return null;
        
        const videoUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`;
        const videoRes = await axios.get(videoUrl);
        const videos = videoRes.data.results || [];
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        return trailer ? trailer.key : (videos[0] ? videos[0].key : null);
    } catch (err) {
        return null;
    }
}

async function fixMainTrailers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for Main Movies Fix.');

        const badTrailers = ["fT-l6K7K44A", "", "null", "undefined"];
        const movies = await Movie.find({ 
            $or: [
                { trailerId: { $in: badTrailers } },
                { trailerId: { $exists: false } }
            ]
        });

        console.log(`Found ${movies.length} main movies needing trailer fix.`);

        let fixed = 0;
        for (let i = 0; i < movies.length; i++) {
            const m = movies[i];
            const trailerId = await fetchTrailer(m.title, m.year, m.language);
            if (trailerId && trailerId !== "fT-l6K7K44A") {
                m.trailerId = trailerId;
                await m.save();
                fixed++;
            }
            if ((i + 1) % 20 === 0) console.log(`Processed ${i + 1}/${movies.length} movies...`);
        }
        
        console.log(`✅ Fixed ${fixed} main movie trailers.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixMainTrailers();
