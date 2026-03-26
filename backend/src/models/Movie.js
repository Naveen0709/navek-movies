import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    rating: { type: String, default: "4.0" },
    poster: { type: String, required: true },
    description: { type: String, default: "" },
    trailerId: { type: String, default: "" },
    cast: { type: String, default: "" },
    director: { type: String, default: "" },
    year: { type: String, default: "" },
    runtime: { type: String, default: "" },
    category: { type: String, default: "" },
    videoUrls: {
      "480p": { type: String, default: "" },
      "720p": { type: String, default: "" },
      "1080p": { type: String, default: "" },
    },
    audioLanguages: [
      {
        lang: { type: String, default: "English" },
        url: { type: String, default: "" },
      },
    ],
    subtitles: [
      {
        lang: { type: String, default: "English" },
        url: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);

