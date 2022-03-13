let canvas = document.getElementById("canvas1");
let context = canvas.getContext("2d");
let resetart = document.getElementById("restart");
let play = document.getElementById("play");
//let box = document.getElementById("box");
//box.style.width = window.innerWidth / 1.7 + 10;
//box.style.height = window.innerHeight / 1.2 + 10;
class Block {
    constructor(x, y, width, height, color, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
    }
    /*constructor(width, height, color, type, contex) {
        this(0, 0, width, height, color, type, contex);
        this.setX(Math.floor(Math.random() * (maxX - minX)) + minX);
        this.setY(Math.floor(Math.random() * (maxY - minY)) + minY);
    }*/

    drawBlock() {

        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    getColor() {
        return this.color;
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getY() {
        return this.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    intersects(b1) {
        return this.x < b1.getX() + b1.getWidth() && b1.getX() < this.x + this.getWidth() &&
            this.getY() + this.getHeight() > b1.getY() && b1.getY() + b1.getHeight() > this.getY();
    }
}

const SNAKE_TYPE = "snake";
const FRUIT_TYPE = "fruit";
const FRUIT_COLOR = "red";
class Board {
    constructor(width, height, color, cellSize) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.cellSize = cellSize;
        this.fruit = new Block(0, 0, cellSize, cellSize, FRUIT_COLOR, FRUIT_TYPE);
        this.drawBG();
        this.updateFruit();
        this.drawFruit();
    }

    updateFruit() {
        //this.drawBG();
        this.fruit.x = Math.floor(Math.random() * (this.width - this.cellSize));
        this.fruit.y = Math.floor(Math.random() * (this.height - 2 * this.cellSize));
        //this.drawFruit();
    }

    getCellSize() {
        return this.cellSize;
    }

    drawBG() {
        context.fillStyle = this.color;
        context.fillRect(0, 0, this.width, this.height);

    }

    drawFruit() {
        this.fruit.drawBlock();
    }

    getXFruit() {
        return this.fruit.x;
    }

    getYFruit() {
        return this.fruit.y;
    }

    snakeIntersectsFruit(snake) {
        return snake.snakeIntersects(this.fruit);
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

}

const RIGHT = "right";
const LEFT = "left";
const DOWN = "down";
const UP = "up";

class Game {
    constructor(snake, board) {
        this.board = board;
        this.snake = snake;
        this.gameOver = false;
        this.direction = RIGHT;
        this.score = 0;
        board.updateFruit();
        snake.drawSnake();
    }
    restart() {
        this.gameOver = false;
        this.score = 0;
        this.snake.clear()
    }
    getScore() {
        return this.score;
    }
    isGameOver() {
        return this.gameOver;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    getDirection() {
        return this.direction;
    }


    update() {
        if (!this.gameOver) {
            if (this.snake.getHead().getX() + this.board.getCellSize() >= this.board.getWidth()) this.snake.head.setX(0);
            if (this.snake.getHead().getX() < 0) this.snake.head.setX(this.board.getWidth() - this.board.getCellSize());
            if (this.snake.getHead().getY() + this.board.getCellSize() >= this.board.getHeight()) this.snake.head.setY(0);
            if (this.snake.getHead().getY() < 0) this.snake.head.setY(this.board.getHeight() - this.board.getCellSize());
            let snakeX = this.snake.head.getX();
            let snakeY = this.snake.head.getY();
            if (this.direction.valueOf() == RIGHT) snakeX += this.board.getCellSize();
            else if (this.direction.valueOf() == LEFT) snakeX -= this.board.getCellSize();
            else if (this.direction.valueOf() == UP) snakeY -= this.board.getCellSize();
            else if (this.direction.valueOf() == DOWN) snakeY += this.board.getCellSize();
            let grow = false;
            if (this.board.snakeIntersectsFruit(this.snake))
                grow = true;
            if (grow) {
                this.board.updateFruit();
                this.score++;
            }
            this.snake.movesTo(new Block(snakeX, snakeY, this.board.getCellSize(), this.board.getCellSize(),
                this.snake.getColor(), SNAKE_TYPE), grow);
            this.board.drawBG();
            this.board.drawFruit();
            this.snake.drawSnake();
            if (this.snake.crash())
                this.gameOver = true;
        }
    }

}

class Snake {
    constructor(x, y, width, height, color) {
        this.snake = [];
        this.snake[0] = new Block(x, y, width, height, color, SNAKE_TYPE);
        this.head = this.snake[0];
        this.color = color;
        this.drawSnake();
    }
    clear() {
        this.snake = [];
        this.snake[0] = this.head;
    }
    drawSnake() {
        for (let i = 0; i < this.snake.length; i++) {
            this.snake[i].drawBlock();
            // console.log( this.snake[i].getColor() +" "+  this.snake[i].y)
        }
        /* this.snake.forEach(function (s) {
             s.drawBlock();
        })*/
    }
    removeLast() {
        this.snake.pop();
    }

    getColor() {
        return this.color;
    }

    addFirst(block) {
        this.snake.unshift(block);
    }

    crash() {
        for (let i = 1; i < this.snake.length; i++)
            if (this.snakeIntersects(this.snake[i]))
                return true;
        return false;
    }

    snakeIntersects(block) {
        return block.intersects(this.head)
    }

    movesTo(block, grow) {
        this.head = block;
        this.addFirst(this.head);
        if (!grow)
            this.removeLast();
    }

    setX(x) {
        this.head.x = x;
    }

    setX(y) {
        this.head.y = y;
    }

    getHead() {
        return this.head;
    }

    snake() {//TODO ver como fazer um iterador
        return this.snake;
    }
}

const BG_COLOR = "black";
const SNAKE_COLOR = "green";
const CELLSIZE = 20;
let width = window.innerWidth / 1.7;
let height = window.innerHeight / 1.2;
canvas.width = width;
canvas.height = height;
let board = new Board(width, height, BG_COLOR, CELLSIZE);
let snake = new Snake(width / 2, height / 2, board.getCellSize(), board.getCellSize(), SNAKE_COLOR);
let game = new Game(snake, board);


function update(event) {
    if (event.keyCode == 37 && game.getDirection().valueOf() != RIGHT) game.setDirection(LEFT);
    if (event.keyCode == 38 && game.getDirection().valueOf() != DOWN) game.setDirection(UP);
    if (event.keyCode == 39 && game.getDirection().valueOf() != LEFT) game.setDirection(RIGHT);
    if (event.keyCode == 40 && game.getDirection().valueOf() != UP) game.setDirection(DOWN);
}

document.addEventListener('keydown', update);
let interval;

function restartGame() {
    clearInterval(interval);
    document.getElementById("best-score").textContent = game.getScore();
    resetart.style.display = "none";
    game.restart();
    interval = setInterval(startGame, 100);
}

function playF() {
    clearInterval(interval);
    play.style.display = "none";
    game.restart();
    interval = setInterval(startGame, 100);
}
function startGame() {
    document.getElementById("current-score").textContent = game.getScore();
    game.update()
    if (game.isGameOver()) {
        clearInterval(interval);
        resetart.style.display = "block";
        alert('Game Over :(');
    }
}