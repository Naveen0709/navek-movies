import express from "express";
import { getAIRecommendation } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", getAIRecommendation);

export default router;
