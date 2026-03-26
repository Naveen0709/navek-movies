import fs from "fs";
import path from "path";
import Movie from "../models/Movie.js";

export const getMovies = async (req, res) => {
  try {
    const { limit = 50, genre, language } = req.query;
    let query = {};
    if (genre) {
      query.genre = { $regex: genre, $options: "i" };
    }
    if (language) {
      query.language = { $regex: language, $options: "i" };
    }
    const movies = await Movie.find(query).limit(parseInt(limit));
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Stream movie with Range Requests 🎬
export const streamMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const quality = req.query.quality || "720p";
    // Check if videoUrl for requested quality exists, otherwise fallback
    let videoPath = movie.videoUrls[quality] || movie.videoUrls["720p"] || movie.videoUrls["480p"];

    if (!videoPath) {
      // For development, if no path is stored, we might use a dummy path
      // In production, this would be an absolute or relative path to a local file
      return res.status(404).json({ message: "Video file not found for this quality" });
    }

    // Resolve path (if using local storage)
    const filePath = path.resolve(videoPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Physical video file not found on server" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize) {
        res.status(416).send("Requested range not satisfiable\n" + start + " >= " + fileSize);
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Streaming failed" });
  }
};

