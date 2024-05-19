class Settings {
  constructor() {
    this.hearts = 2; // 생명 == 공이 바닥에 닿으면 하트 감소 == 공 개수 고려
    this.level = 1; // 레벨
    this.backgroundImg = "../assets/background/img_1.jpg"; // 배경 이미지
    this.brickImg = "../assets/bricks/img_1.jpg"; // 벽돌 이미지
    this.itemBrickImg = "../assets/bricks/item.jpg"; // 아이템 이미지 
  }
}

class GameContainer {
  constructor(canvasId, settings) {
    // 설정 값
    this.settings = settings;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    // 게임 요소
    this.gameBoard = new GameBoard(this.settings, this.canvas);
    this.ballList = [new Ball(this.gameBoard.width / 2, this.gameBoard.height - 300), new Ball(this.gameBoard.width / 3, this.gameBoard.height - 30)];
    this.paddle = new Paddle(
      (this.gameBoard.width - 75) / 2,
      this.gameBoard.height - 10
    );
    this.bricks = [];
    this.collisionManager = new CollisionManager(
      this.settings,
      this.ballList,
      this.paddle,
      this.bricks,
      this.gameBoard,
      this
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
    if (this.settings.level === 1) {
      var rows = 5;
      var columns = 20;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          var x = c * (75 + 10) + 30;
          var y = r * (75 + 10) + 30;
          if (Math.random() < 0.1) {
            this.bricks.push(new ItemBrick(x, y, this.settings,"addBall"));
          } else {
            this.bricks.push(new Brick(x, y, this.settings));
          }
          
          
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
    if (this.settings.hearts > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      alert("GAME OVER");
    }
  }

  // 공 개수 추가 아이템 
  addBall() {
    var paddlex = this.paddle.x + this.paddle.width/2; 
    var paddley = this.paddle.y - 10; // 공이 패들 약간 위에서 생성되도록 
    this.ballList.push(new Ball(paddlex, paddley));
  }
}

class GameBoard {
  constructor(settings, canvas) {
    this.settings = settings;
    this.canvas = canvas;
    // 전체 화면 크기로 캔버스 크기 조정
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // 캔버스 크기 조정
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    // 배경 이미지
    this.backgroundImg = new Image();
    this.backgroundImg.src = this.settings.backgroundImg;
  }
  draw(ctx) {
    ctx.drawImage(this.backgroundImg, 0, 0, this.width, this.height);
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
  constructor(x, y, settings) {
    this.settings = settings;
    this.img = new Image();
    this.img.src = this.settings.brickImg;
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
      // ctx.beginPath();
      // ctx.rect(this.x, this.y, this.width, this.height);
      // ctx.fillStyle = "#0095DD";
      // ctx.fill();
      // ctx.closePath();
    }
  }
}

class ItemBrick extends Brick {
  constructor(x,y,settings,effect) {
    super(x,y,settings);
    this.itemimg = new Image();
    this.itemimg.src = this.settings.itemBrickImg;
    this.effect = effect; //아이템 이름  
  }

  draw(ctx) {
    super.draw(ctx); // 원래 벽돌 이미지를 그림

    // 아이템 이미지를 작게 그림
    ctx.drawImage(
      this.itemimg,
      this.x + this.width / 4, 
      this.y + this.height / 4, 
      this.width / 2, 
      this.height / 2 
    );
  }

  applyEffect(game) {
    // 아이템1. 공 개수 추가 
    if (this.effect === "addBall") {
      game.addBall();
    }
  }
}

class CollisionManager {
  constructor(settings, ballList, paddle, bricks, gameBoard, gameContainer) {
    this.settings = settings;
    this.ballList = ballList;
    this.paddle = paddle;
    this.bricks = bricks;
    this.gameBoard = gameBoard;
    this.gameContainer = gameContainer;
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
      this.settings.hearts--;
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
          if (brick instanceof ItemBrick) {
            brick.applyEffect(this.gameContainer);
          }
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
  var settings = new Settings();
  let game = new GameContainer("gameCanvas", settings);
  game.run();
});
