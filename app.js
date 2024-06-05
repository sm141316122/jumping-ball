// 基本設定
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const unit = 50;
const radius = 25;
const row = canvas.height / unit;
const column = canvas.width / unit;
let bounse = 0;

// 初始設定
let allBricks = [];
// 設定磚塊
class Brick {
  constructor() {
    this.setPosition();
    this.drawBrick();
  }

  setPosition() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;

    let samePos = false;
    function checkIsSame(newBrick) {
      for (let i = 0; i < allBricks.length; i++) {
        if (
          (allBricks[i].x == newBrick.x && allBricks[i].y == newBrick.y) ||
          (allBricks[i].x == 100 && allBricks[i].y == 100)
        ) {
          return true;
        }
      }

      return false;
    }

    do {
      samePos = checkIsSame(this);
    } while (samePos);
    {
      this.x = Math.floor(Math.random() * column) * unit;
      this.y = Math.floor(Math.random() * row) * unit;
    }
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  getHit() {
    this.x = -100;
    this.y = -100;
  }
}
// 設定球
class Ball {
  constructor() {
    this.setPosition();
    this.drawBall();
    this.dirX = 10;
    this.dirY = 10;
  }

  setPosition() {
    this.x = 100;
    this.y = 100;
  }

  drawBall() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
  }

  move() {
    this.x += this.dirX;
    this.y += this.dirY;
  }
}
// 設定棒子
class Paddle {
  constructor() {
    this.paddleWidth = 300;
    this.paddleheight = 5;
    this.setPos();
    this.drawPaddle();
  }

  setPos() {
    this.x = canvas.width / 2 - this.paddleWidth / 2;
    this.y = 600;
  }

  drawPaddle() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.paddleWidth, this.paddleheight);
  }
}

// 製作磚塊
while (allBricks.length < 10) {
  let brick = new Brick();
  allBricks.push(brick);
}
// 製作球
let ball = new Ball();
// 製作棒子
let paddle = new Paddle();

// 移動棒子
canvas.addEventListener("mousemove", (e) => {
  paddle.x = e.clientX;
});

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < allBricks.length; i++) {
    allBricks[i].drawBrick();
  }
  ball.drawBall();
  paddle.drawPaddle();

  // 球打到磚塊
  let gameOver = true;
  for (let brick of allBricks) {
    // 檢查是否還有磚塊
    if (brick.x != -100) {
      gameOver = false;
    }

    if (
      ball.x >= brick.x - radius &&
      ball.x <= brick.x + unit - radius &&
      ball.y >= brick.y - radius &&
      ball.y <= brick.y + unit + radius
    ) {
      let choose = Math.floor(Math.random() * 2);
      if (choose == 0) {
        ball.dirX *= -1;
      } else {
        ball.dirY *= -1;
      }

      brick.x = -100;
      brick.y = -100;
    }
  }

  // 結束遊戲
  if (gameOver) {
    clearInterval(myDraw);
    alert("遊戲結束");
  }

  // 球打到棒子
  if (
    ball.x >= paddle.x - radius &&
    ball.x <= paddle.x + paddle.paddleWidth + radius &&
    ball.y >= paddle.y - radius &&
    ball.y <= paddle.y + radius
  ) {
    // 防止球卡在棒子裡面
    if (bounse == 0) {
      ball.dirY *= -1;
      if (ball.dirY > 0) {
        ball.y += radius * 2;
      } else {
        ball.y -= radius * 2;
      }
      bounse = 1;
    }
  } else {
    bounse = 0;
  }

  // 球打到邊界
  if (ball.y >= 700 - radius) {
    ball.dirY *= -1;
  }
  if (ball.x >= 1200 - radius) {
    ball.dirX *= -1;
  }
  if (ball.y <= radius) {
    ball.dirY *= -1;
  }
  if (ball.x <= radius) {
    ball.dirX *= -1;
  }

  ball.move();
}

let myDraw = setInterval(draw, 10);
