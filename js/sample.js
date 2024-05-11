
console.log('Hello from sample.js');

class Ball {
    constructor(element) {
        this.element = element;
        this.x = 0;
        this.y = 0;
        this.dx = 10;
        this.dy = 10;
        this.radius = 10;
    }
    move() {
        // console.log(`x: ${this.x}, y: ${this.y}`);
        this.x += this.dx;
        this.y += this.dy;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
}
class Paddle {
    constructor(element) {
        this.e = $(element);
        const offset = this.e.offset();

        this.x = offset.left;
        this.y = offset.top;

        this.width = this.e.width();
        this.height = this.e.height();
        this.mouseMoveHandler = this.mouseMove.bind(this);
        window.addEventListener('mousemove', this.mouseMoveHandler);
    }

    mouseMove(e) {
        // 마우스의 x 좌표를 패들의 x 좌표로 설정
        this.x = e.pageX;
        this.e.css('left', `${e.pageX}px`); // jQuery로 스타일 변경
    }
}
class GameContainer {
    constructor(element) {
        this.e = $(element);
        const offset = this.e.offset();

        this.x = offset.left;
        this.y = offset.top;

        this.width = this.e.width();
        this.height = this.e.height();
    }
}

class BallCollisionChecker {
    constructor(ball) {
        this.ball = ball;
    }
    checkObjects(objArray) {
        for (let obj of objArray) {
            if (this.ball.x + this.ball.radius > obj.x && this.ball.x - this.ball.radius < obj.x + obj.width && this.ball.y + this.ball.radius > obj.y && this.ball.y - this.ball.radius < obj.y + obj.height) {
                this.ball.dx *= -1;
                this.ball.dy *= -1;
            }
        }
    }
    checkPaddle(paddle) {
        if (this.ball.x + this.ball.radius > paddle.x && this.ball.x - this.ball.radius < paddle.x + paddle.width && this.ball.y + this.ball.radius > paddle.y && this.ball.y - this.ball.radius < paddle.y + paddle.height) {
            this.ball.dx *= -1;
            this.ball.dy *= -1;
        }
    }
    checkContainer(container) {
        if (this.ball.x < container.x || this.ball.x > container.x + container.width) {
            this.ball.dx *= -1;
        }
        if (this.ball.y < container.y || this.ball.y > container.y + container.height) {
            this.ball.dy *= -1;
        }
    }
}
$(window).on('load', function() {
    const ball = new Ball(document.querySelector('#ball'));
    const paddle = new Paddle('#paddle');
    const container = new GameContainer('#gameContainer');
    const ballCollisionChecker = new BallCollisionChecker(ball);
    let isPaused = false;

    $(window).on('keydown', function(e) {
        console.log(e.key);
        if (e.key === ' ') { // 스페이스바를 눌렀을 때
            isPaused = !isPaused; // 일시정지 상태를 토글
        }
    });

    requestAnimationFrame(function gameLoop() {
        if (!isPaused) { // 게임이 일시정지 상태가 아니라면
            ballCollisionChecker.checkContainer(container);
            ballCollisionChecker.checkPaddle(paddle);
            ball.move();
        }      
        requestAnimationFrame(gameLoop);
    });
});


