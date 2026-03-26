
const fs = require('fs');
const axios = require('axios');

const TMDB_API_KEY = "eb46ebb646eea7183b734797b40cb202";

async function getTP(name) {
    try {
        const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`);
        if (res.data.results && res.data.results[0]) {
            return `https://image.tmdb.org/t/p/w500${res.data.results[0].profile_path}`;
        }
    } catch (e) {
        console.error("Fail for " + name);
    }
    return null;
}

const maleMusicians = [
  "Hans Zimmer", "John Williams", "Ludwig Göransson", "Howard Shore", "Danny Elfman", "James Horner", "Alan Silvestri", "Michael Giacchino", "Ennio Morricone", "Alexandre Desplat",
  "A.R. Rahman", "Anirudh Ravichander", "Ilaiyaraaja", "Harris Jayaraj", "Yuvan Shankar Raja", "Santhosh Narayanan", "G.V. Prakash Kumar", "D. Imman", "Vidyasagar", "Sam C.S.",
  "M.M. Keeravani", "Devi Sri Prasad", "S. Thaman", "Mani Sharma", "Mickey J. Meyer", "Vivek Sagar", "Chakri", "Radhan", "R.P. Patnaik", "Anup Rubens",
  "Pritam", "Amit Trivedi", "Himesh Reshammiya", "Vishal Dadlani", "Shekhar Ravjiani", "Shankar Mahadevan", "Mithoon", "Salim Merchant", "Anu Malik", "Sandesh Shandilya",
  "Jo Yeong-wook", "Jung Jae-il", "Lee Byung-woo", "Mowg", "Dalpalan", "Kim Joon-seok", "Bang Jun-seok", "Ryuichi Sakamoto", "Park Jin-young", "Seo Taiji"
];

const femaleMusicians = [
  "Shreya Ghoshal", "Sunidhi Chauhan", "K.S. Chithra", "P. Susheela", "S. Janaki", "Sujatha Mohan", "Chinmayi Sripaada", "Jonita Gandhi", "Neeti Mohan", "Alka Yagnik",
  "IU", "Taylor Swift", "Billie Eilish", "Lady Gaga", "Beyoncé", "Adele", "Rihanna", "Dua Lipa", "Ariana Grande", "Olivia Rodrigo"
];

async function run() {
    console.log("Starting Male Musicians...");
    const maleResults = [];
    for (const name of maleMusicians) {
        const img = await getTP(name);
        maleResults.push({ name, image: img || "https://via.placeholder.com/500x750?text=Musician" });
        console.log("Done: " + name);
    }

    console.log("Starting Female Musicians...");
    const femaleResults = [];
    for (const name of femaleMusicians) {
        const img = await getTP(name);
        femaleResults.push({ name, image: img || "https://via.placeholder.com/500x750?text=Musician" });
        console.log("Done: " + name);
    }

    const output = `
export const maleMusicians = ${JSON.stringify(maleResults, null, 2)};
export const femaleMusicians = ${JSON.stringify(femaleResults, null, 2)};
    `;
    fs.writeFileSync('musicians_fixed.js', output);
    console.log("Finished!");
}

run();
