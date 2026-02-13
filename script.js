const audio = document.getElementById('bgm');
const powerFill = document.getElementById('power-fill');
const player = document.getElementById('player-sprite');
const enemy = document.getElementById('enemy-sprite');

let level = 1;
let score = 0;

// High-quality anime music links
const playlist = {
    battle: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
    romance: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
};

const levels = {
    1: { title: "1. Chakra Charge", p: "🦊", e: "🌀" },
    2: { title: "2. Ramen Date Catch", p: "🍥", e: "🍜" },
    3: { title: "3. Kunai Dodge", p: "🏃", e: "🗡️" },
    4: { title: "4. Shadow Clone Clicker", p: "👥", e: "💨" },
    5: { title: "5. Protect Golibaje", p: "🥟", e: "🥷" },
    6: { title: "6. Demon Slayer Duel", p: "🎴", e: "👹" }
};

function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    audio.src = playlist.battle;
    audio.play();
    loadLevel(1);
}

function loadLevel(lv) {
    level = lv;
    score = 0;
    powerFill.style.width = "0%";
    document.getElementById('game-title').innerText = levels[lv].title;
    player.innerText = levels[lv].p;
    enemy.innerText = levels[lv].e;
}

// Global click/tap listener
window.addEventListener('mousedown', handleAction);
window.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents multi-tap zoom on phones
    handleAction();
});

function handleAction() {
    if (document.getElementById('game-container').style.display === 'block') {
        score += 20; 
        powerFill.style.width = score + "%";
        
        // Ninja Flash Effect
        player.style.transform = "translateX(40px) scale(1.2)";
        setTimeout(() => player.style.transform = "translateX(0) scale(1)", 80);

        if (score >= 100) {
            if (level < 6) loadLevel(level + 1);
            else showFinal();
        }
    }
}

function showFinal() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('final-screen').style.display = 'block';
    audio.src = playlist.romance;
    audio.play();
    
    const noBtn = document.getElementById('noBtn');
    noBtn.onmouseover = moveButton;
    noBtn.ontouchstart = moveButton;
}

function moveButton() {
    const noBtn = document.getElementById('noBtn');
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
}

function celebrate() {
    alert("YES! The Final Jutsu is Complete! 💍✨");
}
