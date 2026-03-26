import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./src/models/Movie.js";

dotenv.config();

const langMap = {
  "en": "English",
  "ta": "Tamil",
  "te": "Telugu",
  "hi": "Hindi",
  "ja": "Japanese",
  "ko": "Korean",
  "es": "Spanish",
  "fr": "French"
};

const fixLanguages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");
    
    // Fetch all movies
    const movies = await Movie.find({});
    let updatedCount = 0;
    
    for (const movie of movies) {
      if (langMap[movie.language]) {
        movie.language = langMap[movie.language];
        await movie.save();
        updatedCount++;
      } else if (movie.language === 'English' || movie.language === 'Tamil') {
        // already correct
      } else {
        // capitalize correctly if it's already a full word
        const capitalized = movie.language.charAt(0).toUpperCase() + movie.language.slice(1);
        if (capitalized !== movie.language && movie.language.length > 2) {
            movie.language = capitalized;
            await movie.save();
            updatedCount++;
        }
      }
    }
    
    console.log(`Updated ${updatedCount} movies languages.`);
    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

fixLanguages();
