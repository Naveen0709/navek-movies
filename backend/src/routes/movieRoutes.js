import express from "express";
import { getMovies, getMovieById, streamMovie } from "../controllers/movieController.js";

const router = express.Router();

// GET all movies (limit 50)
router.get("/", getMovies);

// GET single movie by id
router.get("/:id", getMovieById);

// STREAM movie by id
router.get("/:id/stream", streamMovie);

export default router;

