import Movie from "../models/Movie.js";
import User from "../models/User.js";
import MultiverseRole from "../models/MultiverseRole.js";

const roleGenreMap = {
  Spy: ["Action", "Thriller", "Mystery"],
  Hacker: ["Sci-Fi", "Thriller", "Crime"],
  Detective: ["Mystery", "Crime", "Thriller"],
  Assassin: ["Action", "Crime", "Thriller"],
  "Time Traveler": ["Sci-Fi", "Adventure", "Fantasy"],
  Wizard: ["Fantasy", "Adventure"],
  Villain: ["Crime", "Horror", "Thriller"],
  Astronaut: ["Sci-Fi", "Adventure", "Documentary"],
  Robot: ["Sci-Fi", "Action"],
  Ninja: ["Action", "Adventure"],
  Pirate: ["Adventure", "Action"],
  "Mafia Boss": ["Crime", "Drama", "Thriller"],
  Samurai: ["Action", "History", "Drama"],
  Alien: ["Sci-Fi", "Horror"],
  Superhero: ["Action", "Fantasy", "Sci-Fi"],
  Viking: ["Action", "History", "Adventure"],
  Gladiator: ["Action", "History", "Drama"],
  Explorer: ["Adventure", "Documentary"],
  Archaeologist: ["Adventure", "Mystery", "History"],
  "Monster Hunter": ["Fantasy", "Action", "Horror"],
  Survivor: ["Drama", "Thriller", "Action"],
  "Rebel Leader": ["Action", "Drama", "History"],
  "Space Commander": ["Sci-Fi", "Action", "Adventure"],
  "Dark Knight": ["Action", "Crime", "Mystery"],
  "Mythical God": ["Fantasy", "History", "Action"]
};

// 1. Get all roles for the Selection Grid
export const getAllMultiverseRoles = async (req, res) => {
  try {
    const roles = await MultiverseRole.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch roles" });
  }
};

// 2. Get curated movies for a specific role
export const getMoviesByRole = async (req, res) => {
  try {
    const { roleName } = req.params;
    const roleObj = await MultiverseRole.findOne({ roleName: { $regex: new RegExp(`^${roleName}$`, 'i') } });
    
    if (!roleObj) {
      return res.status(404).json({ message: "Role not found in the multiverse" });
    }
    
    res.status(200).json(roleObj);
  } catch (error) {
    res.status(500).json({ message: "Error traveling through galaxies" });
  }
};

export const getMultiverseRecommendations = async (req, res) => {
  try {
    const { role, userId } = req.query;
    
    // 1. Get Curated Base from MultiverseRole
    const curatedRole = await MultiverseRole.findOne({ roleName: { $regex: new RegExp(`^${role}$`, 'i') } });
    let baseMovies = curatedRole ? curatedRole.movies : [];

    // 2. Get Dynamic Base from Movie Collection based on Genres
    const genres = roleGenreMap[role] || ["Action"];
    const dynamicMovies = await Movie.find({
      genres: { $in: genres }
    }).limit(20);

    // 3. Blend and Process
    let pool = [...baseMovies];
    
    // Add dynamic ones that aren't duplicates
    dynamicMovies.forEach(dm => {
      if (!pool.some(p => p.title === dm.title)) {
        pool.push({
          title: dm.title,
          genres: dm.genres,
          poster: dm.poster,
          backdrop: dm.backdrop || dm.poster,
          rating: dm.rating || "7.5",
          year: dm.year || "N/A",
          reason: `Perfect match for the ${role} universe.`
        });
      }
    });

    // 4. Score and Rank
    let userPreferredGenres = [];
    if (userId) {
      const user = await User.findById(userId);
      if (user) userPreferredGenres = user.preferredGenres || [];
    }

    const finalMovies = pool.map(m => {
      const matchCount = (m.genres || []).filter(g => userPreferredGenres.includes(g)).length;
      return {
        ...m,
        aiScore: 0.5 + (matchCount * 0.1),
        aiLabel: "PREMIUM MATCH"
      };
    })
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 10); // Return EXACTLY 10

    // 5. Emergency Fallback if pool is somehow less than 10 (unlikely with DB search)
    if (finalMovies.length < 10) {
      const generic = await Movie.find({}).limit(10 - finalMovies.length);
      generic.forEach(gm => {
        finalMovies.push({
          title: gm.title,
          genres: gm.genres,
          poster: gm.poster,
          backdrop: gm.backdrop || gm.poster,
          rating: gm.rating || "7.0",
          year: gm.year || "N/A",
          reason: "Multiverse exploration pick"
        });
      });
    }

    return res.status(200).json(finalMovies.slice(0, 10));
  } catch (error) {
    console.error("Multiverse Engine Error:", error);
    res.status(500).json({ message: "AI Engine malfunctioned ❌" });
  }
};
