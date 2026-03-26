import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './src/models/Movie.js';
import AIMovie from './src/models/AIMovie.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log("--- Movie Samples ---");
        const movies = await Movie.find({}).limit(5);
        movies.forEach(m => console.log(`Title: ${m.title}, TrailerId: ${m.trailerId}`));

        console.log("\n--- AI Movie Samples ---");
        const aiMovies = await AIMovie.find({}).limit(5);
        aiMovies.forEach(m => console.log(`Title: ${m.title}, TrailerId: ${m.trailerId}, tmdbId: ${m.tmdbId}`));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
