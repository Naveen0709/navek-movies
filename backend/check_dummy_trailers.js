import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './src/models/Movie.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Movie.countDocuments({ 
            $or: [
                { trailerId: "fT-l6K7K44A" },
                { trailerId: "" },
                { trailerId: null },
                { trailerId: { $exists: false } }
            ]
        });
        console.log(`Movies with dummy or missing trailerId: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
