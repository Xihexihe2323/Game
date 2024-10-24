// Mendapatkan elemen canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fungsi untuk mengatur ukuran canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Panggil fungsi resizeCanvas saat halaman dimuat
resizeCanvas();

// Mendefinisikan pemain
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5
};

// Mendefinisikan musuh
const enemy = {
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: 2,
    visible: true
};

// Mendefinisikan peluru
const bullet = {
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    speed: 5,
    fired: false
};

// Variabel skor
let score = 0;

// Variabel kontrol keyboard
let rightPressed = false;
let leftPressed = false;

// Event listeners untuk keyboard
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' && !bullet.fired) {
        fireBullet();
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function fireBullet() {
    bullet.x = player.x + player.width / 2 - bullet.width / 2;
    bullet.y = player.y;
    bullet.fired = true;
}

function resetEnemy() {
    enemy.x = Math.random() * (canvas.width - enemy.width);
    enemy.y = 0;
    enemy.visible = true;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gambar pemain
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Gambar musuh jika visible
    if (enemy.visible) {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
    
    // Gambar peluru
    if (bullet.fired) {
        ctx.fillStyle = 'black';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    // Gambar skor
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
    // Update posisi pemain
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }

    // Update posisi musuh
    if (enemy.visible) {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            resetEnemy();
        }
    }

    // Update posisi peluru
    if (bullet.fired) {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullet.fired = false;
        }
    }

    // Deteksi tumbukan
    if (enemy.visible && bullet.fired &&
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y) {
        
        score += 10;
        enemy.visible = false;
        bullet.fired = false;
        
        // Muncul kembali setelah 1 detik
        setTimeout(resetEnemy, 1000);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
