const fetch = require('node-fetch');

const run = async () => {
    try {
        const searchRes = await fetch(`https://api.themoviedb.org/3/search/person?api_key=eb46ebb646eea7183b734797b40cb202&query=${encodeURIComponent("Vijay")}`);
        const searchData = await searchRes.json();

        if (searchData.results && searchData.results.length > 0) {
            const sortedResults = searchData.results.sort((a, b) => b.popularity - a.popularity);
            const personId = sortedResults[0].id;
            console.log("Found Vijay ID:", personId, "Popularity:", sortedResults[0].popularity, "Known for dept:", sortedResults[0].known_for_department);

            const credRes = await fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=eb46ebb646eea7183b734797b40cb202&language=en-US`);
            const credData = await credRes.json();

            let movies = credData.cast?.filter(m => m.poster_path) || [];
            console.log("Cast credits count:", movies.length);

            movies.sort((a, b) => b.popularity - a.popularity);
            console.log("Top 3 movies:", movies.slice(0, 3).map(m => m.title));
        }
    } catch (e) { console.error(e) }
}
run();
