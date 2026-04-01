import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./src/models/Movie.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const cleanupSpecific = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Searching for specifically bad movies from screenshot...");

        const badKeywords = [
            /Narronambul/i,
            /Naeronambul/i,
            /Inner/i, // Some erotic titles use "Inner..."
            /Secret Desire/i,
            /Adult Movie/i,
            /内罗南火/i,
            /Nambul/i,
            /Bae Suzy/i, // She's a k-pop idol, but sometimes B-movies use her name incorrectly? 
            /Narrow/i // Based on my previous findings
        ];

        const removed = [];
        const all = await Movie.find({});
        for (const m of all) {
            const txt = (m.title + " " + m.overview).toLowerCase();
            if (badKeywords.some(re => re.test(txt))) {
                 console.log(`❌ REMOVING: ${m.title}`);
                 await Movie.deleteOne({ _id: m._id });
                 removed.push(m.title);
            }
        }

        console.log(`Done. Removed ${removed.length} movies.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

cleanupSpecific();
