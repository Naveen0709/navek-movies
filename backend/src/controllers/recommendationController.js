import Movie from "../models/Movie.js";

// GET recommendations organized by sliders
export const getRecommendations = async (req, res) => {
  try {
    const movies = await Movie.find();

    // Org into categories
    const recommendations = {
      slider1: movies.filter(m => m.language === "Telugu" || m.language === "Kannada"),
      slider2: movies.filter(m => m.language === "Korean"),
      slider3: movies.filter(m => m.genre.includes("Action") && m.language === "English"),
      // ... more categorization logic
      all: movies
    };

    res.json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
