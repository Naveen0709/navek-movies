import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './src/models/Movie.js';
import AIMovie from './src/models/AIMovie.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const movieCount = await Movie.countDocuments({ $or: [{ trailerId: "" }, { trailerId: { $exists: false } }] });
        const aiMovieCount = await AIMovie.countDocuments({ $or: [{ trailerId: "" }, { trailerId: { $exists: false } }] });
        
        console.log(`Movies missing trailerId: ${movieCount}`);
        console.log(`AI Movies missing trailerId: ${aiMovieCount}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
