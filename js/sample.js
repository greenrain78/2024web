backgroundImages = ["img_1.jpg", "img_2.jpg", "img_3.jpg"]; // 배경 이미지
brickImages = ["img_1.jpg", "img_2.jpg", "img_3.jpg"]; // 벽돌 이미지
itemEffectImages = { addBall: "item.jpg" }; // 아이템 이미지
clothImages = [
  ["clothes1-1.png", "clothes1-2.png", "clothes1-3.png", "clothes1-4.png"],
  [
    "clothes2-1.png",
    "clothes2-2.png",
    "clothes2-3.png",
    "clothes2-4.png",
    "clothes2-5.png",
    "clothes2-6.png",
  ],
  [
    "clothes3-1.png",
    "clothes3-2.png",
    "clothes3-3.png",
    "clothes3-4.png",
    "clothes3-5.png",
    "clothes3-6.png",
  ],
];
ballImages = ["ball1.png", "ball2.png", "ball3.png"]; // 공 이미지
class GameDisplay {
  constructor() {
    this.level = 1; // 레벨
    this.hearts = 1; // 생명
    this.score = 0; // 점수
    this.isPaused = false; // 일시정지 여부
    this.backgroundImgIdx = 0; // 배경 이미지 인덱스
    this.brickImgIdx = 0; // 벽돌 이미지 인덱스
    this.brickImg = new Image(); // 벽돌 이미지
    this.ballImgIdx = 0; // 공 이미지 인덱스
    this.ballImg = new Image(); // 공 이미지
    this.closetList = []; // 옷 이미지
    // node
    this.backgroundNode = $("#background");
    this.scoreNode = $("#score");
    this.heartsNode = $("#hearts");
    this.levelNode = $("#level");
    this.closetListNode = $("#clothesList");
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
    $("#ballBtn1").click(() => {
      this.updateBallImg(0);
    });
    $("#ballBtn2").click(() => {
      this.updateBallImg(1);
    });
    $("#ballBtn3").click(() => {
      this.updateBallImg(2);
    });
  }
  updateBackgroundImg(idx) {
    this.backgroundImgIdx = idx;
    // 배경 이미지 업데이트
    this.backgroundNode.css(
      "background-image",
      "url(../assets/background/" +
        backgroundImages[this.backgroundImgIdx] +
        ")"
    );
  }
  updateBrickImg(idx) {
    this.brickImgIdx = idx;
    this.brickImg = new Image();
    this.brickImg.src = "../assets/bricks/" + brickImages[this.brickImgIdx];
  }
  getBrickImg() {
    // 벽돌 이미지 가져오기
    return this.brickImg;
  }
  updateBallImg(idx) {
    this.ballImgIdx = idx;
    this.ballImg = new Image();
    this.ballImg.src = "../assets/ball/" + ballImages[this.ballImgIdx];
  }
  getBallImg() {
    // 공 이미지 가져오기
    return this.ballImg;
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
  updateCloset(clothes) {
    // 옷장에 있는지 확인
    if (this.closetList.includes(clothes)) {
      console.log("이미 옷장에 있습니다.");
      return;
    }
    // 옷장에 추가
    this.closetList.push(clothes);
    // 옷장 업데이트
    this.closetListNode.html("");
    this.closetList.forEach((cloth) => {
      var img = new Image();
      img.src = "../assets/" + cloth;
      img.classList.add("clothes");
      this.closetListNode.append(img);
    });
  }
  resetCloset() {
    this.closetList = [];
    this.closetListNode.html("");
  }
}
var gameDisplay = new GameDisplay();

class GameContainer {
  constructor(canvasId) {
    // 설정 값
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    // 게임 요소
    this.cursor = new Cursor();
    this.gameBoard = new GameBoard(this.canvas);
    this.ballList = [
      new Ball(this.gameBoard.width / 3, this.gameBoard.height - 30),
    ];
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
      this.cursor.move(event.clientX, event.clientY);
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
      var rows = 3;
      var columns = 10;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          var x = c * (75 + 10) + 30;
          var y = r * (75 + 10) + 30;
          if (Math.random() < 0.1) {
            this.bricks.push(new ItemBrick(x, y, "addBall"));
          } else {
            this.bricks.push(new ClothBrick(x, y));
          }
        }
      }
    }else if (gameDisplay.level === 2) {
      var rows = 4;
      var columns = 15;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          var x = c * (75 + 10) + 30;
          var y = r * (75 + 10) + 30;
          if (Math.random() < 0.1) {
            this.bricks.push(new ItemBrick(x, y, "addBall"));
          } else {
            this.bricks.push(new ClothBrick(x, y));
          }
        }
      }
    } else if (gameDisplay.level === 3) {
      var rows = 5;
      var columns = 20;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          var x = c * (75 + 10) + 30;
          var y = r * (75 + 10) + 30;
          if (Math.random() < 0.1) {
            this.bricks.push(new ItemBrick(x, y, "addBall"));
          } else {
            this.bricks.push(new ClothBrick(x, y));
          }
        }
      }
    }
  }
  createDisplay() {
    gameDisplay.resetCloset();

    if (gameDisplay.level === 1) {
      gameDisplay.updateBackgroundImg(0);
      gameDisplay.updateBrickImg(0);
      gameDisplay.updateBallImg(0);
      gameDisplay.hearts = 1;
      gameDisplay.updateHearts(0);
      gameDisplay.score = 0;
      gameDisplay.updateScore(0);
    } else if (gameDisplay.level === 2) {
      gameDisplay.updateBackgroundImg(1);
      gameDisplay.updateBrickImg(1);
      gameDisplay.updateBallImg(1);
      gameDisplay.hearts = 1;
      gameDisplay.updateHearts(0);
      gameDisplay.score = 0;
      gameDisplay.updateScore(0);
    } else if (gameDisplay.level === 3) {
      gameDisplay.updateBackgroundImg(2);
      gameDisplay.updateBrickImg(2);
      gameDisplay.updateBallImg(2);
      gameDisplay.hearts = 1;
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
    this.cursor.draw(this.ctx);
    // 충돌 체크
    this.collisionManager.checkCollisions();

    // 게임 오버 체크 및 재귀 호출
    if (gameDisplay.hearts > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      alert("Game Over");
    }
  }
  // 공 개수 추가 아이템
  addBall() {
    var paddlex = this.paddle.x + this.paddle.width / 2;
    var paddley = this.paddle.y - 10; // 공이 패들 약간 위에서 생성되도록
    gameDisplay.updateHearts(1);
    this.ballList.push(new Ball(paddlex, paddley));
  }
}
class Cursor {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 50;
  }
  move(x, y) {
    this.x = x;
    this.y = y;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
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
    this.maxSpeed = 15;
    this.minSpeed = 5;
    this.radius = 50;
  }

  draw(ctx) {
    var img = gameDisplay.getBallImg();
    ctx.drawImage(img, this.x, this.y, this.radius, this.radius);
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
  limitSpeed() {
    console.log(this.dx, this.dy);
    if (this.dx > this.maxSpeed) {
      console.log("dx > maxSpeed")
      this.dx = this.maxSpeed;
    } else if (this.dx < -this.maxSpeed && this.dx < 0) {
      console.log("dx < -maxSpeed")
      this.dx = -this.maxSpeed;
    } else if (this.dx < this.minSpeed && this.dx > 0) {
      console.log("dx < minSpeed")
      this.dx = this.minSpeed;
    } else if (this.dx > -this.minSpeed && this.dx < 0) {
      console.log("dx > -minSpeed")
      this.dx = -this.minSpeed;
    }

    if (this.dy > this.maxSpeed) {
      console.log("dy > maxSpeed")
      this.dy = this.maxSpeed;
    } else if (this.dy < -this.maxSpeed && this.dy < 0) {
      console.log("dy < -maxSpeed")
      this.dy = -this.maxSpeed;
    } else if (this.dy < this.minSpeed && this.dy > 0) {
      console.log("dy < minSpeed")
      this.dy = this.minSpeed;
    } else if (this.dy > -this.minSpeed && this.dy < 0) {
      console.log("dy > -minSpeed")
      this.dy = -this.minSpeed;
    }
    console.log(this.dx, this.dy);
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
    this.img.src = "../assets/bricks/" + itemEffectImages[effect];
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
    game.itemList.push(new EffectItem(this.x, this.y, this.effect));
  }
}

class ClothBrick extends Brick {
  constructor(x, y) {
    super(x, y);
    this.img = new Image();
    var levelcloth = clothImages[gameDisplay.level - 1];
    this.cloth = levelcloth[Math.floor(Math.random() * levelcloth.length)];
    this.img.src = "../assets/" + this.cloth;
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
    // 아이템2. 옷 바꾸기
    game.itemList.push(new ClothItem(this.x, this.y, this.randomcloth));
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dy = 3;
    this.width = 20;
    this.height = 20;
    this.radius = 10;
  }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  move() {
    this.y += this.dy;
  }
}
class ClothItem extends Item {
  constructor(x, y, cloth) {
    super(x, y);
    this.cloth = cloth;
    this.img = new Image();
    this.img.src = "../assets/" + cloth;
  }
  evnet(game) {
    // 옷 바꾸기
    console.log(this.cloth);
  }
}
class EffectItem extends Item {
  constructor(x, y, effect) {
    super(x, y);
    this.img = new Image();
    this.effect = effect;
    this.img.src = "../assets/bricks/" + itemEffectImages[effect];
  }
  evnet(game) {
    if (this.effect === "addBall") {
      game.addBall();
    }
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
      if (this.isPaddleCollision(ball)) {
        if (ball.dy > 0) {
          // 공이 아래로 떨어지는 경우에만 반사
          ball.bounceY();
        }
      }
      this.checkCursorCollision(ball);
      this.checkBrickCollisions(ball);
      // 게임 오버 체크
      this.checkGameOver(ball);
      // 게임 요소 이동
      ball.move();
    });
    this.itemList.forEach((item) => {
      if (this.isPaddleCollision(item)) {
        this.itemList.splice(this.itemList.indexOf(item), 1); // 아이템 제거
        item.evnet(this.gameContainer);
      }
      if (this.isOutOfGameBoard(item)) {
        this.itemList.splice(this.itemList.indexOf(item), 1); // 아이템 제거
      }
      item.move();
    });
  }
  checkGameOver(ball) {
    // 게임 오버 체크
    if (this.isOutOfGameBoard(ball)) {
      this.gameContainer.ballList.splice(
        this.gameContainer.ballList.indexOf(ball),
        1
      ); // 공 제거
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
  checkCursorCollision(ball) {
    // 커서와 충돌 체크
    // 커서와의 충돌 체크
    const distanceX = ball.x - this.gameContainer.cursor.x;
    const distanceY = ball.y - this.gameContainer.cursor.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < this.gameContainer.cursor.radius) {
      // 공이 커서 반경 내에 있는 경우
      const weight =
        (this.gameContainer.cursor.radius - distance) /
        this.gameContainer.cursor.radius;

      // 공이 커서 중심으로 빨려들어가는 효과 적용
      ball.dx += -distanceX * weight * 0.05; // x 방향 휘어짐 가중치
      ball.dy += -distanceY * weight * 0.05; // y 방향 휘어짐 가중치

      // 공의 속도가 너무 빨라지지 않도록 제한
      ball.limitSpeed();
    }
  }
  isPaddleCollision(obj) {
    // 패들과 충돌 체크
    if (
      obj.x > this.paddle.x &&
      obj.x < this.paddle.x + this.paddle.width &&
      obj.y + obj.dy > this.gameBoard.height - this.paddle.height - obj.radius
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
          } else if (brick instanceof ClothBrick) {
            console.log(brick.cloth);
            gameDisplay.updateCloset(brick.cloth);
            // brick.applyEffect(this.gameContainer);
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
  var game;
  $("#levelBtn1").click(() => {
    gameDisplay.updateLevel(1);
    game.isPaused = true; 
    game = new GameContainer("gameCanvas");
    game.run();
  });
  $("#levelBtn2").click(() => {
    gameDisplay.updateLevel(2);
    game.isPaused = true; 
    game = new GameContainer("gameCanvas");
    game.run();
  });
  $("#levelBtn3").click(() => {
    gameDisplay.updateLevel(3);
    game.isPaused = true; 
    game = new GameContainer("gameCanvas");
    game.run();
  });
  
  gameDisplay.updateLevel(1);
  game = new GameContainer("gameCanvas");
  game.run();
  
  
});
