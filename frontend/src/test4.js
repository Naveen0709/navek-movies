const key = 'eb46ebb646eea7183b734797b40cb202';
const q = [
    { k: 'Action', m: 603692 }, // JW4
    { k: 'Romance', m: 597 }, // Titanic
    { k: 'Comedy', m: 18785 }, // Hangover
    { k: 'Drama', m: 278 }, // Shawshank
    { k: 'Family', m: 9806 }, // Incredibles
    { k: 'Horror', m: 138843 }, // Conjuring
    { k: 'Tamil', m: 146603 }, // Mankatha - Ajith (wait Mankatha is 83533, Leo is 1084225. Let's use Thunivu 1014590 or Leo. User said Ajith pic for Tamil). Let's use Thunivu: 1014590
    { k: 'Telugu', m: 852538 }, // Salaar (Prabhas)
    { k: 'English', m: 546554 }, // Knives Out (Ana de Armas)
    { k: 'Japanese', m: 372058 }, // Your name (Japanese heroine)
    { k: 'Korean', m: 396535 }, // Train to Busan (Don Lee/Ma Dong-seok)
    { k: 'Hindi', m: 1039809 } // Jawan (SRK) actually Jawan is 8659... Jawan is 1036661? No, Pathaan is 8659, wait. Let's use Pathaan id 864692 
];

// 1014590 = Thunivu, 1079394 = Mankatha maybe? 864692 = Pathaan

async function f() {
    for (const l of q) {
        let res = await fetch('https://api.themoviedb.org/3/movie/' + l.m + '?api_key=' + key);
        let json = await res.json();
        console.log(l.k + ': https://image.tmdb.org/t/p/w1280' + json.backdrop_path);
    }
}
f();
