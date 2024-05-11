class GameElement {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.element = null;
  }

  draw() {
    if (!this.element) {
      this.element = document.createElement("div");
      document.getElementById("gameContainer").appendChild(this.element);
    }
    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
  }
}

class Ball extends GameElement {
  constructor(x, y, radius) {
    super(x, y, radius * 2, radius * 2);
    this.radius = radius;
    this.dx = 5;
    this.dy = -5;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
    this.checkWalls();
  }

  checkWalls() {
    if (this.x <= 0 || this.x + this.width >= 800) {
      this.dx = -this.dx;
    }
    if (this.y <= 0) {
      this.dy = -this.dy;
    }
  }

  draw() {
    super.draw();
    this.element.className = "ball";
  }
}

class Paddle extends GameElement {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.speed = 20;
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    if (e.key === "ArrowLeft" && this.x > 0) {
      this.x -= this.speed;
    } else if (e.key === "ArrowRight" && this.x + this.width < 800) {
      this.x += this.speed;
    }
    this.draw();
  }

  draw() {
    super.draw();
    this.element.className = "paddle";
  }
}

class Brick extends GameElement {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.status = 1; // 1 = active, 0 = destroyed
  }

  draw() {
    if (this.status === 1) {
      super.draw();
      this.element.className = "brick";
    }
  }
}


class CollisionDetector {
  static checkBallPaddle(ball, paddle) {
    if (ball.y + ball.height >= paddle.y &&
        ball.x + ball.width >= paddle.x &&
        ball.x <= paddle.x + paddle.width) {
      ball.dy = -ball.dy; // Reverse the ball's vertical direction
      // Adjust ball's horizontal direction based on where it hits the paddle
      const impactPoint = ball.x - (paddle.x + paddle.width / 2);
      ball.dx = 0.1 * impactPoint;
    }
  }

  static checkBallBricks(ball, bricks) {
    bricks.forEach((brick, index) => {
      if (brick.status === 1 &&
          ball.y + ball.height >= brick.y &&
          ball.y <= brick.y + brick.height &&
          ball.x + ball.width >= brick.x &&
          ball.x <= brick.x + brick.width) {
        brick.status = 0; // Deactivate the brick
        ball.dy = -ball.dy; // Reverse the ball's vertical direction
        // Remove brick element from the DOM
        brick.element.parentNode.removeChild(brick.element);
      }
    });
  }
}

// Game Loop Updated with Collision Detection
function gameLoop() {
  ball.move();
  CollisionDetector.checkBallPaddle(ball, paddle);
  CollisionDetector.checkBallBricks(ball, bricks);
  ball.draw();
  paddle.draw();
  bricks = bricks.filter(brick => brick.status === 1); // Keep only active bricks
  requestAnimationFrame(gameLoop);
}

gameLoop();

// Game Initialization
let ball = new Ball(390, 300, 10);
let paddle = new Paddle(350, 550, 100, 20);
let bricks = [];
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 4; j++) {
    bricks.push(new Brick(i * 160 + 10, j * 50 + 10, 150, 40));
  }
}

function gameLoop() {
  ball.move();
  ball.draw();
  paddle.draw();
  bricks.forEach((brick) => brick.draw());
  requestAnimationFrame(gameLoop);
}

gameLoop();
