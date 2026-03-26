import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import Movie from "./src/models/Movie.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const updateExistingMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Update all movies to include the new fields if they don't exist
    const result = await Movie.updateMany(
      {}, 
      { 
        $set: { 
          videoUrls: {
            "480p": "",
            "720p": "",
            "1080p": ""
          },
          audioLanguages: [
            { lang: "English", url: "" }
          ],
          subtitles: [
            { lang: "English", url: "" }
          ]
        } 
      },
      { upsert: false }
    );

    console.log(`Successfully updated ${result.modifiedCount} movies.`);
    
    // Example: Update one movie to point to a local file for testing
    // You should put a real mp4 file at backend/movies/sample.mp4
    const firstMovie = await Movie.findOne();
    if (firstMovie) {
        firstMovie.videoUrls = {
            "480p": "movies/sample_480p.mp4",
            "720p": "movies/sample_720p.mp4",
            "1080p": "movies/sample_1080p.mp4"
        };
        await firstMovie.save();
        console.log(`Updated sample movie: ${firstMovie.title}`);
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("Error updating movies:", err);
    process.exit(1);
  }
};

updateExistingMovies();
