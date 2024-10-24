// Mendapatkan elemen canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fungsi untuk mengatur ukuran canvas
function resizeCanvas() {
    canvas.width = window.innerWidth; // Mengatur lebar canvas ke lebar jendela
    canvas.height = window.innerHeight; // Mengatur tinggi canvas ke tinggi jendela
}

// Panggil fungsi resizeCanvas saat halaman dimuat
resizeCanvas();

// Mendefinisikan ukuran canvas
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// Mendefinisikan pemain
const player = {
    x: canvasWidth / 2 - 25, // Memusatkan pemain
    y: canvasHeight - 50,
    width: 50,
    height: 50,
    speed: 5
};

// Mendefinisikan musuh
const enemy = {
    x: Math.random() * (canvasWidth - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: 2,
    hit: false
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

// Menggambar pemain, musuh, peluru, dan skor
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gambar pemain
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Gambar musuh
    ctx.fillStyle = enemy.hit ? 'orange' : 'red'; // Warna saat terkena tembakan
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Gambar peluru
    if (bullet.fired) {
        ctx.fillStyle = 'black';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    // Gambar skor
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Mengupdate posisi pemain, musuh, dan peluru
function update() {
    // Mengupdate posisi pemain
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }

    // Mengupdate posisi musuh
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
        enemy.y = 0;
        enemy.x = Math.random() * (canvas.width - 50);
        enemy.hit = false; // Reset status hit
    }

    // Mengupdate posisi peluru
    if (bullet.fired) {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullet.fired = false;
        }
    }

    // Cek apakah peluru mengenai musuh
    if (bullet.fired && bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x && bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
        bullet.fired = false; // Reset peluru
        enemy.hit = true; // Set musuh terkena tembakan score += 10; // Tambah skor
        setTimeout(() => {
            enemy.hit = false; // Reset status hit setelah beberapa detik
        }, 500); // Animasi selama 500ms
    }
}

// Mengatur event listener untuk keyboard
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ') {
        if (!bullet.fired) {
            bullet.x = player.x + player.width / 2;
            bullet.y = player.y;
            bullet.fired = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'ArrowLeft') {
        leftPressed = false;
    }
});

// Mengatur event listener untuk perubahan ukuran jendela
window.addEventListener('resize', () => {
    resizeCanvas();
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    player.x = canvasWidth / 2 - 25; // Memusatkan pemain
    player.y = canvasHeight - 50;
});

// Menggambar dan mengupdate game
setInterval(() => {
    draw();
    update();
}, 1000 / 60); // 60 FPS
