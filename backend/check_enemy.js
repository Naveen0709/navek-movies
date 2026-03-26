import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './src/models/Movie.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const m = await Movie.findOne({ title: 'Enemy' });
        console.log(JSON.stringify(m, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
