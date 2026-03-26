import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";

dotenv.config();

const movies = [
    // Slider 1: Indian
    { title: "Salaar", poster: "/rec1/salaar.jpg", trailerId: "4GPvY7_8S1s", cast: "Prabhas", director: "Prashanth Neel", genre: "Indian, Action", rating: "8.3", year: "2023", runtime: "2h 55m", description: "A gang leader makes a promise to a dying friend." },
    { title: "KGF: Chapter 2", poster: "/rec1/kgf.jpg", trailerId: "q6rrVvshfUo", cast: "Yash", director: "Prashanth Neel", genre: "Indian, Action", rating: "8.4", year: "2022", runtime: "2h 48m", description: "Blood-soaked Kolar Gold Fields has a new overlord." },
    { title: "Animal", poster: "/rec1/animal.jpg", trailerId: "8FkLRUJj-C0", cast: "Ranbir Kapoor", director: "Sandeep Vanga", genre: "Indian, Action", rating: "8.1", year: "2023", runtime: "3h 21m", description: "A son's obsessive love leads to transformation." },
    { title: "777 Charlie", poster: "/rec1/dhurandar.jpg", trailerId: "fT-l6K7K44A", cast: "Rakshit Shetty", director: "Kiranraj K", genre: "Indian, Drama", rating: "8.8", year: "2022", runtime: "2h 44m", description: "Dharma is stuck in a negative lifestyle." },
    { title: "Enthiran", poster: "/rec1/enthiran.jpg", trailerId: "fT-l6K7K44A", cast: "Rajinikanth", director: "S. Shankar", genre: "Indian, Sci-Fi", rating: "7.1", year: "2010", runtime: "2h 57m", description: "A humanoid robot develops human emotions." },
    { title: "Leo", poster: "/rec1/leo.jpg", trailerId: "ozX0_Vf6vS8", cast: "Vijay", director: "Lokesh Kanagaraj", genre: "Indian, Action", rating: "7.9", year: "2023", runtime: "2h 44m", description: "A cafe owner becomes a local hero." },
    { title: "Minnal Murali", poster: "/rec1/minnalmurali.jpg", trailerId: "z7st7Wz_pI8", cast: "Tovino Thomas", director: "Basil Joseph", genre: "Indian, Superhero", rating: "7.8", year: "2021", runtime: "2h 38m", description: "A tailor gains superpowers after lightning strike." },
    { title: "Pushpa: The Rise", poster: "/rec1/pushpa.jpg", trailerId: "pKct8j8TzH4", cast: "Allu Arjun", director: "Sukumar", genre: "Indian, Action", rating: "7.6", year: "2021", runtime: "2h 59m", description: "A laborer rises through sandalwood syndicate." },
    { title: "Vikram", poster: "/rec1/vikram.jpg", trailerId: "OKBMCL-umis", cast: "Kamal Haasan", director: "Lokesh Kanagaraj", genre: "Indian, Action", rating: "8.3", year: "2022", runtime: "2h 55m", description: "A team hunts for mask-wearing vigilantes." },
    { title: "Mankatha", poster: "/rec1/mankatha.jpg", trailerId: "fVfN2q_9D3o", cast: "Ajith Kumar", director: "Venkat Prabhu", genre: "Indian, Action", rating: "7.7", year: "2011", runtime: "2h 40m", description: "A suspended officer plans a high-stakes heist." },

    // Slider 2: Korean
    { title: "Train to Busan", poster: "/rec2/traintobusan.jpg", trailerId: "pyWuHv2-j6U", cast: "Gong Yoo", director: "Yeon Sang-ho", genre: "Korean, Horror", rating: "7.6", year: "2016", runtime: "1h 58m", description: "Passengers struggle on a zombie-infested train." },
    { title: "Parasite", poster: "/rec2/parasite.jpg", trailerId: "5xH0HfJHsaY", cast: "Song Kang-ho", director: "Bong Joon-ho", genre: "Korean, Thriller", rating: "8.5", year: "2019", runtime: "2h 12m", description: "A poor family schemes to work for the wealthy." },
    { title: "Oldboy", poster: "/rec2/oldboy.jpg", trailerId: "VwIIDzR19Qw", cast: "Choi Min-sik", director: "Park Chan-wook", genre: "Korean, Thriller", rating: "8.4", year: "2003", runtime: "2h 00m", description: "A man seeks revenge after 15 years of kidnap." },
    { title: "Handmaiden", poster: "/rec2/handmaiden.jpg", trailerId: "Iu1S7zK-0S8", cast: "Kim Tae-ri", director: "Park Chan-wook", genre: "Korean, Romance", rating: "8.1", year: "2016", runtime: "2h 25m", description: "A woman hired as handmaiden to a Japanese heiress." },
    { title: "Holy Night", poster: "/rec2/holynight.jpg", trailerId: "fT-l6K7K44A", cast: "Ma Dong-seok", director: "Lim Dae-hee", genre: "Korean, Action", rating: "7.0", year: "2024", runtime: "1h 50m", description: "A team of demon hunters battle dark forces." },
    { title: "Wall to Wall", poster: "/rec2/walltowall.jpg", trailerId: "fT-l6K7K44A", cast: "Kang Ha-neul", director: "Kim Tae-joon", genre: "Korean, Thriller", rating: "7.1", year: "2024", runtime: "1h 48m", description: "A man discovers something strange in his apartment walls." },
    { title: "Memories of Murder", poster: "/rec2/memoriesofmurder.jpg", trailerId: "xwWd5mNlXLk", cast: "Song Kang-ho", director: "Bong Joon-ho", genre: "Korean, Mystery", rating: "8.1", year: "2003", runtime: "2h 12m", description: "Two detectives struggle with the case of a serial killer." },
    { title: "Hi-Five", poster: "/rec2/hifive.jpg", trailerId: "xwWd5mNlXLk", cast: "Yoo Ah-in", director: "Kang Hyeong-cheol", genre: "Korean, Fantasy", rating: "7.2", year: "2024", runtime: "2h 05m", description: "Five ordinary people gain superpowers." },
    { title: "Silenced", poster: "/rec2/silenced.jpg", trailerId: "xwWd5mNlXLk", cast: "Gong Yoo", director: "Hwang Dong-hyuk", genre: "Korean, Drama", rating: "8.0", year: "2011", runtime: "2h 05m", description: "A teacher uncovers abuse at a school for the deaf." },
    { title: "Great Flood", poster: "/rec2/greatflood.jpg", trailerId: "xwWd5mNlXLk", cast: "Kim Da-mi", director: "Kim Byung-woo", genre: "Korean, Sci-Fi", rating: "6.8", year: "2024", runtime: "2h 00m", description: "People struggle to survive on the last day of Earth." },

    // Slider 3: Action
    { title: "John Wick", poster: "/rec3/johnwick.jpg", trailerId: "qEVUrkHuqt8", cast: "Keanu Reeves", director: "Chad Stahelski", genre: "Action, Crime", rating: "7.7", year: "2014", runtime: "1h 41m", description: "An ex-hitman comes out of retirement." },
    { title: "Mad Max", poster: "/rec3/madmax.jpg", trailerId: "hEJnMQG9ev8", cast: "Tom Hardy", director: "George Miller", genre: "Action, Adventure", rating: "8.1", year: "2015", runtime: "2h 00m", description: "In a wasteland, a woman rebels against a tyrant." },
    { title: "Bullet Train", poster: "/rec3/bullettrain.jpg", trailerId: "0IOsk2Vlc4o", cast: "Brad Pitt", director: "David Leitch", genre: "Action, Comedy", rating: "7.3", year: "2022", runtime: "2h 06m", description: "Five assassins on a train find missions related." },
    { title: "Pacific Rim", poster: "/rec3/pacificrim.jpg", trailerId: "5guMumP759M", cast: "Idris Elba", director: "Guillermo del Toro", genre: "Action, Sci-Fi", rating: "6.9", year: "2013", runtime: "2h 11m", description: "Humanity uses robots to battle monsters." },
    { title: "Alita", poster: "/rec3/alita.jpg", trailerId: "w7pYhpJaJW8", cast: "Rosa Salazar", director: "Robert Rodriguez", genre: "Action, Sci-Fi", rating: "7.3", year: "2019", runtime: "2h 02m", description: "A deactivated cyborg is revived." },
    { title: "Ballerina", poster: "/rec3/ballerina.jpg", trailerId: "fT-l6K7K44A", cast: "Jeon Jong-seo", director: "Lee Chung-hyun", genre: "Action, Thriller", rating: "6.2", year: "2023", runtime: "1h 32m", description: "A former bodyguard seeks revenge." },
    { title: "Kill Bill", poster: "/rec3/killbill.jpg", trailerId: "7kSuas6mRfk", cast: "Uma Thurman", director: "Quentin Tarantino", genre: "Action, Crime", rating: "8.2", year: "2003", runtime: "1h 51m", description: "The Bride seeks revenge." },
    { title: "Mortal Kombat", poster: "/rec3/mortalkombat.jpg", trailerId: "jBa_aHwCbC4", cast: "Lewis Tan", director: "Simon McQuoid", genre: "Action, Fantasy", rating: "6.0", year: "2021", runtime: "1h 50m", description: "MMA fighter Cole Young seeks out Earth's champions." },
    { title: "Sisu", poster: "/rec3/sisu.jpg", trailerId: "d2k4QAItiSA", cast: "Jorma Tommila", director: "Jalmari Helander", genre: "Action, War", rating: "6.9", year: "2022", runtime: "1h 31m", description: "A gold miner battles a Nazi death squad." },
    { title: "Transformers", poster: "/rec3/transformers.jpg", trailerId: "avz06igbm0M", cast: "Shia LaBeouf", director: "Michael Bay", genre: "Action, Sci-Fi", rating: "7.0", year: "2007", runtime: "2h 24m", description: "Autobots vs Decepticons." },

    // Slider 4: Horror
    { title: "The Conjuring", poster: "/rec4/conjuring.jpg", trailerId: "k10ETZ41q5o", cast: "Vera Farmiga", director: "James Wan", genre: "Horror", rating: "7.5", year: "2013", runtime: "1h 52m", description: "Investigators help a family terrorized by dark presence." },
    { title: "IT", poster: "/rec4/itchapter1.jpg", trailerId: "hAUTdjf9rko", cast: "Bill Skarsgard", director: "Andy Muschietti", genre: "Horror", rating: "7.3", year: "2017", runtime: "2h 15m", description: "Bullied kids band together to destroy a monster." },
    { title: "Midsommar", poster: "/rec4/midsommar.jpg", trailerId: "I0-fJ0yK3D0", cast: "Florence Pugh", director: "Ari Aster", genre: "Horror, Drama", rating: "7.1", year: "2019", runtime: "2h 28m", description: "Couple travels to Sweden for a fabled festival." },
    { title: "Evil Dead Rise", poster: "/rec4/evildead.jpg", trailerId: "BqQMCqcXzrg", cast: "Lily Sullivan", director: "Lee Cronin", genre: "Horror", rating: "6.5", year: "2023", runtime: "1h 36m", description: "Two sisters find a mysterious book." },
    { title: "Hostel", poster: "/rec4/hostel.jpg", trailerId: "fT-l6K7K44A", cast: "Jay Hernandez", director: "Eli Roth", genre: "Horror", rating: "5.9", year: "2005", runtime: "1h 34m", description: "Backpackers visit a city with a dark secret." },
    { title: "Terrifier", poster: "/rec4/terrifier.jpg", trailerId: "fT-l6K7K44A", cast: "Jenna Kanell", director: "Damien Leone", genre: "Horror", rating: "5.6", year: "2016", runtime: "1h 22m", description: "A maniacal clown terrorizes three young women." },
    { title: "The Substance", poster: "/rec4/thesubstance.jpg", trailerId: "fT-l6K7K44A", cast: "Demi Moore", director: "Coralie Fargeat", genre: "Horror, Drama", rating: "7.5", year: "2024", runtime: "2h 20m", description: "A celebrity takes a cell-replicating drug." },
    { title: "Until Dawn", poster: "/rec4/untildawn.jpg", trailerId: "fT-l6K7K44A", cast: "Peter Stormare", director: "David F. Sandberg", genre: "Horror", rating: "6.8", year: "2024", runtime: "1h 45m", description: "Eight friends are trapped in a remote mountain retreat." },
    { title: "Wrong Turn", poster: "/rec4/wrongturn.jpg", trailerId: "fT-l6K7K44A", cast: "Eliza Dushku", director: "Rob Schmidt", genre: "Horror", rating: "6.1", year: "2003", runtime: "1h 24m", description: "Cannibalistic mountain men hunt travelers." },
    { title: "28 Years Later", poster: "/rec4/28yearslater.jpg", trailerId: "fT-l6K7K44A", cast: "Cillian Murphy", director: "Danny Boyle", genre: "Horror, Sci-Fi", rating: "7.8", year: "2025", runtime: "1h 55m", description: "The original post-apocalyptic saga continues." },

    // Slider 5: Comedy
    { title: "The Hangover", poster: "/rec5/hangover.jpg", trailerId: "tcdUhdOlz9M", cast: "Bradley Cooper", director: "Todd Phillips", genre: "Comedy", rating: "7.7", year: "2009", runtime: "1h 40m", description: "Buddies wake up with no memory of party." },
    { title: "Kung Fu Hustle", poster: "/rec5/kungfuhustle.jpg", trailerId: "-_2S_6E-0C4", cast: "Stephen Chow", director: "Stephen Chow", genre: "Comedy, Action", rating: "7.7", year: "2004", runtime: "1h 39m", description: "Wannabe gangster aspires to join the Axe Gang." },
    { title: "American Pie", poster: "/rec5/americanpie.jpg", trailerId: "iUZ3Yxok6N8", cast: "Jason Biggs", director: "Paul Weitz", genre: "Comedy", rating: "7.0", year: "1999", runtime: "1h 35m", description: "Four teenagers make a pact to lose their virginity." },
    { title: "Baywatch", poster: "/rec5/baywatch.jpg", trailerId: "eyKOgnaf0BU", cast: "Dwayne Johnson", director: "Seth Gordon", genre: "Comedy, Action", rating: "5.5", year: "2017", runtime: "1h 56m", description: "Lifeguards uncover a local criminal plot." },
    { title: "The Dictator", poster: "/rec5/dictator.jpg", trailerId: "fT-l6K7K44A", cast: "Sacha Baron Cohen", director: "Larry Charles", genre: "Comedy", rating: "6.4", year: "2012", runtime: "1h 23m", description: "The heroic story of a dictator who risks his life." },
    { title: "Red Notice", poster: "/rec5/rednotice.jpg", trailerId: "T6l3nM7mw_Y", cast: "The Rock", director: "Rawson Marshall Thurber", genre: "Comedy, Action", rating: "6.3", year: "2021", runtime: "1h 58m", description: "An FBI profiler teams up with a thief." },
    { title: "Rush Hour", poster: "/rec5/rushhour.jpg", trailerId: "JMiFsFQcFLE", cast: "Jackie Chan", director: "Brett Ratner", genre: "Comedy, Action", rating: "7.0", year: "1998", runtime: "1h 38m", description: "Two mismatched cops join forces." },
    { title: "Scary Movie", poster: "/rec5/scarymovie.jpg", trailerId: "fT-l6K7K44A", cast: "Anna Faris", director: "Keenen Ivory Wayans", genre: "Comedy, Horror", rating: "6.3", year: "2000", runtime: "1h 28m", description: "A group of teenagers are stalked." },
    { title: "Wolf of Wall Street", poster: "/rec5/wolfofwallstreet.jpg", trailerId: "iszwuX1AK6A", cast: "Leo DiCaprio", director: "Martin Scorsese", genre: "Comedy, Crime", rating: "8.2", year: "2013", runtime: "3h 00m", description: "Based on the true story of Jordan Belfort." },
    { title: "Central Intelligence", poster: "/rec5/centralintelligence.jpg", trailerId: "fT-l6K7K44A", cast: "Kevin Hart", director: "Rawson Marshall Thurber", genre: "Comedy, Action", rating: "6.3", year: "2016", runtime: "1h 47m", description: "A CIA agent recruits an old friend." },

    // Slider 6: Superhero
    { title: "Endgame", poster: "/rec6/endgame.jpg", trailerId: "TcMBFSGZo1E", cast: "Robert Downey Jr", director: "Russo", genre: "Superhero, Action", rating: "8.4", year: "2019", runtime: "3h 01m", description: "Avengers assemble once more to undo Thanos." },
    { title: "No Way Home", poster: "/rec6/nowayhome.jpg", trailerId: "JfVOs4VSpmA", cast: "Tom Holland", director: "Jon Watts", genre: "Superhero, Action", rating: "8.2", year: "2021", runtime: "2h 28m", description: "Peter asks Strange for help." },
    { title: "The Batman", poster: "/rec6/batman.jpg", trailerId: "dgC9Q0uhX70", cast: "Robert Pattinson", director: "Matt Reeves", genre: "Superhero, Action", rating: "7.8", year: "2022", runtime: "2h 56m", description: "Batman investigates Gotham's corruption." },
    { title: "Deadpool", poster: "/rec6/deadpool.jpg", trailerId: "ONHBaC-HUsl", cast: "Ryan Reynolds", director: "Tim Miller", genre: "Superhero, Action", rating: "8.0", year: "2016", runtime: "1h 48m", description: "Mercenary becomes immortal." },
    { title: "Wonder Woman", poster: "/rec6/wonderwoman.jpg", trailerId: "1Q8fG0TtVAY", cast: "Gal Gadot", director: "Patty Jenkins", genre: "Superhero", rating: "7.4", year: "2017", runtime: "2h 21m", description: "Amazon pilot." },
    { title: "Aquaman", poster: "/rec6/aquaman.jpg", trailerId: "WDkg3h8PCVU", cast: "Jason Momoa", director: "James Wan", genre: "Superhero", rating: "6.8", year: "2018", runtime: "2h 23m", description: "Arthur Curry." },
    { title: "Justice League", poster: "/rec6/justiceleague.jpg", trailerId: "3cxixDgszY4", cast: "Ben Affleck", director: "Zack Snyder", genre: "Superhero", rating: "6.1", year: "2017", runtime: "2h 00m", description: "Zack Snyder's." },
    { title: "Krrish", poster: "/rec6/krish.jpg", trailerId: "fT-l6K7K44A", cast: "Hrithik Roshan", director: "Rakesh Roshan", genre: "Superhero", rating: "6.4", year: "2006", runtime: "2h 30m", description: "Indian superhero." },
    { title: "Superman", poster: "/rec6/superman.jpg", trailerId: "T6DJcgm3wNY", cast: "Henry Cavill", director: "Zack Snyder", genre: "Superhero", rating: "7.1", year: "2013", runtime: "2h 23m", description: "Man of Steel." },
    { title: "X-Men", poster: "/rec6/xmen.jpg", trailerId: "h_VvXisZon8", cast: "Hugh Jackman", director: "Bryan Singer", genre: "Superhero", rating: "7.3", year: "2000", runtime: "1h 44m", description: "School for gifted." },

    // Slider 7: Sci-Fi
    { title: "Interstellar", poster: "/rec7/interstellar.jpg", trailerId: "zSWdZVtXT7E", cast: "Matthew McConaughey", director: "Nolan", genre: "Sci-Fi, Drama", rating: "8.7", year: "2014", runtime: "2h 49m", description: "Researchers travel through a wormhole." },
    { title: "Tenet", poster: "/rec7/tenet.jpg", trailerId: "L3pk_TBkihU", cast: "John David Washington", director: "Nolan", genre: "Sci-Fi, Action", rating: "7.3", year: "2020", runtime: "2h 30m", description: "Twilight world." },
    { title: "Avatar", poster: "/rec7/avatar.jpg", trailerId: "d9MyW72ELq0", cast: "Sam Worthington", director: "Cameron", genre: "Sci-Fi, Action", rating: "7.9", year: "2009", runtime: "2h 42m", description: "Na'vi race." },
    { title: "Blade Runner", poster: "/rec7/bladerunner.jpg", trailerId: "gCcx85zFxMs", cast: "Ryan Gosling", director: "Villeneuve", genre: "Sci-Fi", rating: "8.0", year: "2017", runtime: "2h 44m", description: "2049." },
    { title: "Free Guy", poster: "/rec7/freeguy.jpg", trailerId: "X2m-08c_uS8", cast: "Ryan Reynolds", director: "Shawn Levy", genre: "Sci-Fi, Comedy", rating: "7.1", year: "2021", runtime: "1h 55m", description: "Video game." },
    { title: "Jurassic World", poster: "/rec7/jurassicworldrebirth.jpg", trailerId: "fT-l6K7K44A", cast: "Chris Pratt", director: "Edwards", genre: "Sci-Fi, Action", rating: "7.0", year: "2025", runtime: "2h 00m", description: "Rebirth." },
    { title: "Ready Player One", poster: "/rec7/readyplayerone.jpg", trailerId: "cSp1dM2Vj48", cast: "Tye Sheridan", director: "Spielberg", genre: "Sci-Fi", rating: "7.4", year: "2018", runtime: "2h 20m", description: "OASIS." },
    { title: "Terminator", poster: "/rec7/terminator.jpg", trailerId: "k64P4l2Wmeg", cast: "Arnold", director: "Cameron", genre: "Sci-Fi", rating: "8.1", year: "1984", runtime: "1h 47m", description: "I'll be back." },
    { title: "Frankenstein", poster: "/rec7/frankenstien.jpg", trailerId: "fT-l6K7K44A", cast: "James McAvoy", director: "McGuigan", genre: "Sci-Fi", rating: "6.0", year: "2015", runtime: "1h 50m", description: "Victor." },
    { title: "Companion", poster: "/rec7/campanion.jpg", trailerId: "fT-l6K7K44A", cast: "Sophie Thatcher", director: "Hancock", genre: "Sci-Fi", rating: "6.5", year: "2025", runtime: "1h 50m", description: "New saga." },

    // Slider 8: Romance
    { title: "Titanic", poster: "/rec8/titanic.jpg", trailerId: "CHekzSiZqhY", cast: "Leo DiCaprio", director: "Cameron", genre: "Romance, Drama", rating: "7.9", year: "1997", runtime: "3h 14m", description: "Aristocrat falls in love." },
    { title: "La La Land", poster: "/rec8/lalaland.jpg", trailerId: "0pdqf4P9MB8", cast: "Ryan Gosling", director: "Chazelle", genre: "Romance, Music", rating: "8.0", year: "2016", runtime: "2h 08m", description: "Pianist and actress." },
    { title: "500 Days of Summer", poster: "/rec8/500daysofsummer.jpg", trailerId: "PsD0Np_JpS8", cast: "Joseph Gordon-Levitt", director: "Marc Webb", genre: "Romance", rating: "7.7", year: "2009", runtime: "1h 35m", description: "Relationship." },
    { title: "After", poster: "/rec8/after.jpg", trailerId: "BNLidba0VpE", cast: "Langford", director: "Gage", genre: "Romance", rating: "5.3", year: "2019", runtime: "1h 46m", description: "Dark secret." },
    { title: "Anyone But You", poster: "/rec8/anyonebutyou.jpg", trailerId: "fT-l6K7K44A", cast: "Sweeney", director: "Gluck", genre: "Romance", rating: "6.4", year: "2023", runtime: "1h 43m", description: "Sydney Sweeney." },
    { title: "Ghosted", poster: "/rec8/ghosted.jpg", trailerId: "IInS3XIkz_A", cast: "Chris Evans", director: "Fletcher", genre: "Romance, Action", rating: "5.8", year: "2023", runtime: "1h 56m", description: "Secret agent." },
    { title: "Meet Joe Black", poster: "/rec8/meetjoeblack.jpg", trailerId: "u_m9O6uJ29Q", cast: "Brad Pitt", director: "Brest", genre: "Romance", rating: "7.2", year: "1998", runtime: "3h 01m", description: "Death." },
    { title: "My Fault", poster: "/rec8/myfault.jpg", trailerId: "fT-l6K7K44A", cast: "Wallace", director: "Gonzalez", genre: "Romance", rating: "6.2", year: "2023", runtime: "1h 57m", description: "Stepbrother." },
    { title: "Twilight", poster: "/rec8/twilight.jpg", trailerId: "edLB6YWZ-R4", cast: "Kristen", director: "Hardwicke", genre: "Romance", rating: "5.3", year: "2008", runtime: "2h 02m", description: "Vampire." },
    { title: "We Live in Time", poster: "/rec8/weliveintime.jpg", trailerId: "fT-l6K7K44A", cast: "Garfield", director: "Crowley", genre: "Romance", rating: "7.3", year: "2024", runtime: "1h 47m", description: "Decades." },

    // Slider 9: Anime
    { title: "Your Name", poster: "/rec9/yourname.jpg", trailerId: "hRfHcp230U0", cast: "Ryunosuke Kamiki", director: "Shinkai", genre: "Anime, Romance", rating: "8.4", year: "2016", runtime: "1h 46m", description: "Two strangers." },
    { title: "Demon Slayer", poster: "/rec9/demonslayer.jpg", trailerId: "f8Y2I4zM4S0", cast: "Natsuki Hanae", director: "Sotozaki", genre: "Anime, Action", rating: "8.3", year: "2020", runtime: "1h 57m", description: "Tanjiro." },
    { title: "Jujutsu Kaisen 0", poster: "/rec9/jujutsu0.jpg", trailerId: "WgiI69I_g9o", cast: "Megumi Ogata", director: "Park", genre: "Anime, Action", rating: "7.8", year: "2021", runtime: "1h 45m", description: "Cursed Spirit." },
    { title: "Princess Mononoke", poster: "/rec9/princessmononoke.jpg", trailerId: "4vPeTSRd580", cast: "Yoji Matsuda", director: "Miyazaki", genre: "Anime", rating: "8.4", year: "1997", runtime: "2h 14m", description: "Struggle between gods." },
    { title: "Batman Ninja", poster: "/rec9/batmanninja.jpg", trailerId: "fT-l6K7K44A", cast: "Kyamadera", director: "Mizusaki", genre: "Anime", rating: "5.6", year: "2018", runtime: "1h 25m", description: "Japan." },
    { title: "Boy and Heron", poster: "/rec9/boyandheron.jpg", trailerId: "fT-l6K7K44A", cast: "Santoki", director: "Miyazaki", genre: "Anime", rating: "7.6", year: "2023", runtime: "2h 04m", description: "World shared." },
    { title: "Chainsaw Man", poster: "/rec9/chainsawman.jpg", trailerId: "fT-l6K7K44A", cast: "Toya", director: "Nakayama", genre: "Anime", rating: "8.5", year: "2022", runtime: "24m", description: "Denji." },
    { title: "Dragon Ball Super", poster: "/rec9/dragonballsuper.jpg", trailerId: "fT-l6K7K44A", cast: "Nozawa", director: "Kodama", genre: "Anime", rating: "7.3", year: "2022", runtime: "1h 40m", description: "Super Hero." },
    { title: "Ghost in Shell", poster: "/rec9/ghostintheshell.jpg", trailerId: "fT-l6K7K44A", cast: "Yohansson", director: "Sanders", genre: "Anime", rating: "6.3", year: "2017", runtime: "1h 47m", description: "A cyborg." },
    { title: "Resident Evil", poster: "/rec9/residentevilvendetta.jpg", trailerId: "fT-l6K7K44A", cast: "Dorman", director: "Tsujimoto", genre: "Anime", rating: "6.3", year: "2017", runtime: "1h 37m", description: "Vendetta." },

    // Slider 10: Kids
    { title: "Cars", poster: "/rec10/cars.jpg", trailerId: "v-PjgYDrg70", cast: "Owen Wilson", director: "Lasseter", genre: "Kids, Animation", rating: "7.1", year: "2006", runtime: "1h 56m", description: "Friendship." },
    { title: "Big Hero 6", poster: "/rec10/bighero6.jpg", trailerId: "z8ovT_S5Huw", cast: "Scott Adsit", director: "Don Hall", genre: "Kids, Animation", rating: "7.8", year: "2014", runtime: "1h 42m", description: "Robot." },
    { title: "Minecraft", poster: "/rec10/minecraft.jpg", trailerId: "v-PjgYDrg70", cast: "Jack Black", director: "Jared Hess", genre: "Kids, Animation", rating: "6.5", year: "2025", runtime: "1h 40m", description: "Creative land." },
    { title: "Incredibles", poster: "/rec10/incredibles.jpg", trailerId: "eZbzbCSkN6I", cast: "Craig T. Nelson", director: "Brad Bird", genre: "Kids, Animation", rating: "8.0", year: "2004", runtime: "1h 55m", description: "Superheroes." },
    { title: "Zootopia", poster: "/rec10/zootopia.jpg", trailerId: "jWM0ct-OLsM", cast: "Jason Bateman", director: "Byron Howard", genre: "Kids, Animation", rating: "8.0", year: "2016", runtime: "1h 48m", description: "Bunny cop." },
    { title: "Toy Story", poster: "/rec10/toystory.jpg", trailerId: "v-PjgYDrg70", cast: "Tom Hanks", director: "Lasseter", genre: "Kids, Animation", rating: "8.3", year: "1995", runtime: "1h 21m", description: "Cowboy doll." },
    { title: "Finding Nemo", poster: "/rec10/findingnemo.jpg", trailerId: "v-PjgYDrg70", cast: "Albert Brooks", director: "Andrew Stanton", genre: "Kids, Animation", rating: "8.1", year: "2003", runtime: "1h 40m", description: "A fish." },
    { title: "How to Train Dragon", poster: "/rec10/howtotrainyourdragon.jpg", trailerId: "SkcucKqhOlk", cast: "Jay Baruchel", director: "Chris Sanders", genre: "Kids, Animation", rating: "8.1", year: "2010", runtime: "1h 38m", description: "Dragon friend." },
    { title: "A Bug's Life", poster: "/rec10/buglife.jpg", trailerId: "fT-l6K7K44A", cast: "Dave Foley", director: "John Lasseter", genre: "Kids, Animation", rating: "7.2", year: "1998", runtime: "1h 35m", description: "A misfit ant." },
    { title: "Monsters Inc", poster: "/rec10/monsters.jpg", trailerId: "6p_f_8O4_y0", cast: "John Goodman", director: "Docter", genre: "Kids, Animation", rating: "8.1", year: "2001", runtime: "1h 32m", description: "Scream for power." },

    // Moods
    { title: "The Hangover", poster: "/rec11/hangover.jpg", trailerId: "tcdUhdOlz9M", cast: "Bradley Cooper", director: "Todd Phillips", genre: "Comedy", mood: "happy", rating: "7.7", year: "2009", runtime: "1h 40m", description: "No memory." },
    { title: "Nanban", poster: "/rec11/nanban.jpg", trailerId: "fT-l6K7K44A", cast: "Vijay", director: "Shankar", genre: "Comedy", mood: "happy", rating: "7.7", year: "2012", runtime: "3h 08m", description: "Long lost companion." },
    { title: "PK", poster: "/rec11/pk.jpg", trailerId: "82ZzraG-nsc", cast: "Aamir Khan", director: "Rajkumar Hirani", genre: "Comedy", mood: "happy", rating: "8.1", year: "2014", runtime: "2h 32m", description: "Alien remote." },
    { title: "Happy New Year", poster: "/rec11/hny.jpg", trailerId: "fT-l6K7K44A", cast: "SRK", director: "Farah Khan", genre: "Comedy", mood: "happy", rating: "5.0", year: "2014", runtime: "3h 00m", description: "A heist." },
    { title: "D&D", poster: "/rec11/dnd.jpg", trailerId: "IiMinixfo8k", cast: "Chris Pine", director: "Daley", genre: "Adventure", mood: "happy", rating: "7.2", year: "2023", runtime: "2h 14m", description: "Epic heist." },
    { title: "The Fault in Our Stars", poster: "/rec12/heart.jpg", trailerId: "9ItBvH5J68A", cast: "Shailene Woodley", director: "Boone", genre: "Drama", mood: "sad", rating: "7.7", year: "2014", runtime: "2h 06m", description: "Teen cancer." },
    { title: "The Green Mile", poster: "/rec12/greenmile.jpg", trailerId: "Ki4haFrqSrw", cast: "Tom Hanks", director: "Darabont", genre: "Drama", mood: "sad", rating: "8.6", year: "1999", runtime: "3h 09m", description: "Death row." },
    { title: "MS Dhoni", poster: "/rec13/msdhoni.jpg", trailerId: "6L6XqWoS8tw", cast: "Sushant Rajput", director: "Neeraj Pandey", genre: "Biography", mood: "motivational", rating: "8.0", year: "2016", runtime: "3h 04m", description: "Dhoni's journey." },
    { title: "12th Fail", poster: "/rec13/12thfail.jpg", trailerId: "fT-l6K7K44A", cast: "Vikrant Massey", director: "Vidhu Vinod", genre: "Biography", mood: "motivational", rating: "8.9", year: "2023", runtime: "2h 27m", description: "IPS Officer Sharma story." },
    { title: "Love Today", poster: "/rec14/lovetoday.jpg", trailerId: "fT-l6K7K44A", cast: "Pradeep", director: "Pradeep", genre: "Comedy", mood: "wholesome", rating: "8.1", year: "2022", runtime: "2h 34m", description: "Exchange phones." },
    { title: "Saw", poster: "/rec15/saw.jpg", trailerId: "S-1QgOMQ-ls", cast: "Cary Elwes", director: "James Wan", genre: "Horror", mood: "rrated", rating: "7.6", year: "2004", runtime: "1h 43m", description: "Deadly game." },
    { title: "Memento", poster: "/rec16/memento.jpg", trailerId: "4CV41hoyS8A", cast: "Guy Pearce", director: "Nolan", genre: "Mystery", mood: "mysterythriller", rating: "8.4", year: "2000", runtime: "1h 53m", description: "Tracks murderer." },
    { title: "The Prestige", poster: "/rec16/prestige.jpg", trailerId: "o4gHCmTQDVI", cast: "Hugh Jackman", director: "Nolan", genre: "Mystery", mood: "mysterythriller", rating: "8.5", year: "2006", runtime: "2h 10m", description: "Magicians." },

    // 🌌 MULTIVERSE SPECIALS
    { title: "Skyfall", poster: "https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?q=80&w=1000", trailerId: "6kw1UVovByw", cast: "Daniel Craig", director: "Sam Mendes", genre: "Spy, Action, Thriller", rating: "7.8", year: "2012", runtime: "2h 23m", description: "Bond's loyalty to M is tested." },
    { title: "Mission Impossible: Fallout", poster: "https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?q=80&w=1000", trailerId: "6kw1UVovByw", cast: "Tom Cruise", director: "Christopher McQuarrie", genre: "Spy, Action", rating: "7.8", year: "2018", runtime: "2h 27m", description: "Ethan Hunt and his team must save the world." },
    { title: "No Time To Die", poster: "https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?q=80&w=1000", trailerId: "fT-l6K7K44A", cast: "Daniel Craig", director: "Cary Joji Fukunaga", genre: "Spy, Action", rating: "7.3", year: "2021", runtime: "2h 43m", description: "Bond has left active service." },
    { title: "Gladiator", poster: "https://images.unsplash.com/photo-1563606734182-1775fb090013?q=80&w=1000", trailerId: "P5ieIbInFpg", cast: "Russell Crowe", director: "Ridley Scott", genre: "King, Action, History", rating: "8.5", year: "2000", runtime: "2h 35m", description: "A former Roman General sets out to exact vengeance." },
    { title: "Braveheart", poster: "https://images.unsplash.com/photo-1563606734182-1775fb090013?q=80&w=1000", trailerId: "1NJO0jxPuMo", cast: "Mel Gibson", director: "Mel Gibson", genre: "King, War, History", rating: "8.4", year: "1995", runtime: "2h 58m", description: "Enslaved by the English, William Wallace leads an army." },
    { title: "The Martian", poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000", trailerId: "Ue4PCI0NamI", cast: "Matt Damon", director: "Ridley Scott", genre: "Astronaut, Sci-Fi", rating: "8.0", year: "2015", runtime: "2h 24m", description: "An astronaut becomes stranded on Mars." },
    { title: "Gravity", poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000", trailerId: "OiTiKOy59oA", cast: "Sandra Bullock", director: "Alfonso Cuarón", genre: "Astronaut, Sci-Fi", rating: "7.7", year: "2013", runtime: "1h 31m", description: "Two astronauts work together to survive." },
    { title: "Harry Potter: Deathly Hallows 2", poster: "https://images.unsplash.com/photo-1510133769068-68884a12be74?q=80&w=1000", trailerId: "5NYt1qirBWg", cast: "Daniel Radcliffe", director: "David Yates", genre: "Wizard, Fantasy", rating: "8.1", year: "2011", runtime: "2h 10m", description: "The end begins." },
    { title: "Lord of the Rings: Return of the King", poster: "https://images.unsplash.com/photo-1510133769068-68884a12be74?q=80&w=1000", trailerId: "r5X-hFf6Bwo", cast: "Elijah Wood", director: "Peter Jackson", genre: "Wizard, Fantasy", rating: "9.0", year: "2003", runtime: "3h 21m", description: "Gandalf and Aragorn lead the World of Men." },
    { title: "300", poster: "https://images.unsplash.com/photo-1533227268408-a775dbef1a14?q=80&w=1000", trailerId: "fT-l6K7K44A", cast: "Gerard Butler", director: "Zack Snyder", genre: "Warrior, Action", rating: "7.6", year: "2006", runtime: "1h 57m", description: "King Leonidas lead 300 Spartans." },
    { title: "Sherlock Holmes", poster: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000", trailerId: "Egcx6ai72f4", cast: "Robert Downey Jr", director: "Guy Ritchie", genre: "Genius, Mystery", rating: "7.6", year: "2009", runtime: "2h 08m", description: "Detective Holmes and partner Watson solve cases." },
    { title: "The Dark Knight", poster: "https://images.unsplash.com/photo-1544257144-8cb59a850106?q=80&w=1000", trailerId: "EXeTwQWrcwY", cast: "Christian Bale", director: "Christopher Nolan", genre: "Villain, Action, Crime", rating: "9.0", year: "2008", runtime: "2h 32m", description: "Batman vs Joker." }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for Seeding...");

        await Movie.deleteMany({});

        for (const m of movies) {
            if (!m.language) m.language = "English";
            await Movie.create(m);
        }

        console.log("Database seeded with " + movies.length + " movies.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
