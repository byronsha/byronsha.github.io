function Board (boardSize) {
  this.boardSize = boardSize;
  this.middle = boardSize / 2;

  this.dasher = [this.middle - 1, this.middle - 7];
  this.line = [];
  this.obstacles = [];
  this.walls = [];

  this.createWalls();
  this.createLine();
};

Board.prototype.createLine = function () {
  for (var i = 0; i < this.boardSize; i++) {
    this.line.push([(this.middle), i])
  }
};

Board.prototype.createWalls = function () {
  for (var i = 0; i < this.boardSize; i++) {
    if (i % 2 === 1) {
      this.walls.push([21, i]);
      this.walls.push([29, i]);
    }
  }
};

Board.prototype.createObstacle = function () {
  if (Math.random() < 0.5) {
    this.obstacles.push([this.middle - 1, this.boardSize - 1])
  } else {
    this.obstacles.push([this.middle + 1, this.boardSize - 1])
  }
};

Board.prototype.move = function () {
  for (var i = 0; i < this.obstacles.length; i++) {
    if (this.obstacles[i][1] === 0) {
      this.obstacles.splice(i, 1);
    } else {
      this.obstacles[i][1] = this.obstacles[i][1] - 1;
    }
  }
};

Board.prototype.collision = function () {
  for (var i = 0; i < this.obstacles.length; i++) {
    if (this.dasher[0] === this.obstacles[i][0] && this.dasher[1] === this.obstacles[i][1]) {
      return true;
    }
  }
  return false;
};

Board.prototype.changeSides = function () {
  if (this.dasher[0] === 24) {
    this.dasher[0] = 26;
  } else {
    this.dasher[0] = 24;
  }
};

module.exports = Board;
