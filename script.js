const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let scrollsCollected = 0;
let animationFrame;

const missions = [
    { id: 1, name: "Chakra Charge", icon: "🌀", instr: "Tap/Click screen repeatedly!", unlocked: true },
    { id: 2, name: "Ramen Catch", icon: "🍜", instr: "Move mouse/finger to catch Ramen!", unlocked: false },
    { id: 3, name: "Kunai Dodge", icon: "🗡️", instr: "Don't let the Kunai touch you!", unlocked: false },
    { id: 4, name: "Shadow Clone", icon: "👥", instr: "Click only the REAL Naruto (🦊)!", unlocked: false },
    { id: 5, name: "Protect Golibaje", icon: "🥟", instr: "Click the ninjas before they eat!", unlocked: false },
    { id: 6, name: "Demon Duel", icon: "👺", instr: "Mash screen to overpower the Demon!", unlocked: false }
];

function enterMap() {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('map-screen').style.display = 'block';
    renderMap();
}

function renderMap() {
    const grid = document.getElementById('mapGrid');
    grid.innerHTML = '';
    missions.forEach(m => {
        const div = document.createElement('div');
        div.className = `grid-item ${m.unlocked ? '' : 'locked'}`;
        div.innerHTML = `<span>${m.icon}</span><br>${m.name}`;
        if (m.unlocked) div.onclick = () => startMission(m);
        grid.appendChild(div);
    });
}

function startMission(m) {
    document.getElementById('map-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('game-title').innerText = m.name;
    document.getElementById('game-instruction').innerText = m.instr;
    
    cancelAnimationFrame(animationFrame);
    canvas.width = 300; canvas.height = 400;
    
    if (m.id === 2) runRamenCatch();
    else if (m.id === 3) runKunaiDodge();
    else if (m.id === 5) runGolibajeDefense();
    else runStandardTap(m.id);
}

// GAME 3: KUNAI DODGE LOGIC
function runKunaiDodge() {
    let playerX = 150;
    let kunais = [];
    let dodgeScore = 0;

    canvas.onmousemove = (e) => playerX = e.offsetX;
    canvas.ontouchmove = (e) => playerX = e.touches[0].clientX - canvas.offsetLeft;

    function loop() {
        ctx.clearRect(0,0,300,400);
        ctx.fillText("🏃", playerX - 10, 380);
        
        if(Math.random() < 0.05) kunais.push({x: Math.random()*300, y: 0});
        
        kunais.forEach((k, i) => {
            k.y += 5;
            ctx.fillText("🗡️", k.x, k.y);
            if(k.y > 360 && Math.abs(k.x - playerX) < 20) {
                alert("Hit! Restarting Mission...");
                startMission(missions[2]);
            }
        });
        
        dodgeScore += 0.5;
        document.getElementById('power-fill').style.width = dodgeScore + "%";
        if(dodgeScore >= 100) completeMission();
        else animationFrame = requestAnimationFrame(loop);
    }
    loop();
}

// STANDARD CLICKER FOR 1, 4, 6
function runStandardTap(id) {
    let p = 0;
    canvas.onclick = () => {
        p += 10;
        document.getElementById('power-fill').style.width = p + "%";
        if(p >= 100) completeMission();
    }
}

function completeMission() {
    cancelAnimationFrame(animationFrame);
    alert("Scroll Collected! 📜");
    scrollsCollected++;
    if(scrollsCollected < 6) {
        missions[scrollsCollected].unlocked = true;
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('map-screen').style.display = 'block';
        renderMap();
    } else {
        showFinal();
    }
}

function showFinal() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('final-screen').style.display = 'block';
    
    const noBtn = document.getElementById('noBtn');
    noBtn.onmouseover = () => {
        noBtn.style.position = 'fixed';
        noBtn.style.left = Math.random()*80+'vw';
        noBtn.style.top = Math.random()*80+'vh';
    }
}
