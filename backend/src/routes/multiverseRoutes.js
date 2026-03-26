import express from "express";
import { getMultiverseRecommendations, getAllMultiverseRoles, getMoviesByRole } from "../controllers/multiverseController.js";

const router = express.Router();

router.get("/recommend/parallel", getMultiverseRecommendations);
router.get("/multiverse/roles", getAllMultiverseRoles);
router.get("/multiverse/:roleName", getMoviesByRole);

export default router;
