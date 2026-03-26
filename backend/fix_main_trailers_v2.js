import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Movie from './src/models/Movie.js';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getTrailerFromTMDB(title, year, language) {
    if (!title) return null;
    
    // Try 1: Specific search with Year
    try {
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
        if (year && year !== "N/A" && year.length === 4 && parseInt(year) < 2025) {
            url += `&year=${year}`;
        }
        
        let res = await axios.get(url);
        let movie = res.data.results?.[0];
        
        if (!movie) {
            // Try 2: Broad search without year
            url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
            res = await axios.get(url);
            movie = res.data.results?.[0];
        }

        if (movie) {
            const videoUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`;
            const videoRes = await axios.get(videoUrl);
            const videos = videoRes.data.results || [];
            // Prioritize Official Trailer
            let trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (!trailer) trailer = videos.find(v => v.site === 'YouTube');
            
            return trailer ? trailer.key : null;
        }
    } catch (err) {
        return null;
    }
    return null;
}

async function startFix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const badIds = ["fT-l6K7K44A", "", "null", "undefined", null];
        const movies = await Movie.find({ 
            $or: [
                { trailerId: { $in: badIds } },
                { trailerId: { $exists: false } }
            ]
        });

        console.log(`Analyzing ${movies.length} movies...`);

        let fixedCount = 0;
        for (let m of movies) {
            const newKey = await getTrailerFromTMDB(m.title, m.year, m.language);
            if (newKey && newKey !== "fT-l6K7K44A") {
                m.trailerId = newKey;
                await m.save();
                fixedCount++;
                console.log(`✅ Fixed: ${m.title} -> ${newKey}`);
            } else {
                // If still nothing, use a better fallback (Global Cinema Intro)
                // actually better to just leave it and try to find it.
            }
        }

        console.log(`Total Fixed: ${fixedCount}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

startFix();
