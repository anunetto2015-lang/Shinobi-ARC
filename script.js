let scrolls = 0;
let sealsBroken = 0;
let animationFrame;
let gameActive = false;
const missions = [
    { id: 1, name: "Chakra Charge", icon: "⚡", type: "tap", instr: "Tap screen fast to charge!", unlocked: true },
    { id: 2, name: "Sharingan Memory", icon: "👁️", type: "memory", instr: "Match the pairs!", unlocked: false },
    { id: 3, name: "Kunai Deflect", icon: "🗡️", type: "timing", instr: "Tap when the bar hits GREEN!", unlocked: false },
    { id: 4, name: "Shadow Clone", icon: "👥", type: "whack", instr: "Tap the REAL Naruto (🦊)!", unlocked: false },
    { id: 5, name: "Golibaje Guard", icon: "🥟", type: "defense", instr: "Tap enemies before they eat!", unlocked: false },
    { id: 6, name: "Demon Duel", icon: "👹", type: "boss", instr: "Mash to overpower Kurama!", unlocked: false }
];

// --- INTRO GAME: SEAL BREAKER ---
function hitSeal(el) {
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
    sealsBroken++;
    if(sealsBroken >= 3) {
        setTimeout(() => {
            document.getElementById('intro-screen').classList.remove('active');
            document.getElementById('map-screen').classList.add('active');
            renderMap();
        }, 500);
    }
}

// --- MAP SYSTEM ---
function renderMap() {
    const grid = document.getElementById('mapGrid');
    grid.innerHTML = '';
    missions.forEach(m => {
        const div = document.createElement('div');
        div.className = `grid-item ${m.unlocked ? '' : 'locked'}`;
        div.innerHTML = `<span>${m.icon}</span><small>${m.name}</small>`;
        if(m.unlocked) div.onclick = () => launchGame(m);
        grid.appendChild(div);
    });
    document.getElementById('scroll-count').innerText = scrolls;
}

function enterMap() {
    gameActive = false;
    cancelAnimationFrame(animationFrame);
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('map-screen').classList.add('active');
    renderMap();
}

// --- GAME LAUNCHER ---
function launchGame(m) {
    document.getElementById('map-screen').classList.remove('active');
    document.getElementById('game-container').classList.add('active');
    document.getElementById('game-title').innerText = m.name;
    document.getElementById('game-instruction').innerText = m.instr;
    document.getElementById('power-fill').style.width = "0%";
    const area = document.getElementById('game-area');
    area.innerHTML = ''; // Clear previous game
    gameActive = true;

    if(m.type === 'memory') startMemoryGame(area);
    else {
        const canvas = document.createElement('canvas');
        canvas.width = 300; canvas.height = 350;
        area.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        if(m.type === 'tap' || m.type === 'boss') startTapGame(canvas, ctx);
        if(m.type === 'timing') startTimingGame(canvas, ctx);
        if(m.type === 'whack') startWhackGame(canvas, ctx);
        if(m.type === 'defense') startDefenseGame(canvas, ctx);
    }
}

// --- MINI GAMES (NO DRAGGING) ---

// 1. Memory Game (Clicking)
function startMemoryGame(area) {
    const icons = ['🍥','🍥','🦊','🦊','🗡️','🗡️','👺','👺','⚡','⚡','📜','📜'];
    let deck = icons.sort(() => 0.5 - Math.random());
    let flipped = [], matched = 0;
    
    const grid = document.createElement('div');
    grid.className = 'memory-grid';
    
    deck.forEach((icon, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.val = icon;
        card.onclick = () => {
            if(flipped.length < 2 && !card.classList.contains('flipped')) {
                card.innerText = icon;
                card.classList.add('flipped');
                flipped.push(card);
                if(flipped.length === 2) checkMatch();
            }
        };
        grid.appendChild(card);
    });
    area.appendChild(grid);

    function checkMatch() {
        const [c1, c2] = flipped;
        if(c1.dataset.val === c2.dataset.val) {
            c1.classList.add('matched'); c2.classList.add('matched');
            matched += 2; flipped = [];
            document.getElementById('power-fill').style.width = (matched/12)*100 + "%";
            if(matched === 12) winGame();
        } else {
            setTimeout(() => { c1.innerText=''; c2.innerText=''; c1.classList.remove('flipped'); c2.classList.remove('flipped'); flipped=[]; }, 600);
        }
    }
}

// 2. Timing Game (Tap when Green)
function startTimingGame(canvas, ctx) {
    let barX = 0, speed = 4, score = 0;
    function loop() {
        if(!gameActive) return;
        ctx.clearRect(0,0,300,350);
        
        // Target Zone
        ctx.fillStyle = "#333"; ctx.fillRect(50, 150, 200, 30);
        ctx.fillStyle = "#0f0"; ctx.fillRect(130, 150, 40, 30); // Green Zone
        
        // Moving Bar
        ctx.fillStyle = "white"; ctx.fillRect(barX, 140, 10, 50);
        barX += speed;
        if(barX > 290 || barX < 0) speed *= -1;
        
        animationFrame = requestAnimationFrame(loop);
    }
    loop();
    
    canvas.onclick = () => {
        if(barX > 130 && barX < 170) {
            score += 25;
            document.getElementById('power-fill').style.width = score + "%";
            ctx.fillStyle = "yellow"; ctx.fillText("PERFECT!", 100, 100);
            if(score >= 100) winGame();
        } else {
            score = Math.max(0, score - 10); // Penalty
        }
    };
}

// 3. Defense (Tap enemies)
function startDefenseGame(canvas, ctx) {
    let enemies = [], score = 0;
    
    function loop() {
        if(!gameActive) return;
        ctx.clearRect(0,0,300,350);
        ctx.font = "40px Arial"; ctx.fillText("🥟", 130, 175); // Protect this
        
        if(Math.random() < 0.03) enemies.push({x: Math.random()*280, y: 0});
        
        enemies.forEach((e, i) => {
            e.y += 1; 
            ctx.fillText("🥷", e.x, e.y);
            if(e.y > 150 && Math.abs(e.x - 130) < 30) { score -= 10; enemies.splice(i,1); } // Hit center
        });
        
        document.getElementById('power-fill').style.width = score + "%";
        if(score >= 100) winGame();
        animationFrame = requestAnimationFrame(loop);
    }
    loop();
    
    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        enemies = enemies.filter(en => {
            if(Math.hypot(en.x - x, en.y - y) < 40) { score += 10; return false; }
            return true;
        });
    };
}

// 4. Tap / Boss Game (Simple mash)
function startTapGame(canvas, ctx) {
    let score = 0;
    ctx.font = "80px Arial"; ctx.fillStyle = "white"; ctx.textAlign = "center";
    
    function draw() {
        ctx.clearRect(0,0,300,350);
        ctx.fillText(score < 100 ? "🦊" : "✨", 150, 200);
    }
    draw();
    
    canvas.onclick = () => {
        score += 8;
        document.getElementById('power-fill').style.width = score + "%";
        ctx.fillText("💥", Math.random()*300, Math.random()*350);
        setTimeout(draw, 100);
        if(score >= 100) winGame();
    };
}

// 5. Whack-a-Mole (Shadow Clone)
function startWhackGame(canvas, ctx) {
    let score = 0, clones = [];
    
    function spawn() {
        clones = [];
        for(let i=0; i<3; i++) {
            clones.push({
                x: Math.random()*250, y: Math.random()*300, 
                isReal: Math.random() > 0.7 
            });
        }
    }
    spawn();

    function loop() {
        if(!gameActive) return;
        ctx.clearRect(0,0,300,350);
        ctx.font = "40px Arial";
        clones.forEach(c => ctx.fillText(c.isReal ? "🦊" : "💨", c.x, c.y));
        animationFrame = requestAnimationFrame(loop);
    }
    loop();

    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        clones.forEach(c => {
            if(Math.hypot(c.x - clickX, c.y - clickY) < 40) {
                if(c.isReal) { score += 20; spawn(); }
                else score -= 5;
            }
        });
        document.getElementById('power-fill').style.width = score + "%";
        if(score >= 100) winGame();
    }
}

function winGame() {
    gameActive = false;
    alert("Jutsu Success! Scroll Acquired 📜");
    scrolls++;
    if(scrolls < 6) {
        missions[scrolls].unlocked = true;
        enterMap();
    } else {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('final-screen').classList.add('active');
        initNoButton();
    }
}

function initNoButton() {
    const noBtn = document.getElementById('noBtn');
    noBtn.onmouseover = () => {
        noBtn.style.position = 'fixed';
        noBtn.style.left = Math.random()*70+'vw';
        noBtn.style.top = Math.random()*70+'vh';
    };
}

function celebrate() {
    alert("KAI! The Genjutsu is broken. See you in the Hidden Leaf! ❤️💍");
}
