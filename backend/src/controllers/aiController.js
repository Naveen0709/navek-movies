import AIMovie from "../models/AIMovie.js";

// 🌐 CINEMATIC AI - ADVANCED INTELLIGENCE DICTIONARY
const LANGUAGES = {
    TAMIL: {
        detect: ["enaku", "venum", "ethu", "nalla", "padam", "pudikum", "solu", "seri", "eppadi", "unga", "solunga", "padangala", "kamipu", "ethavathu", "dai", "bunda", "lusu"],
        greet: [
            "Vanga buddy! 👋 NAVEK Cinematic AI inga. Eppadi irukkeenga? Padam ethavathu pakkanuma? 🎬",
            "Vanakkam! 🍿 Movie marathon-ku ready-ah? Enna maathiri vibes venum ungaluku?",
            "Hey buddy! 👋 Cinema expert ready! Sollunga, iniku enna magic panna porom?"
        ],
        bored: [
            "Bore adikutha? 😅 Adha fix panna dhaan naan inga iruken! Nalla mind-blowing movies iruku, paklama?",
            "Same vibe ah 😄 Bore-ah iruntha mind-bending cinema dhaan correct treatment. Enna genre logic venum?",
            "Bored-ah? Don't worry! Reddit-la trend aagura blockbuster films-ah ungaluku suggest pandren. Ready-ah?"
        ],
        recommend: "Seri! NAVEK database-la irunthu behtareen padangala select panni vechiruken 🔥",
        intro: [
            "Naan unga Cinematic AI buddy! Ippo enaku ella genres (Comedy, Action, Thriller, Motivational) pathi theriyum. English, Tamil nu ella language padangalum suggest pannuven!",
            "Analyzing Reddit trends & Google... I've learned every cinematic genre now. Ready to give you the perfect pick!",
            "I've expanded my intelligence! From Sci-Fi to Motivational, I can find anything in any language now."
        ],
        noResult: "Ippo unga request-ku direct matches illa, aana indha trending movies-ah try panni paarunga! 👇"
    },
    TANGLISH: {
        detect: ["bro", "dude", "vibe", "feel", "pudichu", "konjam", "movie", "suggest", "panni", "story", "acting"],
        greet: [
            "Hey buddy! 👋 Looking for something fun to watch? NAVEK Cinematic AI at your service!",
            "What's up dude! 🍿 Movie expert is here. Ready to find your next favorite film?",
            "Hey! 👋 Movie mood-la irukka? Let's fix you a perfect recommendation!"
        ],
        bored: [
            "Bored-ah? 😄 Same vibe here! Let's find you some 'fire' movies to kill the time.",
            "Boredom is the enemy, and I am the weapon! 🎬 What's your current feeling?",
            "Bored level 100-ah? 😅 No worries, these suggestions are gonna blow your mind!"
        ],
        recommend: "Perfect! I've curated some dope picks from global cinema just for you! 🔥",
        intro: [
            "Analyzing user preferences... and boom! Here's your personalized watchlist.",
            "Searching through IMDb rankings and Reddit discussions to find these gems! ✨",
            "This lineup is trending worldwide right now. You're gonna love it! 🍿"
        ],
        noResult: "I couldn't find exactly that, but as your movie buddy, I highly recommend these trending picks! 👇"
    },
    HINDI: {
        detect: ["mujhe", "chahiye", "dikhao", "kaunsi", "achhi", "film", "batao", "kaise", "pasand", "movie", "dekhna"],
        greet: [
            "Namaste buddy! 👋 Kaise ho? Aaj koi behtareen film dekhni hai?",
            "Hey! 🍿 Movie expert haazir hai. Kya dekhna pasand karoge aaj?",
            "Namaste! 👋 Film ki duniya mein aapka swagat hai. Kya mood hai aaj?"
        ],
        bored: [
            "Arey, bore ho rahe ho? 😅 Chalo, mood ekdum set karte hain! Kaunsa genre chalega?",
            "Bore ho rahe ho? Bilkul nahi! 😄 Mere paas aise mind-blowing movies hain ki aap khush ho jaoge.",
            "Boredom ka ilaaj sirf achhi filmein hain. Chalo, kuch zabardast dikhata hoon! 🔥"
        ],
        recommend: "Zaroor! Maine aapke liye Reddit aur IMDb se best movies select ki hain 🔥",
        intro: [
            "Main hoon aapka Cinematic AI buddy! Maine duniya bhar se aapke liye best filmein nikali hain.",
            "Aapke mood ke hisaab se, ye rahi kuch solid recommendations jo trend ho rahi hain.",
            "Google trends ke mutabiq, ye filmein abhi sabse zyada charchit hain!"
        ],
        noResult: "Aapki choice thodi unique hai, par tab tak ye trending movies try kare! 👇"
    },
    TELUGU: {
        detect: ["naku", "kavali", "vundhi", "ela", "cinema", "chepu", "nachindi", "eppudu"],
        greet: ["Namaste buddy! 👋 Ela unnaru? Ee roju em movie chudali?"],
        bored: ["Bore kodutundha? 😅 Ayithe keka movies chepthanu. Em genre kavali? 😄"],
        recommend: "Tappakunda! Meeru chudalsina konni manchi movies ikkada unnayi 🔥",
        intro: [
            "Nenu mee Cinematic AI buddy! Mee kosam best movies vethiki pettanu.",
            "Mee mood-ku thagga manchi selections ikkada unnayi. Trending on IMDb!",
            "Ee list chudandi, Reddit movie community lo deeni gurinchi baga discuss chestunnaru!"
        ],
        noResult: "Meeru korukuna movie dorkaledhu, kani ee trending movies tappakunda chudandi! 👇"
    },
    KOREAN: {
        detect: ["안녕", "영화", "추천", "해줘", "심심해", "좋아", "뭐"],
        greet: ["안녕하세요 buddy! 👋 어떤 영화를 보고 싶으세요?"],
        bored: ["지루하시군요? 😅 기분을 전환할 멋진 영화들을 추천해 드릴게요! 😄"],
        recommend: "네! 당신이 좋아할 만한 최고의 영화들을 선별해 봤어요 🔥",
        intro: [
            "저는 당신의 시네마틱 AI 친구입니다! 전 세계의 명작들을 모아봤어요.",
            "오늘 당신의 기분에 딱 맞는 영화들을 찾아냈습니다. (Reddit에서 인기!)",
            "직접 선별한 이 영화들은 IMDb 평점이 매우 높습니다!"
        ],
        noResult: "원하시는 영화를 찾지 못했지만, 현재 가장 인기 있는 이 영화들을 추천합니다! 👇"
    },
    JAPANESE: {
        detect: ["こんにちは", "映画", "おすすめ", "教えて", "退屈", "好き", "アニメ"],
        greet: ["こんにちは buddy! 👋 今日はどんな映画が観たいですか？"],
        bored: ["退屈ですか? 😅 気分転換に最高の映画をご紹介しますね! 😄"],
        recommend: "もちろんです！あなたにぴった리의 映画をいくつか選んでみました 🔥",
        intro: [
            "映画のバディ、シ네マティックAIです！世界中から厳選した作品をご紹介します。",
            "今の気分에 ぴったり の 映画 を 分析しました。Redditで話題の作品です！",
            "これらの作品は、現在Googleトレンドで上位に入っています。"
        ],
        noResult: "ご希望の映画は見つかりませんでしたが、こちらのトレンド作品は大人気ですよ！ 👇"
    }
};

const detectLanguage = (text) => {
    const lower = text.toLowerCase();
    
    if (/[가-힣]/.test(text)) return "KOREAN";
    if (/[ぁ-んァ-ン一-龠]/.test(text)) return "JAPANESE";
    
    if (lower.includes("bro") || lower.includes("dude") || lower.includes("vibe") || lower.includes("suggest panni") || lower.includes("pudikum")) return "TANGLISH";

    for (const [lang, config] of Object.entries(LANGUAGES)) {
        if (config.detect && config.detect.some(word => lower.includes(word))) return lang;
    }
    
    return "ENGLISH";
};

// 🧠 CORE SEARCH & ANALYSIS ENGINE
const analyzePrompt = (text) => {
    const lower = text.toLowerCase();

    // 1. Movie Reference
    let movieRef = null;
    const likeMatch = lower.match(/(like|similar to|recommend something like|movies like|love|enjoyed|watched|as good as|pudikum|nalla|achhi|pasand|vibe of|feeling like)\s+([a-zA-Z0-9\s:]+)/i);
    if (likeMatch && likeMatch[2]) {
        movieRef = likeMatch[2].trim();
    }

    // 🌏 CINEMATIC AI - COMPREHENSIVE GENRE & LANGUAGE INTELLIGENCE
    const GENRE_LIST = [
        "action", "comedy", "thriller", "sci-fi", "science fiction", "horror", "romance", "romantic", 
        "drama", "animation", "anime", "mystery", "superhero", "fantasy", "crime", "adventure", 
        "documentary", "war", "musical", "biography", "western", "history", "sport", "family", "kids",
        "psychological", "slasher", "supernatural", "noir", "neo-noir", "indie", "short", "epic",
        "paranormal", "gore", "satire", "sitcom", "stand-up", "survival", "motivational", "inspiring"
    ];
    const genresFound = GENRE_LIST.filter(g => lower.includes(g));

    // Languages (Global Teaching - Mapping to DB Codes)
    const LANG_MAP = {
        "tamil": "ta",
        "telugu": "te",
        "hindi": "hi",
        "malayalam": "ml",
        "kannada": "kn",
        "english": "en",
        "korean": "ko",
        "japanese": "ja",
        "chinese": "zh",
        "french": "fr",
        "spanish": "es",
        "german": "de",
        "italian": "it",
        "russian": "ru",
        "turkish": "tr"
    };
    const languagesFound = Object.keys(LANG_MAP).filter(l => lower.includes(l));
    const languageCodes = languagesFound.map(l => LANG_MAP[l]);

    // 3. Mood/Theme Extraction (Enhanced for better precision)
    const MOODS = {
        "happy": ["happy", "feel good", "uplifting", "lighthearted", "funny", "laugh", "joy", "smile", "cheerful", "santhosham", "khush", "kids"],
        "sad": ["sad", "emotional", "cry", "tearjerker", "melancholy", "heartbreaking", "depressing", "soga", "dukh", "pain"],
        "inspiring": ["motivational", "inspiring", "ambitious", "strong", "leadership", "success", "journey", "dream", "hope", "winners", "struggle", "goal"],
        "scary": ["scary", "terrifying", "fear", "dark", "disturbing", "creepy", "spooky", "horror", "bayam", "darr", "ghost"],
        "thrill": ["intense", "thrilling", "adrenaline", "action-packed", "fast", "exciting", "edge of seat", "thriller", "thrill", "chase"],
        "romantic": ["romantic", "love", "heartfelt", "date night", "soulmate", "romance", "kadhal", "pyaar", "crush"],
        "bored": ["bored", "mind blowing", "mind-bending", "complex", "thinking", "smart", "twist", "intellectual", "surprise", "bore", "trippy"]
    };
    const moodsFound = Object.keys(MOODS).filter(mood => MOODS[mood].some(m => lower.includes(m)));

    // Keywords to search for in description/title
    const keywordsFound = lower.split(/\s+/).filter(word => word.length > 3 && !GENRE_LIST.includes(word) && !Object.keys(LANG_MAP).includes(word));

    return { movieRef, genresFound, moodsFound, languagesFound, languageCodes, keywordsFound, isGreeting: /^(hi|hello|hey|vanakkam|namaste|vanga|sup|yo)/i.test(lower), isBored: lower.includes("bored") || lower.includes("bore") };
};

// 🎯 MAIN RECOMMENDATION HANDLER
export const getAIRecommendation = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    try {
        const lang = detectLanguage(prompt);
        const analysis = analyzePrompt(prompt);
        
        const langConfig = LANGUAGES[lang] || LANGUAGES.TANGLISH;

        if (analysis.isGreeting) {
            return res.json({ text: langConfig.greet[Math.floor(Math.random() * langConfig.greet.length)], recommendations: [] });
        }

        if (analysis.isBored && analysis.genresFound.length === 0 && !analysis.movieRef && analysis.moodsFound.length === 0) {
            return res.json({ text: langConfig.bored[Math.floor(Math.random() * langConfig.bored.length)], recommendations: [] });
        }

        let recommendations = [];
        let simulationSource = "NAVEK CORE INTELLIGENCE";

        // 🧠 DEEP SEARCH LOGIC
        const searchCriteria = [];

        // 1. Literal Genre/Language Search
        if (analysis.genresFound.length > 0) {
            analysis.genresFound.forEach(g => searchCriteria.push({ genre: new RegExp(g, 'i') }));
        }
        if (analysis.languageCodes.length > 0) {
            analysis.languageCodes.forEach(l => searchCriteria.push({ language: new RegExp(`^${l}$`, 'i') }));
        }

        // 2. Mood/Theme Mapping
        const moodToGenre = {
            "happy": ["Comedy", "Animation", "Family"],
            "sad": ["Drama", "Romance", "Biography"],
            "inspiring": ["Sport", "Biography", "Documentary"], // Removed Drama to be stricter for motivational
            "bored": ["Sci-Fi", "Mystery", "Thriller", "Fantasy"],
            "thrill": ["Action", "Thriller", "Crime"],
            "romantic": ["Romance"],
            "scary": ["Horror", "Thriller"]
        };

        analysis.moodsFound.forEach(mood => {
            if (moodToGenre[mood]) {
                moodToGenre[mood].forEach(g => searchCriteria.push({ genre: new RegExp(g, 'i') }));
            }
        });

        // 3. Keyword Search (SEARCH DESCRIPTION!!)
        if (analysis.keywordsFound.length > 0) {
            analysis.keywordsFound.slice(0, 3).forEach(kw => {
                searchCriteria.push({ description: new RegExp(kw, 'i') });
                searchCriteria.push({ title: new RegExp(kw, 'i') });
                searchCriteria.push({ keywords: new RegExp(kw, 'i') });
            });
        }

        // If user asks for a specific language, we lower the rating bar because our local DB 
        // might have limited but still relevant movies with 0.0 rating for that language.
        let query = { rating: { $gte: analysis.languageCodes.length > 0 ? "0.0" : "5.5" } };

        // 🔥 CRITICAL: If language specified, strictly enforce it
        if (analysis.languageCodes.length > 0) {
            query.language = { $in: analysis.languageCodes.map(l => new RegExp(`^${l}$`, 'i')) };
        }

        // 🔥 CRITICAL: If specific search criteria found, use them. 
        // We use $and for themes to be stricter.
        if (searchCriteria.length > 0) {
            // Priority: If user specifically asked for "motivational", ensure Biography/Sport/inspiring keywords are prioritized
            if (analysis.moodsFound.includes("inspiring")) {
                query.$or = [
                    { genre: /Sport/i },
                    { genre: /Biography/i },
                    { description: /inspiring/i },
                    { description: /success/i },
                    { description: /motivational/i },
                    { title: /motivational/i }
                ];
            } else {
                query.$or = searchCriteria;
            }
        } else {
            query.popularity = { $gt: 500 };
        }

        recommendations = await AIMovie.find(query).sort({ popularity: -1, rating: -1 }).limit(30);

        // Sorting by Match Score
        recommendations = recommendations.map(m => {
            let score = 70;
            // Boost if matches user language
            if (analysis.languagesFound.some(l => m.language.toLowerCase().includes(l.toLowerCase()))) score += 15;
            // Boost if matches requested genre
            if (analysis.genresFound.some(g => m.genre.toLowerCase().includes(g.toLowerCase()))) score += 10;
            // Boost if specifically motivational for that mood
            if (analysis.moodsFound.includes("inspiring") && (m.genre.includes("Sport") || m.genre.includes("Biography"))) score += 15;
            
            return { ...m.toObject(), matchScore: Math.min(score + (Math.random() * 5), 99) };
        });

        // Unique and Top 10
        recommendations = [...new Map(recommendations.map(item => [item['title'], item])).values()];
        recommendations.sort((a, b) => b.matchScore - a.matchScore);
        
        // Final Filter: If user asked for motivational, REMOVE generic comedies or non-matching stuff
        if (analysis.moodsFound.includes("inspiring")) {
            recommendations = recommendations.filter(m => 
                m.genre.includes("Drama") || m.genre.includes("Sport") || m.genre.includes("Biography") || 
                m.description.toLowerCase().includes("inspire") || m.description.toLowerCase().includes("success")
            );
        }

        recommendations = recommendations.slice(0, 10);

        // Why Watch Insights
        recommendations = recommendations.map(m => {
            let whyWatch = "Highly recommended by the global movie community.";
            if (analysis.moodsFound.includes("inspiring")) whyWatch = "Powerful story of grit and determination. Truly life-changing.";
            else if (m.rating >= 8.5) whyWatch = "Cinematic masterpiece with exceptional IMDb ratings.";
            else if (m.genre.includes("Thriller")) whyWatch = "Intense pacing and mind-bending plot twists.";
            
            return { ...m, whyWatch };
        });

        let intro = langConfig.intro[Math.floor(Math.random() * langConfig.intro.length)];
        const requested = [...analysis.genresFound, ...analysis.languagesFound, ...analysis.moodsFound]
            .map(g => g.toUpperCase()).join(", ");
        
        if (requested) {
            const langPre = analysis.languagesFound.length > 0 ? `I've strictly filtered for **${analysis.languagesFound.map(l => l.toUpperCase()).join(", ")}** cinema. ` : "";
            intro = `${langPre}${intro}`;
        }

        res.json({
            analysis,
            recommendations,
            explanation: `**[SIMULATING DATA FROM REDDIT & IMDB]** \n\n ${intro}`
        });
        
    } catch (err) {
        console.error("CINEMATIC AI Error:", err);
        res.status(500).json({ message: "AI Engine Overload. Please retry!" });
    }
};
