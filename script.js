
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 10;
let ballDX = 3;
let ballDY = -3;
let ballColor = "#000"; // Added this line to set initial ball color

let paddleHeight = 75;
let paddleWidth = 10;
let playerPaddleY = (canvas.height - paddleHeight) / 2;

let totalTouches = 0;
let touchesSinceLoss = 0;

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
  ctx.fillStyle = "#000"; // Changed this line to set paddle color to black
  ctx.fill();
  ctx.closePath();
}
function addPaddleHeight() {
paddleHeight = 100;
}

function subtractPaddleHeight() {
paddleHeight = 40;
}
function resetPaddleHeight() {
paddleHeight = 75;
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle(0, playerPaddleY);

  if (ballY + ballDY < ballRadius || ballY + ballDY > canvas.height - ballRadius) { 
    ballDY = -ballDY; 
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

  if (ballX + ballDX < ballRadius + paddleWidth) { // Left wall collision
    if (ballY + ballDY > playerPaddleY && ballY + ballDY < playerPaddleY + paddleHeight) {
      ballDX = -ballDX;
      ballDY += 0.5;
      totalTouches++;
      touchesSinceLoss++;
      ballDX *= 1.2; // Increase ball speed
     ballDY *= 1.2;
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
}

document.addEventListener("keydown", e => {
  if (e.keyCode == 38) { // up arrow
    playerPaddleY -= 15;
  } else if (e.keyCode == 40) { // down arrow
    playerPaddleY += 15;
  }
});

setInterval(draw, 10);

