"use strict";

var canvas = document.querySelector("#canvas"),
    ctx = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height,
    blockSize = 10,
    widthInBlock = width / blockSize,
    heightInBlock = height / blockSize,
    score = 0;

var drawBorder = function drawBorder(color) {
  console.log('color', color);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

var drawScore = function drawScore() {
  ctx.textBaseline = "top";
  ctx.font = "24px Tahoma";
  ctx.fillText("Ваш счет: " + score, blockSize * 2, blockSize * 2);
};

var gameOver = function gameOver() {
  clearInterval(gameInterval);
  ctx.font = "24px Tahoma";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Конец игры", width / 2, height / 2);
};

var circle = function circle(x, y, radius, isFill) {
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI * 2, false);

  if (isFill) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

var Block = function Block(col, row) {
  this.col = col, this.row = row;
};

Block.prototype.drawSuqare = function (color) {
  var x = this.col * blockSize,
      y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function (color) {
  var centerX = this.col * blockSize + blockSize / 2,
      centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function (otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};
/* Snake */


var Snake = function Snake() {
  this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
  this.direction = "right";
  this.nextDirection = "right";
};

Snake.prototype.draw = function () {
  this.segments.forEach(function (segment, index) {
    console.log('index', index % 2);

    if (index % 2 === 0) {
      segment.drawSuqare('Blue');
    } else {
      segment.drawSuqare('Orange');
    }
  });
};

Snake.prototype.move = function () {
  var head = this.segments[0],
      newHead;
  this.direction = this.nextDirection;

  if (this.direction === 'right') {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === 'down') {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === 'left') {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === 'up') {
    newHead = new Block(head.col, head.row - 1);
  }

  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    score++;
    apple.move();
  } else {
    this.segments.pop();
  }
};

Snake.prototype.checkCollision = function (head) {
  var leftCollision = head.col == 0,
      topCollision = head.row == 0,
      rightCollision = head.col == widthInBlock - 1,
      bottomtCollision = head.row == heightInBlock - 1,
      wallCollision = topCollision || rightCollision || bottomtCollision || leftCollision,
      selfCollision = false;
  this.segments.forEach(function (segment) {
    if (head.equal(segment)) selfCollision = true;
  });
  return wallCollision || selfCollision;
};

Snake.prototype.setDirection = function (newDirection) {
  console.log('newDirection', newDirection);

  if (this.direction === 'up' && newDirection === 'down') {
    return;
  } else if (this.direction === 'down' && newDirection === 'up') {
    return;
  } else if (this.direction === 'left' && newDirection === 'right') {
    return;
  } else if (this.direction === 'right' && newDirection === 'left') {
    return;
  }

  this.nextDirection = newDirection;
};
/* Apple constructor */


var Apple = function Apple() {
  this.position = new Block(10, 10);
};

Apple.prototype.draw = function () {
  this.position.drawCircle('LimeGreen');
};

Apple.prototype.move = function () {
  var randomCol = Math.floor(Math.random() * widthInBlock - 2) + 1,
      randomRow = Math.floor(Math.random() * heightInBlock - 2) + 1;
  this.position = new Block(randomCol, randomRow);
};
/* controls */


var directions = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};
var snake = new Snake(),
    apple = new Apple();
/* Game */

var gameInterval = setInterval(function () {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder('Gray');
}, 100);
document.body.addEventListener('keydown', function (e) {
  var newDirection = directions[e.keyCode];

  if (newDirection != undefined) {
    snake.setDirection(newDirection);
  }
});