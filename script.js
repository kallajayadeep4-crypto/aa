const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerImg = new Image();
playerImg.src = "player.png";

let loseSound = document.getElementById("loseSound");

let player = {
  x: 100,
  y: 200,
  width: 60,
  height: 60,
  gravity: 0.5,
  velocity: 0
};

let pipes = [];
let pipeWidth = 60;
let gap = 150;
let gameOver = false;

// wait until image loads
playerImg.onload = function () {
  loop();
};

// controls
document.addEventListener("keydown", () => {
  player.velocity = -8;
});

// create pipes
function createPipe() {
  let topHeight = Math.random() * (canvas.height - gap);

  pipes.push({
    x: canvas.width,
    top: topHeight
  });
}

// update
function update() {
  if (gameOver) return;

  player.velocity += player.gravity;
  player.y += player.velocity;

  if (player.y > canvas.height || player.y < 0) {
    endGame();
  }

  pipes.forEach(pipe => {
    pipe.x -= 3;

    if (
      player.x < pipe.x + pipeWidth &&
      player.x + player.width > pipe.x &&
      (player.y < pipe.top ||
        player.y + player.height > pipe.top + gap)
    ) {
      endGame();
    }
  });

  pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
}

// draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + gap, pipeWidth, canvas.height);
  });
}

// loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// create pipes
setInterval(createPipe, 2000);

// end game
function endGame() {
  if (gameOver) return;
  gameOver = true;

  loseSound.play();
  alert("Game Over 😂");
}