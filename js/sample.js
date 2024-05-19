backgroundImages = ["img_1.jpg", "img_2.jpg", "img_3.jpg"]; // 배경 이미지
brickImages = ["img_1.jpg", "img_2.jpg", "img_3.jpg"]; // 벽돌 이미지
itemEffectImages = {"addBall": "item.jpg"};

class GameDisplay {
  constructor() {
    this.level = 1; // 레벨
    this.hearts = 2; // 생명
    this.score = 0; // 점수
    this.isPaused = false; // 일시정지 여부
    this.backgroundImgIdx = 0; // 배경 이미지 인덱스
    this.brickImgIdx = 0; // 벽돌 이미지 인덱스
    this.brickImg = new Image(); // 벽돌 이미지
    // node
    this.backgroundNode = $("#background");
    this.scoreNode = $("#score");
    this.heartsNode = $("#hearts");
    this.levelNode = $("#level");
    this.initListeners();
  }
  initListeners() {
    $("#backgroundBtn1").click(() => {
      this.updateBackgroundImg(0);
    });
    $("#backgroundBtn2").click(() => {
      this.updateBackgroundImg(1);
    });
    $("#backgroundBtn3").click(() => {
      this.updateBackgroundImg(2);
    });
    $("#brickBtn1").click(() => {
      this.updateBrickImg(0);
    });
    $("#brickBtn2").click(() => {
      this.updateBrickImg(1);
    });
    $("#brickBtn3").click(() => {
      this.updateBrickImg(2);
    });
  }
  updateBackgroundImg(idx) {
    this.backgroundImgIdx = idx;
    // 배경 이미지 업데이트
    this.backgroundNode.css(
      "background-image",
      "url(../assets/background/" + backgroundImages[this.backgroundImgIdx] + ")"
    );
  }
  updateBrickImg(idx) {
    this.brickImgIdx = idx;
    this.brickImg = new Image();
    this.brickImg.src = "../assets/bricks/" + brickImages[this.brickImgIdx];
  }
  getBrickImg() {
    // 벽돌 이미지 가져오기
    return this.brickImg
  }
  updateScore(score) {
    // 점수 업데이트
    this.score += score;
    this.scoreNode.text(`Score: ${this.score}`);
  }
  updateHearts(hearts) {
    // 생명 업데이트
    this.hearts += hearts;
    this.heartsNode.text(`Hearts: ${this.hearts}`);
  }
  updateLevel(level) {
    // 레벨 업데이트
    this.level = level;
    this.levelNode.text(`Level: ${this.level}`);
  }
}
var gameDisplay = new GameDisplay();

class GameContainer {
  constructor(canvasId) {
    // 설정 값
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    // 게임 요소
    
    this.gameBoard = new GameBoard(this.canvas);
    this.ballList = [new Ball(this.gameBoard.width / 2, this.gameBoard.height - 300), new Ball(this.gameBoard.width / 3, this.gameBoard.height - 30)];
    this.itemList = [];
    this.paddle = new Paddle(
      (this.gameBoard.width - 75) / 2,
      this.gameBoard.height - 10
    );
    this.bricks = [];
    this.collisionManager = new CollisionManager(
      this.ballList,
      this.itemList,
      this.paddle,
      this.bricks,
      this.gameBoard,
      this
    );
    // 게임 초기화
    this.createDisplay();
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
    // 키보드 이벤트
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        // 스페이스바
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
          this.loop(); // 재개할 때 루프를 다시 시작
        }
      }
    });
  }

  createBricks() {
    // 레벨별 벽돌 생성
    if (gameDisplay.level === 1) {
      var rows = 5;
      var columns = 20;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          var x = c * (75 + 10) + 30;
          var y = r * (75 + 10) + 30;
          if (Math.random() < 0.1) {
            this.bricks.push(new ItemBrick(x, y, "addBall"));
          } else {
            this.bricks.push(new Brick(x, y));
          }
        }
      }
    }
  }
  createDisplay() {
    if (gameDisplay.level === 1) {
      gameDisplay.updateBackgroundImg(0);
      gameDisplay.updateBrickImg(0);
      gameDisplay.hearts = 2;
      gameDisplay.updateHearts(0);
      gameDisplay.score = 0;
      gameDisplay.updateScore(0);
    }
  }

  loop() {
    if (this.isPaused) {
      return; // 일시정지 상태이면 루프를 중단
    }
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
    this.itemList.forEach((item) => {
      item.draw(this.ctx);
    });
    // 충돌 체크
    this.collisionManager.checkCollisions();

    // 게임 오버 체크 및 재귀 호출
    if (gameDisplay.hearts > 0) {
      requestAnimationFrame(() => this.loop());
    } 
    else {
      console.log(gameDisplay.hearts);
      alert("Game Over");
    }
  }
  // 공 개수 추가 아이템 
  addBall() {
    var paddlex = this.paddle.x + this.paddle.width/2; 
    var paddley = this.paddle.y - 10; // 공이 패들 약간 위에서 생성되도록 
    gameDisplay.updateHearts(1);
    this.ballList.push(new Ball(paddlex, paddley));
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
    this.width = 300;
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
    this.height = 75;
    this.x = x;
    this.y = y;
    this.status = 1;
  }

  draw(ctx) {
    // 안깨진 벽돌만 그리기
    var img = gameDisplay.getBrickImg();
    if (this.status === 1) {
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }
  }
}
class ItemBrick extends Brick {
  constructor(x, y, effect) {
    super(x, y);
    this.img = new Image();
    this.img.src= "../assets/bricks/" + itemEffectImages[effect];
    this.effect = effect; //아이템 이름  
  }

  draw(ctx) {
    if (this.status === 1) {
      super.draw(ctx); // 원래 벽돌 이미지를 그림

      // 아이템 이미지를 작게 그림
      ctx.drawImage(
        this.img,
        this.x + this.width / 4, 
        this.y + this.height / 4, 
        this.width / 2, 
        this.height / 2 
      );
    }
    
  }

  applyEffect(game) {
    // 아이템1. 공 개수 추가 
    console.log(this.effect);
    if (this.effect === "addBall") {
      game.itemList.push(new Item(this.x, this.y, this.effect));
      // game.addBall();
    }
  }
}
class Item {
  constructor(x, y, effect) {
    this.x = x;
    this.y = y;
    this.dy = 3;
    this.width = 20;
    this.height = 20;
    this.radius = 10;
    this.effect = effect;
    this.img = new Image();
    this.img.src = "../assets/bricks/" + itemEffectImages[effect];
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  move() {
    this.y += this.dy;
  }
}
class CollisionManager {
  constructor(ballList, itemList, paddle, bricks, gameBoard, gameContainer) {
    this.ballList = ballList;
    this.itemList = itemList;
    this.paddle = paddle;
    this.bricks = bricks;
    this.gameBoard = gameBoard;
    this.gameContainer = gameContainer;
  }

  checkCollisions() {
    // 충돌 체크
    this.ballList.forEach((ball) => {
      this.checkWallCollision(ball);
      if (this.isPaddleCollision(ball)){
        ball.bounceY();
      }
      
      this.checkBrickCollisions(ball);
      // 게임 오버 체크
      this.checkGameOver(ball);
      // 게임 요소 이동
      ball.move();
    });
    this.itemList.forEach((item) => {
      if (this.isPaddleCollision(item)){
        this.itemList.splice(this.itemList.indexOf(item), 1); // 아이템 제거
        this.gameContainer.addBall();
      }
      if (this.isOutOfGameBoard(item)) {
        this.itemList.splice(this.itemList.indexOf(item), 1); // 아이템 제거
      }
      item.move();
    });
  }
  checkGameOver(ball) {
    // 게임 오버 체크
    if(ball.y > this.gameBoard.height) {
      this.gameContainer.ballList.splice(this.gameContainer.ballList.indexOf(ball), 1); // 공 제거
      gameDisplay.updateHearts(-1); // 생명 감소
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

  isPaddleCollision(ball) {
    // 패들과 충돌 체크
    if (
      ball.x > this.paddle.x &&
      ball.x < this.paddle.x + this.paddle.width &&
      ball.y + ball.dy >
        this.gameBoard.height - this.paddle.height - ball.radius
    ) {
      return true;
    }
  }
  isOutOfGameBoard(obj) {
    // 게임 보드 밖으로 나갔는지 체크
    if (obj.y > this.gameBoard.height) {
      return true;
    }
  }

  checkBrickCollisions(ball) {
    // 벽돌과 충돌 체크
    this.bricks.forEach((brick) => {
      if (brick.status === 1) {
        if (this.isRectCollision(ball, brick)) {
          ball.bounceY();
          brick.status = 0;
          gameDisplay.updateScore(10);
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
  gameDisplay.updateLevel(1);
  let game = new GameContainer("gameCanvas");
  game.run();
});
