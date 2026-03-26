import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './src/models/Movie.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Movie.countDocuments({});
        console.log('Total Main Movies:', count);

        const shortTrailers = await Movie.find({ $or: [
            { trailerId: { $exists: false } },
            { trailerId: "" },
            { trailerId: { $regex: /^.{1,5}$/ } }
        ]});
        console.log('Movies with missing/suspicious trailers:', shortTrailers.length);
        shortTrailers.forEach(m => console.log(`- ${m.title} (${m.trailerId})`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
