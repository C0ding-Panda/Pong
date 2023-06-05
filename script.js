function checkOrientation() {
  // Get the width and height of the device
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Check if the width is less than 1000 pixels and the height is greater than the width
  if (width < 1000 && height > width) {
    // Show the orientation message
    document.getElementById("orientation-message").style.display = "block";
  } else {
    // Hide the orientation message
    document.getElementById("orientation-message").style.display = "none";
  }
}

// Call the checkOrientation function on page load and on window resize
window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);

const fullscreenButton = document.getElementById("fullscreen-button");
const viewToFocus = document.getElementById("view-to-focus");

fullscreenButton.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    document.body.style.overflow = "auto";
  } else {
    viewToFocus.focus();
    document.documentElement.requestFullscreen();
    document.body.style.overflow = "hidden";
  }
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 15;
let ballDX = 3;
let ballDY = -3;
let ballColor = "#000"; // Added this line to set initial ball color

let paddleHeight = 110;
let paddleWidth = 10;
let playerPaddleY = (canvas.height - paddleHeight) / 2;

let totalTouches = 0;
let touchesSinceLoss = 0;
let highScore = 0;

const pong_sound = document.getElementById("pong-sound");
const ding_sound = document.getElementById("ding-sound");
let allowSound = false;
async function activateAudio() {
  try {
    await navigator.mediaDevices.requestPermission('audio');
  } catch (error) {
  }
}
function activateAudio() {
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
  ctx.fillStyle = "#cc9efe"; // Changed this line to set paddle color to black
  ctx.fill();
  ctx.closePath();
}
function addPaddleHeight() {
  paddleHeight = 140;
}

function subtractPaddleHeight() {
  paddleHeight = 80;
}
function resetPaddleHeight() {
  paddleHeight = 110;
}
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

let ballSpeed = 2;
let ballAngle = 3;
let xSpeed = 4;
let ySpeed = 4;


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle(0, playerPaddleY);

  if (ballY + ySpeed < ballRadius || ballY + ySpeed > canvas.height - ballRadius) {//top or bottom wall collision
    ySpeed *= -1;
    ballColor = getRandomColor();
  }

  if (ballX + xSpeed < ballRadius + paddleWidth) { // paddle collision
    if (ballY + ySpeed > playerPaddleY && ballY + ySpeed < playerPaddleY + paddleHeight) {
      ySpeed, xSpeed *= 1.04;
      xSpeed *= -1;
      totalTouches++;
      touchesSinceLoss++;
      if (totalTouches > highScore) {
        highScore = totalTouches;
      }
      if (allowSound == true) {
        pong_sound.play();
      }
      ballColor = '#000';
    } else {
      alert("You lost!/Du hast verloren! Total touches/Berührungen: " + totalTouches);
      ballAngle = Math.PI * (Math.random() - 0.5);
      ballY = Math.random() * (canvas.height - 2 * ballRadius - 1) + ballRadius;
      ballX = Math.random() * (canvas.width - ballRadius - paddleWidth - 1) + paddleWidth + ballRadius;
      totalTouches = 0;
    }
  } else if (ballX + xSpeed > canvas.width - ballRadius) { // right wall collision
    xSpeed *= -1;
    if (allowSound == true) {
      ding_sound.currentTime = 0;
      ding_sound.pause();
      ding_sound.play();
    }
    
    ballColor = getRandomColor();
  }

  ballX += xSpeed;
  ballY += ySpeed;

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
    if (started == true) {
      requestAnimationFrame(draw);
    }
  }, 10);
let started = false;
function startStop() {
  if (started == true) {
    started = false;
    cancelAnimationFrame(draw);
  } else {
    started = true;
    ballY = Math.random() * (canvas.height - 2 * ballRadius - 1) + ballRadius;
    ballX = Math.random() * (canvas.width / 2 - ballRadius - paddleWidth * 2 - 2) + canvas.width / 2 + ballRadius;
    requestAnimationFrame(draw);
  }
}    
document.getElementById("start-pause-button").addEventListener("click", startStop);