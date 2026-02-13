let level = 1;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function startGame() {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    runLevel();
}

function runLevel() {
    const titles = {
        1: "1. Chakra Charge (Tap!)",
        2: "2. Ramen Date Catch",
        3: "3. Kunai Dodge",
        4: "4. Shadow Clone Clicker",
        5: "5. Protect the Golibaje",
        6: "6. Demon Slayer Duel",
        7: "Final Proposal"
    };
    document.getElementById('game-title').innerText = titles[level];
    
    // Simplifed logic for testing: Tap to progress
    window.onclick = () => {
        if(level > 6) return;
        let fill = document.getElementById('power-fill');
        let currentWidth = parseFloat(fill.style.width) || 0;
        fill.style.width = (currentWidth + 10) + "%";
        
        if (currentWidth >= 95) {
            nextLevel();
        }
    };
}

function nextLevel() {
    level++;
    document.getElementById('power-fill').style.width = "0%";
    if (level > 6) {
        document.getElementById('game-container').classList.add('hidden');
        document.getElementById('final-screen').classList.remove('hidden');
        initNoButton();
    } else {
        runLevel();
    }
}

// "No" button AI - it runs away!
function initNoButton() {
    const noBtn = document.getElementById('noBtn');
    noBtn.onmouseover = () => {
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 50);
        noBtn.style.position = 'absolute';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
    };
}
