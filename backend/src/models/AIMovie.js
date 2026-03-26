import mongoose from "mongoose";

const aiMovieSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        genre: { type: String, required: true },
        language: { type: String, required: true },
        rating: { type: String, default: "7.0" },
        poster: { type: String, required: true },
        description: { type: String, default: "" },
        trailerId: { type: String, default: "" },
        cast: { type: String, default: "" },
        director: { type: String, default: "" },
        year: { type: String, default: "" },
        runtime: { type: String, default: "" },
        category: { type: String, default: "" },
        keywords: { type: String, default: "" },
        popularity: { type: Number, default: 0 },
        voteCount: { type: Number, default: 0 },
        tmdbId: { type: Number, unique: true },
    },
    { timestamps: true }
);

export default mongoose.model("AIMovie", aiMovieSchema);
