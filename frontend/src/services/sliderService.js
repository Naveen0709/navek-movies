import axios from "axios";

const API = "https://navek-movies-xu0e.onrender.com/api/sliders";

export const getSlider1Movies = () => axios.get(`${API}/slider1`);
export const getSlider2Movies = () => axios.get(`${API}/slider2`);
