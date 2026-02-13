const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('bgm');
const powerFill = document.getElementById('power-fill');

let level = 1;
let gameActive = false;
let score = 0;

// Music Tracks (You will need to host these or use direct links)
const playlist = {
    intro: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Replace with Naruto Intro
    battle: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Replace with Battle Theme
    romance: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" // Replace with Romance Theme
};

function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    playMusic('battle');
    loadLevel(1);
}

function playMusic(type) {
    audio.src = playlist[type];
    audio.play().catch(e => console.log("Audio needs user interaction first"));
}

function loadLevel(lv) {
    level = lv;
    score = 0;
    powerFill.style.width = "0%";
    
    const titles = [
        "", "1. Chakra Charge", "2. Ramen Catch", "3. Kunai Dodge", 
        "4. Shadow Clone Clicker", "5. Protect Golibaje", "6. Demon Slayer Duel"
    ];
    document.getElementById('game-title').innerText = titles[lv];
    
    startLevelLogic(lv);
}

function startLevelLogic(lv) {
    gameActive = true;
    if (lv === 3) { // KUNAI DODGE
        runKunaiDodge();
    } else if (lv === 5) { // PROTECT GOLIBAJE
        runGolibajeDefense();
    } else {
        // Tap modes for Level 1, 2, 4, 6
        window.onclick = (e) => {
            if(!gameActive) return;
            score += 10;
            powerFill.style.width = score + "%";
            createEffect(e.clientX, e.clientY); // Visual "Screen Flash" effect
            if (score >= 100) nextLevel();
        };
    }
}

function nextLevel() {
    gameActive = false;
    level++;
    // Screen Flash effect
    document.body.style.background = "white";
    setTimeout(() => {
        document.body.style.background = "radial-gradient(circle, #1a0033 0%, #050505 100%)";
        if (level <= 6) loadLevel(level);
        else showFinalProposal();
    }, 100);
}

function showFinalProposal() {
    playMusic('romance');
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('final-screen').style.display = 'block';
    initNoButton();
}

// Visual Tap Effect (Ninja Vanish Smoke)
function createEffect(x, y) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke-effect';
    smoke.style.left = x + 'px';
    smoke.style.top = y + 'px';
    document.body.appendChild(smoke);
    setTimeout(() => smoke.remove(), 500);
}

function initNoButton() {
    const noBtn = document.getElementById('noBtn');
    noBtn.onmouseover = () => {
        noBtn.style.position = 'absolute';
        noBtn.style.left = Math.random() * 80 + 'vw';
        noBtn.style.top = Math.random() * 80 + 'vh';
    };
}
