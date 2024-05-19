class Settings {
  constructor() {
    this.hearts = 2; // 생명 == 공이 바닥에 닿으면 하트 감소 == 공 개수 고려
    this.level = 1; // 레벨
    this.backgroundImages = ["img_1.jpg", "img_2.jpg", "img_3.jpg"]; // 배경 이미지
    this.backgroundImgIdx = 0; // 배경 이미지 인덱스
    this.brickImg = "../assets/bricks/img_1.jpg"; // 벽돌 이미지
  }
  updateBackgroundImg(idx) {
    // 배경 이미지 업데이트
    this.backgroundImgIdx = idx;
  }
  getBackgroundImg() {
    // 배경 이미지 가져오기
    return this.backgroundImages[this.backgroundImgIdx];
  }
}
var settings = new Settings();
class GameContainer {
  constructor(canvasId) {
    // 설정 값
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    // 게임 요소
    this.gameBoard = new GameBoard(this.canvas);
    this.ballList = [new Ball(this.gameBoard.width / 2, this.gameBoard.height - 300), new Ball(this.gameBoard.width / 3, this.gameBoard.height - 30)];
    this.paddle = new Paddle(
      (this.gameBoard.width - 75) / 2,
      this.gameBoard.height - 10
    );
    this.bricks = [];
    this.collisionManager = new CollisionManager(
      this.ballList,
      this.paddle,
      this.bricks,
      this.gameBoard
    );
    // 게임 초기화
    this.createBricks();
    this.initListeners();
  }
  run() {
    // 게임 루프 시작
    this.loop();
  }
  initListeners() {
    // 마우스 이벤트
    this.canvas.addEventListener("mousemove", (event) => {
      let relativeX = event.clientX - this.canvas.offsetLeft;
      if (relativeX > 0 && relativeX < this.canvas.width) {
        this.paddle.x = relativeX - this.paddle.width / 2;
      }
    });
  }

  createBricks() {
    // 레벨별 벽돌 생성
    if (settings.level === 1) {
      var rows = 5;
      var columns = 20;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          var x = c * (75 + 10) + 30;
          var y = r * (75 + 10) + 30;
          this.bricks.push(new Brick(x, y, settings));
        }
      }
    }
  }

  loop() {
    // 배경 그리기
    this.gameBoard.draw(this.ctx);
    // 게임 요소 그리기
    this.ballList.forEach((ball) => {
      ball.draw(this.ctx);
    });
    this.paddle.draw(this.ctx);
    this.bricks.forEach((brick) => {
      brick.draw(this.ctx);
    });
    // 충돌 체크
    this.collisionManager.checkCollisions();

    // 게임 오버 체크 및 재귀 호출
    if (settings.hearts > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      alert("GAME OVER");
    }
  }
}

class GameBoard {
  constructor(canvas) {
    this.canvas = canvas;
    // 전체 화면 크기로 캔버스 크기 조정
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // 캔버스 크기 조정
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
  }
}
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 8;
    this.dy = -8;
    this.radius = 10;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  bounceX() {
    this.dx = -this.dx;
  }

  bounceY() {
    this.dy = -this.dy;
  }
}

class Paddle {
  constructor(x, y) {
    this.width = 75;
    this.height = 10;
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
}

class Brick {
  constructor(x, y) {
    this.img = new Image();
    this.img.src = settings.brickImg;
    this.width = 75;
    this.height = 75;
    this.x = x;
    this.y = y;
    this.status = 1;
  }

  draw(ctx) {
    // 안깨진 벽돌만 그리기
    if (this.status === 1) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}

class CollisionManager {
  constructor(ballList, paddle, bricks, gameBoard) {
    this.ballList = ballList;
    this.paddle = paddle;
    this.bricks = bricks;
    this.gameBoard = gameBoard;
  }

  checkCollisions() {
    // 충돌 체크
    this.ballList.forEach((ball) => {
      this.checkWallCollision(ball);
      this.checkPaddleCollision(ball);
      this.checkBrickCollisions(ball);
      // 게임 오버 체크
      this.checkGameOver(ball);
      // 게임 요소 이동
      ball.move();
    });
  }
  checkGameOver(ball) {
    // 게임 오버 체크
    if(ball.y > this.gameBoard.height) {
      settings.hearts--;
    }
  }
  checkWallCollision(ball) {
    // 벽과 충돌 체크
    if (
      ball.x + ball.dx > this.gameBoard.width - ball.radius ||
      ball.x + ball.dx < ball.radius
    ) {
      ball.bounceX();
    }
    if (ball.y + ball.dy < ball.radius) {
      ball.bounceY();
    }
  }

  checkPaddleCollision(ball) {
    // 패들과 충돌 체크
    if (
      ball.x > this.paddle.x &&
      ball.x < this.paddle.x + this.paddle.width &&
      ball.y + ball.dy >
        this.gameBoard.height - this.paddle.height - ball.radius
    ) {
      ball.bounceY();
    }
  }

  checkBrickCollisions(ball) {
    // 벽돌과 충돌 체크
    this.bricks.forEach((brick) => {
      if (brick.status === 1) {
        if (this.isRectCollision(ball, brick)) {
          ball.bounceY();
          brick.status = 0;
        }
      }
    });
  }
  isRectCollision(ball, obj) {
    if (
      ball.x > obj.x &&
      ball.x < obj.x + obj.width &&
      ball.y > obj.y &&
      ball.y < obj.y + obj.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}

$(document).ready(function () {
  // 게임 시작
  
  let game = new GameContainer("gameCanvas");
  game.run();
});
