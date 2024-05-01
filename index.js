window.onload = function () {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var x = 100;
    var y = 100;

    var radius = 20
    var vy = 5;
    var vx = 5;

    var cnavas_width = 300;
    var cnavas_height = 200;
    function draw() {
        context.clearRect(0,0,cnavas_width,cnavas_height);
        if ((x<=0+radius)||(x>=cnavas_width-radius)) {
            vx = -vx;
        }
        if ((y<=0+radius)||(y>=cnavas_height-radius)) {
            vy = -vy;
        }

        x = x + vx;
        y = y + vy;
        console.log(`x : ${x}, y : ${y}`);
        context.beginPath();
        context.arc(x, y, radius, 0, 2.0*Math.PI, true);
        context.fillStyle = "red";
        context.fill();
    }
    var ball = setInterval(draw, 10);
    function stopBall() {
        clearInterval(ball);
    }
}
