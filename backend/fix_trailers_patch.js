import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import AIMovie from './src/models/AIMovie.js';
import Movie from './src/models/Movie.js';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchTrailer(tmdbId) {
    if (!tmdbId) return null;
    try {
        const url = `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`;
        const response = await axios.get(url);
        const videos = response.data.results || [];
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        return trailer ? trailer.key : (videos[0] ? videos[0].key : null);
    } catch (err) {
        // console.error(`Error fetching for ${tmdbId}:`, err.message);
        return null;
    }
}

async function fixTrailers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB.');

        // 1. Fix AI Movies
        const aiMovies = await AIMovie.find({ $or: [{ trailerId: "" }, { trailerId: { $exists: false } }] });
        console.log(`Found ${aiMovies.length} AI movies missing trailers. Process started...`);

        let fixedAI = 0;
        for (let i = 0; i < aiMovies.length; i++) {
            const m = aiMovies[i];
            const trailerId = await fetchTrailer(m.tmdbId);
            if (trailerId) {
                m.trailerId = trailerId;
                await m.save();
                fixedAI++;
            }
            if ((i + 1) % 50 === 0) console.log(`Processed ${i + 1} AI movies...`);
        }
        console.log(`✅ Fixed ${fixedAI} AI movie trailers.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixTrailers();
