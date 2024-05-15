$(document).ready(function() {
  class Game {
      constructor(canvasId) {
          this.canvas = document.getElementById(canvasId);
          this.ctx = this.canvas.getContext('2d');
          this.ball = new Ball(this.canvas.width / 2, this.canvas.height - 30);
          this.paddle = new Paddle((this.canvas.width - 75) / 2, this.canvas.height - 10);
          this.bricks = [];
          this.rows = 5;
          this.columns = 8;
          this.collisionManager = new CollisionManager(this.ball, this.paddle, this.bricks, this.canvas);
          this.createBricks();
          this.initMouseControl();
          this.loop();
      }

      createBricks() {
          for (let r = 0; r < this.rows; r++) {
              for (let c = 0; c < this.columns; c++) {
                  this.bricks.push(new Brick(c * (75 + 10) + 30, r * (20 + 10) + 30));
              }
          }
      }

      initMouseControl() {
          $(this.canvas).mousemove((event) => {
              let relativeX = event.clientX - this.canvas.offsetLeft;
              if (relativeX > 0 && relativeX < this.canvas.width) {
                  this.paddle.x = relativeX - this.paddle.width / 2;
              }
          });
      }

      drawBricks() {
          this.bricks.forEach(brick => {
              if (brick.status === 1) {
                  brick.draw(this.ctx);
              }
          });
      }

      loop() {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ball.draw(this.ctx);
          this.paddle.draw(this.ctx);
          this.drawBricks();
          this.collisionManager.checkCollisions();

          if (this.ball.y + this.ball.dy > this.canvas.height) {
              alert("GAME OVER");
              document.location.reload();
              return;
          }

          requestAnimationFrame(() => this.loop());
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
          ctx.beginPath();
          ctx.rect(this.x, this.y, this.width, this.height);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
      }
  }

  class CollisionManager {
      constructor(ball, paddle, bricks, canvas) {
          this.ball = ball;
          this.paddle = paddle;
          this.bricks = bricks;
          this.canvas = canvas;
      }

      checkCollisions() {
          this.checkWallCollision();
          this.checkPaddleCollision();
          this.checkBrickCollisions();
          this.ball.move();
      }

      checkWallCollision() {
          if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius || this.ball.x + this.ball.dx < this.ball.radius) {
              this.ball.bounceX();
          }
          if (this.ball.y + this.ball.dy < this.ball.radius) {
              this.ball.bounceY();
          }
      }

      checkPaddleCollision() {
          if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width && this.ball.y + this.ball.dy > this.canvas.height - this.paddle.height - this.ball.radius) {
              this.ball.bounceY();
          }
      }

      checkBrickCollisions() {
          this.bricks.forEach(brick => {
              if (brick.status === 1) {
                  if (this.ball.x > brick.x && this.ball.x < brick.x + brick.width && this.ball.y > brick.y && this.ball.y < brick.y + brick.height) {
                      this.ball.bounceY();
                      brick.status = 0;
                  }
              }
          });
      }
  }

  new Game('gameCanvas');
});
