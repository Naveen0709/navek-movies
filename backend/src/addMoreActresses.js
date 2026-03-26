import axios from "axios";
import fs from "fs";

const API_KEY = "eb46ebb646eea7183b734797b40cb202";

const EXTRA_ACTRESSES = [
    "Sai Pallavi", "Tamannaah Bhatia", "Kajal Aggarwal", "Jyothika", "Aishwarya Rajesh", "Amala Paul",
    "Rashmika Mandanna", "Pooja Hegde", "Anushka Shetty", "Rakul Preet Singh", "Sreeleela",
    "Song Hye-kyo", "Jun Ji-hyun", "Kim Tae-ri", "Bae Suzy", "Park Shin-hye", "Kim Ji-won", "Son Ye-jin", "Han So-hee", "IU (Lee Ji-eun)", "Kim Go-eun",
    "Hansika Motwani", "Regina Cassandra", "Nithya Menen", "Andrea Jeremiah", "Shruti Haasan", "Raashii Khanna", "Malavika Mohanan", "Priyanka Mohan", "Meenakshi Chaudhary", "Srinidhi Shetty",
    "Kriti Shetty", "Nivetha Pethuraj", "Anupama Parameswaran", "Sai Tamhankar", "Amruta Khanvilkar", "Mrunal Thakur", "Yami Gautam", "Kiara Advani", "Disha Patani", "Aditi Rao Hydari",
    "Sonakshi Sinha", "Vidya Balan", "Taapsee Pannu", "Parineeti Chopra", "Janhvi Kapoor", "Sara Ali Khan", "Ananya Panday", "Nora Fatehi", "Jacqueline Fernandez", "Urvashi Rautela"
];

const fetchPerson = async (name) => {
    try {
        const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`);
        if (res.data.results && res.data.results.length > 0) {
            const person = res.data.results.sort((a,b) => b.popularity - a.popularity)[0];
            if (person.profile_path) {
                return {
                    name,
                    image: `https://image.tmdb.org/t/p/w500${person.profile_path}`
                };
            }
        }
    } catch (err) {
        console.error(`Error fetching ${name}:`, err.message);
    }
    return { name, image: `https://via.placeholder.com/300x450.png?text=${encodeURIComponent(name)}` };
};

const run = async () => {
    const dataPath = "frontend/src/data/starsData.js";
    // I already have actresses, I'll just add these extra ones if they are not already there
    let content = fs.readFileSync(dataPath, "utf8");
    
    // Extraction (shaky, but let's assume it's there)
    const match = content.match(/export const actresses = (\[[\s\S]*?\]);/);
    if (!match) return;
    
    const existing = JSON.parse(match[1]);
    const existingNames = new Set(existing.map(a => a.name));
    
    const toAdd = EXTRA_ACTRESSES.filter(name => !existingNames.has(name));
    console.log(`Adding ${toAdd.length} new actresses...`);
    
    const newActors = [];
    for(const name of toAdd) {
        const data = await fetchPerson(name);
        newActors.push(data);
        await new Promise(r => setTimeout(r, 100));
    }
    
    const updatedActresses = [...existing, ...newActors];
    const newContent = content.replace(/export const actresses = \[[\s\S]*?\];/, `export const actresses = ${JSON.stringify(updatedActresses, null, 2)};`);
    
    fs.writeFileSync(dataPath, newContent);
    console.log("Successfully added extra actresses!");
};

run();
