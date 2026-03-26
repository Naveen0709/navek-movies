import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Movie from './src/models/Movie.js';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
console.log(`Using TMDB Key: ${TMDB_API_KEY ? TMDB_API_KEY.slice(0,3) + '...' : 'MISSING!'}`);

async function getBestTrailer(title, year, language) {
    if (!title) return null;
    
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
        const res = await axios.get(url);
        if (!res.data.results) {
            console.log(`   ⚠️ No results object for ${title}`);
            return null;
        }
        const results = res.data.results || [];
        console.log(`   🔎 Found ${results.length} results for ${title}`);
        
        if (results.length === 0) return null;

        let bestMovie = results[0];
        if (year && year !== "N/A" && year.length === 4) {
            const exactMatch = results.find(m => m.release_date && m.release_date.startsWith(year));
            if (exactMatch) bestMovie = exactMatch;
            else {
                const closeMatch = results.find(m => {
                    if (!m.release_date) return false;
                    const bYear = parseInt(m.release_date.split("-")[0]);
                    const targetYear = parseInt(year);
                    return Math.abs(bYear - targetYear) <= 1;
                });
                if (closeMatch) bestMovie = closeMatch;
            }
        }

        console.log(`   🎬 Best Match: ${bestMovie.title} (${bestMovie.id})`);

        const videoUrl = `https://api.themoviedb.org/3/movie/${bestMovie.id}/videos?api_key=${TMDB_API_KEY}`;
        const videoRes = await axios.get(videoUrl);
        const videos = videoRes.data.results || [];
        console.log(`   📹 Found ${videos.length} videos`);
        
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
        console.log('Database Connected.');

        const badIds = ["fT-l6K7K44A", "", "null", "undefined", null, "U7_VZlGApBI"]; // Added some known placeholders
        
        const movies = await Movie.find({ 
            $or: [
                { trailerId: { $in: badIds } },
                { trailerId: { $exists: false } }
            ]
        });

        console.log(`Checking ${movies.length} movies for trailer issues...`);

        let count = 0;
        for (let m of movies) {
            console.log(`Attempting fix for: ${m.title} (${m.year})...`);
            const key = await getBestTrailer(m.title, m.year, m.language);
            if (key && !badIds.includes(key)) {
                await Movie.updateOne({ _id: m._id }, { $set: { trailerId: key } });
                console.log(`   ✅ SUCCESS: ${m.title} -> ${key}`);
                count++;
            } else {
                console.log(`   ❌ FAILED: No better video found for ${m.title}`);
            }
        }

        console.log(`\nDONE! Fixed ${count} trailers in the main collection.`);
        process.exit(0);
    } catch (err) {
        console.error("Critical Error:", err);
        process.exit(1);
    }
}

startFix();
