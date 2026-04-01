import axios from "axios";


const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://navek-movies-xu0e.onrender.com/api",
});

export default API;
