import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './src/models/Movie.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const titles = ["Aavesham", "Jathi Ratnalu", "Junior", "Enemy", "Karnan"];
        const movies = await Movie.find({ title: { $in: titles } });
        
        console.log("--- Recommendation Movies Trailer Check ---");
        movies.forEach(m => {
            console.log(`Title: ${m.title}, TrailerId: "${m.trailerId}", ID: ${m._id}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
