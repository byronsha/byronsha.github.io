/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	
	$(function () {
	  var rootElement = $(".linedash");
	  new View(rootElement);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	
	var View = function($el) {
	  this.$el = $el;
	  this.board = new Board(50);
	  this.setupBoard(this.board.boardSize);
	  this.renderBoard();
	  this.showControls();
	
	  this.lost = false;
	  this.started = false;
	  this.counter = 0;
	  this.obstacleInterval = 9;
	
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
	
	View.prototype.startMusic = function () {
	  var music = "<embed src='./music/Hindsight.mp3' autostart='true' loop='true' hidden='true'>";
	  var musicElement = $(music);
	  this.$el.append(musicElement);
	};
	
	View.prototype.stopMusic = function () {
	  var $musicElement = $("embed");
	  $musicElement.remove();
	};
	
	View.prototype.playGameOverSound = function () {
	  var sound = "<embed src='./music/gameover.mp3' autostart='true' hidden='true'>";
	  var soundElement = $(sound);
	  this.$el.append(soundElement);
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
	  this.stopMusic();
	
	  // this.playGameOverSound();
	
	  clearInterval(this.gameFrames);
	
	  var $ul = $("ul");
	  $ul.addClass("pause");
	};
	
	View.prototype.handleKeyEvent = function(e) {
	  if (!this.started && e.keyCode === 13) {
	    this.gameFrames = setInterval(this.step.bind(this), 35);
	    this.startMusic();
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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map