import express from "express";
import { getSlider1, getSlider2 } from "../controllers/sliderController.js";

const router = express.Router();

router.get("/slider1", getSlider1);
router.get("/slider2", getSlider2);

export default router;
