
const button = document.querySelector('button');
button.addEventListener('click', requestAutoplayPermission);
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballDX = 3;
let ballDY = -3;
let ballColor = "#000"; // Added this line to set initial ball color

let paddleHeight = 90;
let paddleWidth = 10;
let playerPaddleY = (canvas.height - paddleHeight) / 2;

let totalTouches = 0;
let touchesSinceLoss = 0;
let highScore = 0;

const pong_sound = document.getElementById("pong-sound");
const ding_sound = document.getElementById("ding-sound");
let allowSound = false;
async function requestAutoplayPermission() {
  try {
    await navigator.mediaDevices.requestPermission('audio');
  } catch (error) {
  }
}
function requestAutoplayPermission() {
  allowSound = true;
}
function deactivateAudio() {
  allowSound = false;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0000ff"; // Changed this line to set paddle color to black
  ctx.fill();
  ctx.closePath();
}
function addPaddleHeight() {
  paddleHeight = 120;
}

function subtractPaddleHeight() {
  paddleHeight = 60;
}
function resetPaddleHeight() {
  paddleHeight = 90;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle(0, playerPaddleY,);

  if (ballY + ballDY < ballRadius || ballY + ballDY > canvas.height - ballRadius) { 
    ballDY = -ballDY; 
    if (allowSound == true) {
      ding_sound.currentTime = 0;
      ding_sound.pause();
      ding_sound.play();  
    }
    function getRandomColor() {
const letters = "0123456789ABCDEF";
let color = "#";
for (let i = 0; i < 6; i++) {
color += letters[Math.floor(Math.random() * 16)];
}
return color;
}

    ballColor = getRandomColor();
  }

  if (ballX + ballDX < ballRadius + paddleWidth) { // paddle collision
    if (ballY + ballDY > playerPaddleY && ballY + ballDY < playerPaddleY + paddleHeight) {
      ballDX = -ballDX;
      ballDY += 0.5;
      totalTouches++;
      touchesSinceLoss++;
      if (totalTouches > highScore) {
        highScore = totalTouches;
      }
      ballDX *= 1.07; // Increase ball speed
      ballDY *= 1.07;
      if (allowSound == true) {
        pong_sound.play();
      }
    ballColor = '#000';
    } else {
      alert("You lost!/Du hast verloren! Total touches/Berührungen: " + totalTouches);
      ballDX = 3;
      ballDY = -3;
      ballY = canvas.height / 2;
      ballX = canvas.width / 2;
      ballX = Math.random() * (canvas.width - ballRadius - paddleWidth - 1) + paddleWidth + ballRadius;
      totalTouches = 0;
    }
  } else if (ballX + ballDX > canvas.width - ballRadius) { // Right wall collision
    ballDX = -ballDX;
    if (allowSound == true) {
      ding_sound.currentTime = 0;
      ding_sound.pause();
      ding_sound.play();
    }
    function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
    } 

    ballColor = getRandomColor();
  }

  ballX += ballDX;
  ballY += ballDY;
document.getElementById("total-touches").textContent = totalTouches.toString();
document.getElementById("touches-since-loss").textContent = touchesSinceLoss.toString();
document.getElementById("high-score").textContent = highScore.toString();
}
let moveUp = false;
let moveDown = false;

document.addEventListener("keydown", e => {
  if (e.key === "u") {
    moveUp = true;
  } else if (e.key === "d") {
    moveDown = true;
  }
});

document.addEventListener("keyup", e => {
  if (e.key === "u") {
    moveUp = false;
  } else if (e.key === "d") {
    moveDown = false;
  }
});


document.getElementById("left-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveUp = true;
});

document.getElementById("left-btn").addEventListener("touchend", (e) => {
  e.preventDefault();
  moveUp = false;
});

document.getElementById("right-btn").addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveDown = true;
});

document.getElementById("right-btn").addEventListener("touchend", (e) => {
  e.preventDefault();
  moveDown = false;
});


setInterval(() => {
  if (moveUp && playerPaddleY > 0) { // added check to prevent moving paddle off the top of the canvas
    playerPaddleY -= 5;
  }
  if (moveDown && playerPaddleY + paddleHeight < canvas.height) { // added check to prevent moving paddle off the bottom of the canvas
    playerPaddleY += 5;
  }
}, 10);


setInterval(draw, 10);

