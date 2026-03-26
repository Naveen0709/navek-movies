import axios from "axios";
import fs from "fs";

const API_KEY = "eb46ebb646eea7183b734797b40cb202";

const actors = [
    "Rajinikanth", "Kamal Haasan", "Vijay", "Ajith Kumar", "Suriya", "Vikram", "Dhanush", "Karthi", "Sivakarthikeyan", "Vijay Sethupathi",
    "Leonardo DiCaprio", "Robert Downey Jr.", "Tom Cruise", "Brad Pitt", "Denzel Washington", "Will Smith", "Johnny Depp", "Christian Bale", "Keanu Reeves", "Ryan Gosling",
    "Lee Min-ho", "Gong Yoo", "Song Joong-ki", "Lee Jong-suk", "Kim Soo-hyun", "Park Seo-joon", "Hyun Bin", "Ji Chang-wook", "Lee Dong-wook", "Cha Eun-woo",
    "Shah Rukh Khan", "Salman Khan", "Aamir Khan", "Ranbir Kapoor", "Ranveer Singh", "Akshay Kumar", "Hrithik Roshan", "Ajay Devgn", "Varun Dhawan", "Tiger Shroff",
    "Prabhas", "Mahesh Babu", "Allu Arjun", "Ram Charan", "Jr. NTR", "Pawan Kalyan", "Chiranjeevi", "Nagarjuna", "Nani", "Vijay Deverakonda"
];

const actresses = [
    "Scarlett Johansson", "Jennifer Lawrence", "Angelina Jolie", "Margot Robbie", "Emma Stone", "Natalie Portman", "Gal Gadot", "Anne Hathaway", "Charlize Theron", "Ana de Armas",
    "Deepika Padukone", "Alia Bhatt", "Priyanka Chopra", "Katrina Kaif", "Kareena Kapoor", "Shraddha Kapoor", "Kiara Advani", "Anushka Sharma", "Kriti Sanon", "Bhumi Pednekar",
    "Nayanthara", "Trisha Krishnan", "Samantha Ruth Prabhu", "Keerthy Suresh", "Sai Pallavi", "Tamannaah Bhatia", "Kajal Aggarwal", "Jyothika", "Aishwarya Rajesh", "Amala Paul",
    "Rashmika Mandanna", "Pooja Hegde", "Anushka Shetty", "Rakul Preet Singh", "Sreeleela",
    "Song Hye-kyo", "Jun Ji-hyun", "Kim Tae-ri", "Bae Suzy", "Park Shin-hye", "Kim Ji-won", "Son Ye-jin", "Han So-hee", "IU (Lee Ji-eun)", "Kim Go-eun"
];

const directors = [
    "Steven Spielberg", "Christopher Nolan", "Quentin Tarantino", "Martin Scorsese", "James Cameron", "David Fincher", "Ridley Scott", "Denis Villeneuve", "Zack Snyder", "Tim Burton",
    "Rajkumar Hirani", "Sanjay Leela Bhansali", "Karan Johar", "Rohit Shetty", "Anurag Kashyap", "Kabir Khan", "Zoya Akhtar", "Farhan Akhtar", "Ayan Mukerji", "Imtiaz Ali",
    "Mani Ratnam", "Shankar", "Lokesh Kanagaraj", "Atlee", "Nelson Dilipkumar", "Vetrimaaran", "Karthik Subbaraj", "Gautham Vasudev Menon", "Bala", "Pa. Ranjith",
    "S. S. Rajamouli", "Sukumar", "Trivikram Srinivas", "Koratala Siva", "Puri Jagannadh", "Boyapati Srinu", "Vamshi Paidipally", "Krish Jagarlamudi", "Sekhar Kammula", "Anil Ravipudi"
];

const comedians = [
    "Vadivelu", "Santhanam", "Goundamani", "Senthil", "Vivek", "Yogi Babu", "Soori",
    "Brahmanandam", "Vennela Kishore", "Sunil", "Ali",
    "Johnny Lever", "Rajpal Yadav", "Paresh Rawal", "Kapil Sharma",
    "Rowan Atkinson", "Jim Carrey", "Kevin Hart", "Adam Sandler", "Jack Black"
];

const fetchPerson = async (name) => {
    try {
        const res = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`);
        if (res.data.results && res.data.results.length > 0) {
            const person = res.data.results[0];
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
    // Fallback
    return {
        name,
        image: `https://via.placeholder.com/300x450.png?text=${encodeURIComponent(name)}`
    };
};

const processList = async (list) => {
    const result = [];
    // Use a slow map or sequential to avoid rate limits broadly, though TMDB allows 50req/s
    for (const name of list) {
        const data = await fetchPerson(name);
        result.push(data);
        await new Promise(r => setTimeout(r, 50)); // small delay
    }
    return result;
};

const run = async () => {
    console.log("Fetching actors...");
    const actorsData = await processList(Array.from(new Set(actors))); // deduplicate
    console.log("Fetching actresses...");
    const actressesData = await processList(Array.from(new Set(actresses)));
    console.log("Fetching directors...");
    const directorsData = await processList(Array.from(new Set(directors)));
    console.log("Fetching comedians...");
    const comediansData = await processList(Array.from(new Set(comedians)));

    const output = `
export const actors = ${JSON.stringify(actorsData, null, 2)};

export const actresses = ${JSON.stringify(actressesData, null, 2)};

export const directors = ${JSON.stringify(directorsData, null, 2)};

export const comedians = ${JSON.stringify(comediansData, null, 2)};
    `;

    fs.writeFileSync("../frontend/src/data/starsData.js", output);
    console.log("Successfully wrote data to starsData.js");
};

run();
