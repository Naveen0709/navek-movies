import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './src/models/Movie.js';
import AIMovie from './src/models/AIMovie.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log("--- Movie Sample ---");
        const movie = await Movie.findOne({});
        console.log(JSON.stringify(movie, null, 2));

        console.log("\n--- AI Movie Sample ---");
        const aiMovie = await AIMovie.findOne({ trailerId: "" });
        console.log(JSON.stringify(aiMovie, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
