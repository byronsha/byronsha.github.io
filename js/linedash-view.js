var Board = require("./linedash.js");

var View = function($el) {
  this.$el = $el;
  this.board = new Board(50);
  this.setupBoard(this.board.boardSize);
  this.renderBoard();
  this.showControls();

  this.lost = false;
  this.started = false;
  this.counter = 1000;
  this.obstacleInterval = 10;

  $(window).on("keydown", this.handleKeyEvent.bind(this));
}

View.prototype.setupBoard = function(boardSize) {
  var $ul = $("<ul>");

  for (var i = 0; i < boardSize; i++) {
    for (var j = 0; j < boardSize; j++) {
      var $li = $("<li>");
      $li.attr("pos", [i, j]);
      if (i < 21 || i > 29) {
        $li.addClass("wall");
      }
      $ul.append($li);
    }
  };

  this.$el.append($ul);

  for (var i = 0; i < this.board.walls.length; i++) {
    var $wall = $("[pos='" + this.board.walls[i] + "']");
    $wall.addClass("wall");
  };

  var $center = $("[pos='" + [this.board.middle, this.board.middle] + "']");
  var $counter = $("<span>");
  $counter.addClass("counter");
  $center.append($counter);
};

View.prototype.renderBoard = function() {
  var $obstacles = $(".obstacle");
  $obstacles.removeAttr("class");

  var $oldDasher = $(".dasher");
  $oldDasher.removeAttr("class");

  for (var i = 0; i < this.board.line.length; i++) {
    var $line = $("[pos='" + this.board.line[i] + "']");
    $line.addClass("line");
  }

  for (var i = 0; i < this.board.obstacles.length; i++) {
    var $obstacle = $("[pos='" + this.board.obstacles[i] + "']");
    $obstacle.addClass("obstacle");
  }

  var $dasher = $("[pos='" + this.board.dasher + "']");
  $dasher.addClass("dasher");

  var $counter = $(".counter");
  $counter.text(this.counter);
};

View.prototype.showControls = function () {
  var $div = $("<div>");
  $div.html("<h1>Linedash</h1>Enter: start/restart<br/>Spacebar: change sides");
  this.$el.append($div);
};

View.prototype.step = function() {
  if (this.counter % this.obstacleInterval === 0) {
    this.board.createObstacle();
  }

  this.counter += 1;
  this.board.move();
  this.renderBoard();

  if (this.board.collision()) {
    this.gameover();
  }
};

View.prototype.gameover = function() {
  this.lost = true;
  this.showControls();
  clearInterval(this.gameFrames);
  var $ul = $("ul");
  $ul.addClass("pause");
};

View.prototype.handleKeyEvent = function(e) {
  if (!this.started && e.keyCode === 13) {
    this.gameFrames = setInterval(this.step.bind(this), 35);
    this.started = true;
    $("div").remove();
    var $ul = $("ul");
    $ul.addClass("rotate");
  } else if (this.started && e.keyCode === 32) {
    this.board.changeSides();
  } else if (this.lost && e.keyCode === 13) {
    location.reload();
  }
};

module.exports = View;
