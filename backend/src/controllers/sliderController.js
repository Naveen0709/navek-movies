import { slider1Movies, slider2Movies } from "../data/sliderMovies.js";

export const getSlider1 = async (req, res) => {
  res.json(slider1Movies);
};

export const getSlider2 = async (req, res) => {
  res.json(slider2Movies);
};
