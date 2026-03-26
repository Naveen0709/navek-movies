import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./src/models/Movie.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Aggressive but precise patterns for adult/porn content
const BAN_PATTERNS = [
    /\bhole-in-law\b/i,
    /\bmother-in-law\b/i,
    /\bsister-in-law\b/i,
    /\bdaughter-in-law\b/i,
    /\bstep-?mother\b/i,
    /\bstep-?sister\b/i,
    /\bstep-?daughter\b/i,
    /\bstep-?son\b/i,
    /\berotic\b/i,
    /\berotica\b/i,
    /\bporn\b/i,
    /\bporno\b/i,
    /\bnude\b/i,
    /\bnudity\b/i,
    /\bsex\b/i,
    /\bsexual\b/i,
    /\b18\+\b/i,
    /\badult\b/i,
    /\bsange\b/i,
    /\bbosomy\b/i,
    /\bprostitute\b/i,
    /\bbig[ -]breasted\b/i,
    /\bmassage\b/i,
    /\bthreesome\b/i,
    /\borgasm\b/i,
    /\bmasturbation\b/i,
    /\bsensual\b/i,
    /\bsteamy\b/i,
    /\buncut\b/i,
    /\bhardcore\b/i,
    /\bundress\b/i,
    /\bstrip\b/i,
    /\blust\b/i,
    /\bdesire\b/i,
    /\bnaked\b/i,
    /\bboarding[ -]house\b/i,
    /\bmom's[ -]friend\b/i,
    /\bmother's[ -]friend\b/i,
    /\bwife's[ -]friend\b/i,
    /\bour[ -]class\b/i, // Often used in "Our Class's Secret" type movies
    /\byoung[ -]mother\b/i,
    /\bservant\b/i, // Common B-movie trope
    /\bmaid\b/i, // Common B-movie trope
    /\btutor\b/i, 
    /\bcheating\b/i,
    /\baffair\b/i,
    /\bswapping\b/i,
    /\bswingers\b/i,
    /여제자/i, // Female student (Korean erotic trope)
    /새엄마/i, // Stepmother (Korean)
    /젊은 엄마/i, // Young mother (Korean)
    /장모님/i, // Mother-in-law (Korean)
    /처제/i, // Sister-in-law (Korean)
    /동거/i, // Cohabitation (often erotic B-movies)
    /내연녀/i, // Mistress
    /\bmother\b/i, // Often used in "Young Mother" or similar B-movies
    /\bmaids\b/i,
    /\bhostess\b/i,
    /\bcousin\b/i, // Sometimes used
    /야동/i, // Korean slang for porn
    /교생/i, // Student teacher (Korean erotic trope)
    /과외/i, // Tutoring (Korean erotic trope)
    /빨간색/i, // Red (often associated with adult movies in Korea)
    /\blubricant\b/i,
    /\bjerk off\b/i,
    /\bhorny\b/i,
    /\blewd\b/i,
    /\bx-rated\b/i
];

const cleanup = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB for PRECISION CLEANUP...");

        const allMovies = await Movie.find({});
        console.log(`Analyzing ${allMovies.length} movies...`);

        let removedCount = 0;
        for (const movie of allMovies) {
            const textToSearch = `${movie.title} ${movie.description} ${movie.genre}`.toLowerCase();
            const shouldRemove = BAN_PATTERNS.some(regex => regex.test(textToSearch));

            if (shouldRemove) {
                console.log(`❌ PERMANENTLY REMOVING: ${movie.title}`);
                await Movie.deleteOne({ _id: movie._id });
                removedCount++;
            }
        }

        console.log(`🚀 Precision Cleanup Complete! Removed ${removedCount} adult/suggestive movies.`);
        process.exit();
    } catch (err) {
        console.error("Cleanup Error:", err);
        process.exit(1);
    }
};

cleanup();
