let canvas = document.querySelector("#canvas"),
	ctx = canvas.getContext("2d"),
	width = canvas.width,
	height = canvas.height,
	blockSize = 10,
	widthInBlock = width / blockSize,
	heightInBlock = height / blockSize,
	score = 0;

const drawBorder = color => {

    console.log('color', color);
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};

const drawScore = () => {
	ctx.textBaseline = "top";
	ctx.font = "24px Tahoma";
	ctx.fillText("Ваш счет: " + score, blockSize * 2, blockSize * 2);
};

const gameOver = () => {
	clearInterval(gameInterval);
	ctx.font = "24px Tahoma";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Конец игры", width / 2, height / 2);
};

const circle = (x, y, radius, isFill) => {
	ctx.beginPath();
	ctx.arc(x, y, radius, Math.PI * 2, false);
	if (isFill) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
};

let Block = function(col, row) {
	(this.col = col), (this.row = row);
};

Block.prototype.drawSuqare = function(color) {
	let x = this.col * blockSize,
		y = this.row * blockSize;

	ctx.fillStyle = color;
	ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function(color) {
	let centerX = this.col * blockSize + blockSize / 2,
		centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}

/* Snake */
let Snake = function() {
	this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];

	this.direction = "right";
	this.nextDirection = "right";
};

Snake.prototype.draw = function() {
	this.segments.forEach((segment,index) => {

        console.log('index', index % 2);
        if (index % 2 === 0) {
            segment.drawSuqare('Blue');
        } else {
            segment.drawSuqare('Orange');
        }
    })
}; 

Snake.prototype.move = function() {
    let 
        head = this.segments[0],
        newHead;
    
    this.direction = this.nextDirection;

    if (this.direction === 'right') {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === 'down') {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === 'left') {
        newHead = new Block(head.col - 1, head.row) 
    } else if (this.direction === 'up') {
        newHead = new Block(head.col, head.row - 1)
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

Snake.prototype.checkCollision = function(head) {
    let 
        leftCollision = (head.col == 0),
        topCollision = (head.row == 0),
        rightCollision = (head.col == widthInBlock - 1),
        bottomtCollision = (head.row == heightInBlock - 1),
        wallCollision =  topCollision || rightCollision || bottomtCollision || leftCollision,
        selfCollision = false;

        this.segments.forEach(segment => {
            if (head.equal(segment)) selfCollision = true;
        })

        return wallCollision || selfCollision;
};   

Snake.prototype.setDirection = function(newDirection) {

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
}

/* Apple constructor */
const Apple = function() {
    this.position = new Block(10, 10);
};

Apple.prototype.draw = function() {
    this.position.drawCircle('LimeGreen');
};

Apple.prototype.move = function() {
        let 
            randomCol = Math.floor(Math.random() * widthInBlock - 2) + 1,
            randomRow = Math.floor(Math.random() * heightInBlock - 2) + 1;
    
        this.position = new Block(randomCol, randomRow);
}



/* controls */
let directions = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

let
    snake = new Snake(),
    apple = new Apple();

/* Game */
let gameInterval = setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder('Gray');
}, 100);

document.body.addEventListener('keydown', e => {
    let newDirection = directions[e.keyCode];

    if (newDirection != undefined) {
        snake.setDirection(newDirection);
    }
});

