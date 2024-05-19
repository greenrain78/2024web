class Settings {
    constructor() {
        this.hearts = 2;
        this.level = 1;
        this.backgroundImg = 0;
        this.brickImg = 0;
        this.closet = [];
    }
}
class GameDisplay {
    constructor(settings) {
        this.settings = settings;
        this.background = $("#background");
        this.background_imges = ["img_1.jpg", "img_2.jpg", "img_3.jpg"];
    }
    updateBackground() {
        this.background.css("background-image", "url(../assets/background/" + this.background_imges[this.settings.backgroundImg] + ")");
    }
    updateScore() {}
    updateLives() {}
    updateCloset() {}
}

class GameBorad {
  constructor(settings, display) {
    this.settings = settings;
    this.display = display;
    this.canvas = document.getElementById("gameboard");
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.display.updateDisplay();
    this.initListeners();
  }

  initListeners() {}
  createBricks() {}
  run() {}
}
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.dx = 2;
        this.dy = -2;
    }
    draw() {}
    move() {}
}
class Paddle {
    constructor(x, y) {
        this.width = 75;
        this.height = 10;
        this.x = x;
        this.y = y;
    }
    draw() {}
    move() {}
}
class Brick {
    constructor(x, y, settings) {
        this.x = x;
        this.y = y;
        this.status = 1;
    }
    draw() {}
}
class CollisionManager {
  // 충돌 감지
  // ball, paddle, bricks
}

$(document).ready(function () {
  // 게임 시작
  var settings = new Settings();
  var gameDisplay = new GameDisplay(settings);
  var gameBoard = new GameBorad(settings, gameDisplay);
  gameBoard.run();
});
