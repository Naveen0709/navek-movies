import mongoose from "mongoose";

const multiverseMovieSchema = new mongoose.Schema({
  title: String,
  genres: [String],
  reason: String,
  poster: String,
  rating: String,
  year: String,
  trailerId: String
});

const multiverseRoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  icon: String,
  backgroundImage: String, // Cinematic background image
  tagline: String,
  description: String,
  category: String,
  movies: [multiverseMovieSchema]
});

const MultiverseRole = mongoose.model("MultiverseRole", multiverseRoleSchema);

export default MultiverseRole;
