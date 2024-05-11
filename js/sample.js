console.log('Hello from sample.js');

class Ball {
    constructor(element) {
        this.element = element;
        this.x = 100; // Starting x-position
        this.y = 100; // Starting y-position
        this.dx = 5; // Movement in x
        this.dy = 5; // Movement in y
        this.radius = 10;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        this.element.css({ // Use jQuery to set CSS properties
            left: `${this.x}px`,
            top: `${this.y}px`
        });
    }
}

class Paddle {
    constructor(element) {
        this.element = $(element);
        const offset = this.element.offset();
        this.x = offset.left;
        this.width = this.element.width();
        this.height = 10; // Fixed height
        $(window).on('mousemove', e => this.mouseMove(e));
    }

    mouseMove(e) {
        this.x = e.clientX - this.width / 2;
        this.element.css('left', `${this.x}px`);
    }
}

class Brick {
    constructor(x, y, width, height, element) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.element = element;
        this.element.css({left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`});
        this.isDestroyed = false;
    }
}

class GameContainer {
    constructor(element) {
        this.element = $(element);
        const offset = this.element.offset();
        this.x = offset.left;
        this.y = offset.top;
        this.width = this.element.width();
        this.height = this.element.height();
    }
}

class CollisionManager {
    constructor(ball, paddle, bricks, gameContainer, scoreDisplay) {
        this.ball = ball;
        this.paddle = paddle;
        this.bricks = bricks;
        this.gameContainer = gameContainer;
        this.score = 0;
        this.scoreDisplay = scoreDisplay;
        this.stop = false;
    }

    checkCollisions() {
        this.checkContainerBounds();
        this.checkPaddleCollision();
        this.checkBrickCollisions();
    }

    checkContainerBounds() {
        if (this.ball.x < this.gameContainer.x || this.ball.x > this.gameContainer.x + this.gameContainer.width) {
            this.ball.dx *= -1;
        }
        if (this.ball.y < this.gameContainer.y) {
            this.ball.dy *= -1;
        }
        if (this.ball.y > this.gameContainer.y + this.gameContainer.height) {
            console.log('Game Over!'); // Simple game over alert
            this.stop = true;
        }
    }

    checkPaddleCollision() {
        var paddleTop = this.paddle.element.offset().top;
        var paddleLeft = this.paddle.element.offset().left;
        var paddleRight = paddleLeft + this.paddle.width;

        var ballBottom = this.ball.y + this.ball.radius;
        var ballLeft = this.ball.x - this.ball.radius;
        var ballRight = this.ball.x + this.ball.radius;

        if (ballBottom > paddleTop && this.ball.y < paddleTop && ballRight > paddleLeft && ballLeft < paddleRight) {
            this.ball.dy *= -1;
        }

        
    }
    


    checkBrickCollisions() {
        this.bricks.forEach(brick => {
            if (!brick.isDestroyed && this.ball.x + this.ball.radius > brick.x && this.ball.x - this.ball.radius < brick.x + brick.width && this.ball.y + this.ball.radius > brick.y && this.ball.y - this.ball.radius < brick.y + brick.height) {
                this.ball.dy *= -1;
                brick.element.hide(); // Hide the brick element
                brick.isDestroyed = true;
                this.score += 10;
                this.scoreDisplay.text(`Score: ${this.score}`);
            }
        });
    }
}

// On window load, setup the game
$(window).on('load', function() {
    const ballElement = $('#ball');
    const paddleElement = $('#paddle');
    const gameContainerElement = $('#gameContainer');
    const scoreDisplay = $('#score');

    const ball = new Ball(ballElement);
    const paddle = new Paddle(paddleElement);
    const gameContainer = new GameContainer(gameContainerElement);

    // Setup bricks
    const bricks = [];
    for (let i = 0; i < 5; i++) { // 5 rows of bricks
        for (let j = 0; j < 10; j++) { // 10 bricks per row
            let brickElement = $('<div class="brick"></div>').appendTo(gameContainerElement);
            bricks.push(new Brick(j * 52+300, i * 30+300, 50, 20, brickElement));
        }
    }

    const collisionManager = new CollisionManager(ball, paddle, bricks, gameContainer, scoreDisplay);

    requestAnimationFrame(function gameLoop() {
        if (collisionManager.stop) {
            return;
        }
        ball.move();
        collisionManager.checkCollisions();
        requestAnimationFrame(gameLoop);
    });
    // animation = setInterval(function gameloop1(){
    //     if (collisionManager.stop) {
    //         return;
    //     }
    //     ball.move();
    //     collisionManager.checkCollisions();
    // }, 100);

});
