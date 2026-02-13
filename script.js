let scrolls = 0;
let animationFrame;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const missions = [
    { id: 1, name: "Chakra Charge", icon: "🌀", instr: "Tap/Click repeatedly to charge!", unlocked: true },
    { id: 2, name: "Ramen Catch", icon: "🍜", instr: "Catch the falling Ramen (🍥)!", unlocked: false },
    { id: 3, name: "Kunai Dodge", icon: "🗡️", instr: "Dodge the falling Kunai!", unlocked: false },
    { id: 4, name: "Shadow Clone", icon: "👥", instr: "Click only the REAL Naruto (🦊)!", unlocked: false },
    { id: 5, name: "Golibaje Guard", icon: "🥟", instr: "Tap Ninjas before they reach the snack!", unlocked: false },
    { id: 6, name: "Demon Duel", icon: "👹", instr: "Mash the screen to overpower the Demon!", unlocked: false }
];

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function enterMap() { showScreen('map-screen'); renderMap(); }

function renderMap() {
    const grid = document.getElementById('mapGrid');
    grid.innerHTML = '';
    missions.forEach(m => {
        const div = document.createElement('div');
        div.className = `grid-item ${m.unlocked ? '' : 'locked'}`;
        div.innerHTML = `<span>${m.icon}</span><div class="grid-label">${m.name}</div>`;
        if (m.unlocked) div.onclick = () => startMission(m);
        grid.appendChild(div);
    });
    document.getElementById('scroll-count').innerText = scrolls;
}

function startMission(m) {
    showScreen('game-container');
    document.getElementById('game-title').innerText = m.name;
    document.getElementById('game-instruction').innerText = m.instr;
    document.getElementById('power-fill').style.width = "0%";
    cancelAnimationFrame(animationFrame);
    canvas.width = 300; canvas.height = 350;
    
    if (m.id === 2) runCatchGame("🍥");
    else if (m.id === 3) runDodgeGame();
    else if (m.id === 5) runDefenseGame();
    else runTapGame();
}

// GAME: Catching Items
function runCatchGame(target) {
    let x = 150, items = [], score = 0;
    canvas.onmousemove = (e) => x = e.offsetX;
    canvas.ontouchmove = (e) => x = e.touches[0].clientX - canvas.offsetLeft;

    function loop() {
        ctx.clearRect(0,0,300,350);
        ctx.font = "30px Arial";
        ctx.fillText("🦊", x - 15, 330);
        if(Math.random() < 0.05) items.push({x: Math.random()*280, y: 0});
        items.forEach((item, i) => {
            item.y += 4; ctx.fillText(target, item.x, item.y);
            if(item.y > 310 && Math.abs(item.x - x) < 30) { items.splice(i, 1); score += 10; }
        });
        document.getElementById('power-fill').style.width = score + "%";
        if(score >= 100) completeMission(); else animationFrame = requestAnimationFrame(loop);
    }
    loop();
}

// GAME: Dodging Items
function runDodgeGame() {
    let x = 150, hazards = [], progress = 0;
    canvas.onmousemove = (e) => x = e.offsetX;
    canvas.ontouchmove = (e) => x = e.touches[0].clientX - canvas.offsetLeft;

    function loop() {
        ctx.clearRect(0,0,300,350);
        ctx.font = "30px Arial"; ctx.fillText("🏃", x - 15, 330);
        if(Math.random() < 0.07) hazards.push({x: Math.random()*280, y: 0});
        hazards.forEach(h => {
            h.y += 6; ctx.fillText("🗡️", h.x, h.y);
            if(h.y > 310 && Math.abs(h.x - x) < 20) { alert("Hit! Restarting..."); startMission(missions[2]); }
        });
        progress += 0.4; document.getElementById('power-fill').style.width = progress + "%";
        if(progress >= 100) completeMission(); else animationFrame = requestAnimationFrame(loop);
    }
    loop();
}

// GAME: Defending Target
function runDefenseGame() {
    let enemies = [], progress = 0;
    canvas.onclick = (e) => {
        enemies = enemies.filter(en => Math.hypot(en.x - e.offsetX, en.y - (e.offsetY - 20)) > 30);
        progress += 5;
    };
    function loop() {
        ctx.clearRect(0,0,300,350);
        ctx.font = "40px Arial"; ctx.fillText("🥟", 130, 180);
        if(Math.random() < 0.04) enemies.push({x: Math.random()*280, y: Math.random()*350});
        enemies.forEach(en => ctx.fillText("🥷", en.x, en.y));
        document.getElementById('power-fill').style.width = progress + "%";
        if(progress >= 100) completeMission(); else animationFrame = requestAnimationFrame(loop);
    }
    loop();
}

function runTapGame() {
    let p = 0;
    canvas.onclick = () => { p += 15; document.getElementById('power-fill').style.width = p + "%"; if(p >= 100) completeMission(); }
}

function completeMission() {
    cancelAnimationFrame(animationFrame);
    alert("MISSION CLEAR! Scroll Obtained 📜");
    scrolls++;
    if(scrolls < 6) { missions[scrolls].unlocked = true; enterMap(); }
    else { showScreen('final-screen'); initNoButton(); }
}

function goBackToMap() { cancelAnimationFrame(animationFrame); enterMap(); }

function initNoButton() {
    const noBtn = document.getElementById('noBtn');
    noBtn.onmouseover = () => { noBtn.style.position = 'fixed'; noBtn.style.left = Math.random()*70+'vw'; noBtn.style.top = Math.random()*70+'vh'; };
}

function celebrate() { alert("YES! The Final Jutsu is Complete! ❤️💍"); }
