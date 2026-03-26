import axios from 'axios';
const API_KEY = "eb46ebb646eea7183b734797b40cb202";

async function run() {
    try {
        const res = await axios.get(`https://api.themoviedb.org/3/person/91547/movie_credits?api_key=${API_KEY}`);
        console.log("Movies for 91547:", res.data.cast.slice(0, 5).map(m => m.title));

        const res2 = await axios.get(`https://api.themoviedb.org/3/person/5538/movie_credits?api_key=${API_KEY}`);
        console.log("Movies for 5538 (Thalapathy Vijay):", res2.data.cast.slice(0, 5).map(m => m.title));
    } catch (e) {
        console.error(e.message);
    }
}
run();
