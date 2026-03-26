import axios from "axios";
import fs from "fs";
import path from "path";

const API_KEY = "eb46ebb646eea7183b734797b40cb202";

// Absolute Paths (Windows)
const rootDir = "e:\\prime video";
const starsDataPath = path.join(rootDir, "frontend", "src", "data", "starsData.js");

const categories = ["actors", "actresses", "directors", "comedians", "villains", "maleMusicians", "femaleMusicians"];

const fetchPerson = async (name) => {
    try {
        const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`);
        if (res.data.results && res.data.results.length > 0) {
            const sorted = res.data.results.sort((a,b) => b.popularity - a.popularity);
            const person = sorted[0];
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
    return {
        name,
        image: `https://via.placeholder.com/300x450.png?text=${encodeURIComponent(name)}`
    };
};

const processCategory = async (list) => {
    const result = [];
    for (const person of list) {
        if (!person.name) continue;
        const data = await fetchPerson(person.name);
        result.push(data);
        await new Promise(r => setTimeout(r, 80)); 
    }
    return result;
};

const run = async () => {
    if (!fs.existsSync(starsDataPath)) {
        console.error("File not found:", starsDataPath);
        process.exit(1);
    }

    let content = fs.readFileSync(starsDataPath, "utf-8");
    
    const finalData = {};
    for (const cat of categories) {
        console.log(`Processing ${cat}...`);
        
        // Extract names using regex
        const startMarker = `export const ${cat} = [`;
        const startIdx = content.indexOf(startMarker);
        if (startIdx === -1) {
            finalData[cat] = [];
            continue;
        }
        
        // Find the ending ]
        let bracketCount = 0;
        let endIdx = -1;
        for (let i = startIdx + startMarker.length - 1; i < content.length; i++) {
            if (content[i] === '[') bracketCount++;
            else if (content[i] === ']') {
                bracketCount--;
                if (bracketCount === 0) {
                    endIdx = i;
                    break;
                }
            }
        }
        
        if (endIdx === -1) {
            finalData[cat] = [];
            continue;
        }

        const arrayContent = content.substring(startIdx + startMarker.length - 1, endIdx + 1);
        try {
            // Clean up potentially trailing commas or single quotes for JSON parse if needed
            // But if it's already well-formatted JSON-like array, it should be fine.
            const namesList = JSON.parse(arrayContent);
            finalData[cat] = await processCategory(namesList);
        } catch(e) {
            console.warn(`JSON Parse fail for ${cat}, trying simpler extraction...`);
            // Fallback: search for "name": "..."
            const namesMatched = [];
            const nameRegex = /"name":\s*"(.*?)"/g;
            let m;
            while ((m = nameRegex.exec(arrayContent)) !== null) {
                namesMatched.push({ name: m[1] });
            }
            finalData[cat] = await processCategory(namesMatched);
        }
    }

    let output = "";
    for (const cat of categories) {
        output += `export const ${cat} = ${JSON.stringify(finalData[cat], null, 2)};\n\n`;
    }

    fs.writeFileSync(starsDataPath, output);
    console.log("Successfully refreshed all stars and creators images from TMDB.");
};

run();
