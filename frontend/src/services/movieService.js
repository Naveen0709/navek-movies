import axios from "axios";

const API = "https://navek-movies-xu0e.onrender.com/api";

export const getMovies = (limit = 50, genre = "", language = "") =>
    axios.get(`${API}/movies?limit=${limit}&genre=${genre}&language=${language}`);
export const getMovieById = (id) => axios.get(`${API}/movies/${id}`);
export const getSecondSliderMovies = () => axios.get(`${API}/second-slider`);
