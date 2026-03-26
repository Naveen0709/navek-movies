import axios from "axios";

const API = "http://localhost:5000/api/sliders";

export const getSlider1Movies = () => axios.get(`${API}/slider1`);
export const getSlider2Movies = () => axios.get(`${API}/slider2`);
