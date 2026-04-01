const https = require('https');

https.get('https://api.themoviedb.org/3/search/person?api_key=eb46ebb646eea7183b734797b40cb202&query=Vijay', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        const json = JSON.parse(data);
        const results = json.results;
        console.log(results.map(r => r.name + " (" + r.id + ") pop:" + r.popularity));
    });
});
