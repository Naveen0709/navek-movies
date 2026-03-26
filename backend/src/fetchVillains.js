import fs from 'fs';
import axios from 'axios';

const API_KEY = "eb46ebb646eea7183b734797b40cb202";

const villainsList = [
    // Hollywood
    "Heath Ledger", "Joaquin Phoenix", "Anthony Hopkins", "Ralph Fiennes", "Christoph Waltz",
    "Javier Bardem", "Mads Mikkelsen", "Tom Hiddleston", "Willem Dafoe", "Josh Brolin",
    // Bollywood
    "Amjad Khan", "Amrish Puri", "Gulshan Grover", "Prakash Raj", "Nawazuddin Siddiqui",
    "Sanjay Dutt", "Ashutosh Rana", "Sonu Sood", "Rahul Dev", "Pran",
    // Kollywood
    "Raghuvaran", "S. J. Suryah", "Fahadh Faasil", "Arvind Swamy",
    "Bobby Simha", "Daniel Balaji", "Mansoor Ali Khan", "Arjun Sarja", "Nana Patekar",
    // Telugu
    "Jagapathi Babu", "Rana Daggubati", "Rao Ramesh", "Mukesh Rishi", "Sayaji Shinde",
    "Ashish Vidyarthi", "Kabir Duhan Singh", "Tarun Arora", "Sampath Raj", "Subbaraju",
    // Korean
    "Choi Min-sik", "Yoo Ji-tae", "Heo Sung-tae", "Park Sung-woong", "Yoo Jae-myung",
    "Jung Woong-in", "Kim Sung-oh", "Uhm Ki-joon", "Lee Jung-jae", "Ahn Bo-hyun"
];

const processList = async (list) => {
    const result = [];
    for (const name of list) {
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`);
            if (res.data.results && res.data.results.length > 0) {
                const sorted = res.data.results.sort((a, b) => b.popularity - a.popularity);
                // Try to find first one with a profile path
                const person = sorted.find(p => p.profile_path) || sorted[0];
                if (person.profile_path) {
                    result.push({
                        name: name,
                        image: `https://image.tmdb.org/t/p/w500${person.profile_path}`
                    });
                } else {
                    console.log("No profile path for", name);
                }
            } else {
                console.log("No results for", name);
            }
        } catch (e) {
            console.error("Error fetching", name, e.message);
        }
    }
    return result;
};

const run = async () => {
    console.log("Fetching Villains...");
    const villainsData = await processList([...new Set(villainsList)]);

    let content = fs.readFileSync("../frontend/src/data/starsData.js", "utf-8");

    // Let's replace the whole file if villains is already there, or append
    if (content.includes("export const villains")) {
        console.log("Villains already exist, cleaning old...");
        content = content.replace(/export const villains = \[[\s\S]*?\];\n?/g, "");
    }

    content += "\nexport const villains = " + JSON.stringify(villainsData, null, 2) + ";\n";
    fs.writeFileSync("../frontend/src/data/starsData.js", content);
    console.log(`Successfully added ${villainsData.length} villains to starsData.js!`);
}
run();
