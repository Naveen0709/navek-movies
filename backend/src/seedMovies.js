import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";
import movies from "./data/movies.js";

dotenv.config();

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Movie.deleteMany();
    console.log("Old movies deleted ❌");

    await Movie.insertMany(movies);
    console.log(`✅ ${movies.length} movies inserted successfully`);

    process.exit();
  } catch (err) {
    console.log("Seed Error:", err);
    process.exit(1);
  }
};

seedMovies();
