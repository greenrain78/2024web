class GameContainer {
  constructor(canvasId, level) {
    // 설정 값
    this.hearts = 1;
    this.level = level;
    // 캔버스 설정
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    // 게임 요소
    this.gameBoard = new GameBoard(this.canvas);
    this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 30);
    this.paddle = new Paddle(
      (this.canvas.width - 75) / 2,
      this.canvas.height - 10
    );
    this.bricks = [];
    this.collisionManager = new CollisionManager(
      this,
      this.ball,
      this.paddle,
      this.bricks,
      this.canvas
    );
    // 게임 초기화
    this.init();
  }
  run() {
    // 게임 루프 시작
    this.loop();
  }
  init() {
    this.createBricks();
    this.initListeners();
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
    if (this.level === 1) {
      var rows = 5;
      var columns = 8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          var x = c * (75 + 10) + 30;
          var y = r * (20 + 10) + 30;
          this.bricks.push(new Brick(x, y));
        }
      }
    }
  }

  loop() {
    // 캔버스 초기화
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 게임 요소 그리기
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);
    this.bricks.forEach((brick) => {
      brick.draw(this.ctx);
    });
    // 충돌 체크
    this.collisionManager.checkCollisions();

    // 게임 오버 체크 및 재귀 호출
    if (this.hearts > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      alert("GAME OVER");
    }
  }
}

class GameBoard {
  constructor(canvas) {
    this.canvas = canvas;
    // 캔버스 크기 조정
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
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
    this.width = 75;
    this.height = 20;
    this.x = x;
    this.y = y;
    this.status = 1;
  }

  draw(ctx) {
    // 안깨진 벽돌만 그리기
    if (this.status === 1) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  }
}

class CollisionManager {
  constructor(game_container, ball, paddle, bricks, canvas) {
    this.game_container = game_container;
    this.ball = ball;
    this.paddle = paddle;
    this.bricks = bricks;
    this.canvas = canvas;
  }

  checkCollisions() {
    // 충돌 체크
    this.checkWallCollision();
    this.checkPaddleCollision();
    this.checkBrickCollisions();
    // 게임 오버 체크
    this.checkGameOver();
    // 게임 요소 이동
    this.ball.move();
  }
  checkGameOver() {
    // 게임 오버 체크
    if (this.ball.y > this.canvas.height) {
      this.game_container.hearts--;
    }
  }
  checkWallCollision() {
    // 벽과 충돌 체크
    if (
      this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius ||
      this.ball.x + this.ball.dx < this.ball.radius
    ) {
      this.ball.bounceX();
    }
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.bounceY();
    }
  }

  checkPaddleCollision() {
    // 패들과 충돌 체크
    if (
      this.ball.x > this.paddle.x &&
      this.ball.x < this.paddle.x + this.paddle.width &&
      this.ball.y + this.ball.dy >
        this.canvas.height - this.paddle.height - this.ball.radius
    ) {
      this.ball.bounceY();
    }
  }

  checkBrickCollisions() {
    // 벽돌과 충돌 체크
    this.bricks.forEach((brick) => {
      if (brick.status === 1) {
        if (this.isRectCollision(brick)) {
          this.ball.bounceY();
          brick.status = 0;
        }
      }
    });
  }
  isRectCollision(obj) {
    if (
      this.ball.x > obj.x &&
      this.ball.x < obj.x + obj.width &&
      this.ball.y > obj.y &&
      this.ball.y < obj.y + obj.height
    ) {
      return true;
    } else {
      return false;
    }
  }
}

$(document).ready(function () {
  // 게임 시작
  let game = new GameContainer("gameCanvas", 1);
  game.run();
});
