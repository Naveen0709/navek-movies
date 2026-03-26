import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Movie from './src/models/Movie.js';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getBestTrailer(title, year, language) {
    if (!title) return null;
    
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
        const res = await axios.get(url);
        const results = res.data.results || [];
        
        if (results.length === 0) return null;

        // Try to find the best matching movie by year
        let bestMovie = results[0];
        if (year && year !== "N/A") {
            const exactMatch = results.find(m => m.release_date && m.release_date.startsWith(year));
            if (exactMatch) bestMovie = exactMatch;
            else {
                // Try to find any result within 1 year
                const closeMatch = results.find(m => {
                    if (!m.release_date) return false;
                    const bYear = parseInt(m.release_date.split("-")[0]);
                    const targetYear = parseInt(year);
                    return Math.abs(bYear - targetYear) <= 1;
                });
                if (closeMatch) bestMovie = closeMatch;
            }
        }

        const videoUrl = `https://api.themoviedb.org/3/movie/${bestMovie.id}/videos?api_key=${TMDB_API_KEY}`;
        const videoRes = await axios.get(videoUrl);
        const videos = videoRes.data.results || [];
        
        // Strategy: Trailer > Teaser > Clip > First Video
        let video = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (!video) video = videos.find(v => v.type === 'Teaser' && v.site === 'YouTube');
        if (!video) video = videos.find(v => v.site === 'YouTube');
        
        return video ? video.key : null;
    } catch (err) {
        return null;
    }
}

async function startFix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB.');

        const badIds = ["fT-l6K7K44A", "", "null", "undefined", null];
        
        // Fix Main Movie Collection
        const mainMovies = await Movie.find({ 
            $or: [
                { trailerId: { $in: badIds } },
                { trailerId: { $exists: false } }
            ]
        });

        console.log(`Found ${mainMovies.length} main movies needing fix.`);
        let fixedMain = 0;
        for (let m of mainMovies) {
            const key = await getBestTrailer(m.title, m.year, m.language);
            if (key && key !== "fT-l6K7K44A") {
                m.trailerId = key;
                await m.save();
                fixedMain++;
                console.log(`✅ [Main] Fixed ${m.title} (${m.year}) -> ${key}`);
            }
        }
        console.log(`Fixed ${fixedMain} main movies.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

startFix();
