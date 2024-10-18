const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Snake and food will be 20x20px
let snake = [{ x: 9 * box, y: 10 * box }]; // Initial snake position
let food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box }; // Random food position
let direction;
let score = 0;
let speed = 100; // Speed in milliseconds
let gameOver = false;
let paused = false;
let playerName = "Sajan"; // You can make this dynamic later
let game;

// Update DOM elements for player name and score display
const playerNameDisplay = document.getElementById("playerName");
const scoreDisplay = document.getElementById("scoreDisplay");

// Buttons
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
const exitBtn = document.getElementById("exitBtn");

// Event listeners for buttons
restartBtn.addEventListener("click", restartGame);
pauseBtn.addEventListener("click", togglePause);
exitBtn.addEventListener("click", exitGame);

// Control snake direction with arrow keys
document.addEventListener("keydown", directionControl);

function directionControl(event) {
    if (!gameOver && !paused) {
        if (event.keyCode == 37 && direction != "RIGHT") {
            direction = "LEFT";
        } else if (event.keyCode == 38 && direction != "DOWN") {
            direction = "UP";
        } else if (event.keyCode == 39 && direction != "LEFT") {
            direction = "RIGHT";
        } else if (event.keyCode == 40 && direction != "UP") {
            direction = "DOWN";
        }
    }
}

// Check collision with itself or walls
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Draw snake with eyes and mouth
function drawSnakePart(snakePart, isHead = false) {
    ctx.fillStyle = isHead ? "green" : "white";
    ctx.fillRect(snakePart.x, snakePart.y, box, box);
    ctx.strokeStyle = "red";
    ctx.strokeRect(snakePart.x, snakePart.y, box, box);

    // Draw eyes and mouth for the snake's head
    if (isHead) {
        // Eyes
        ctx.fillStyle = "black";
        ctx.fillRect(snakePart.x + 3, snakePart.y + 3, 4, 4);
        ctx.fillRect(snakePart.x + 13, snakePart.y + 3, 4, 4);

        // Mouth
        ctx.fillStyle = "black";
        ctx.fillRect(snakePart.x + 7, snakePart.y + 14, 6, 2);
    }
}

// Draw everything
function draw() {
    if (!paused) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        for (let i = 0; i < snake.length; i++) {
            drawSnakePart(snake[i], i == 0);
        }

        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, box, box);

        // Old head position
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        // Move direction
        if (direction == "LEFT") snakeX -= box;
        if (direction == "UP") snakeY -= box;
        if (direction == "RIGHT") snakeX += box;
        if (direction == "DOWN") snakeY += box;

        // Check if snake eats the food
        if (snakeX == food.x && snakeY == food.y) {
            score++;
            // Increase speed slightly with each food eaten
            if (speed > 50) speed -= 5;
            food = {
                x: Math.floor(Math.random() * 19) * box,
                y: Math.floor(Math.random() * 19) * box
            };
        } else {
            // Remove the tail
            snake.pop();
        }

        // New head position
        let newHead = { x: snakeX, y: snakeY };

        // Game over conditions
        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            gameOver = true;
            displayGameOver();
            return; // Stop drawing
        }

        // Add new head
        snake.unshift(newHead);

        // Update score display
        scoreDisplay.textContent = "Score: " + score;
    }
}

// Display "Game Over" message on the canvas
function displayGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Final Score: " + score, canvas.width / 2 - 70, canvas.height / 2 + 20);
    ctx.fillText("Press 'Restart' to Play Again", canvas.width / 2 - 100, canvas.height / 2 + 60);
}

// Restart the game after game over
function restartGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    speed = 100;
    gameOver = false;
    paused = false;
    clearInterval(game);
    playerNameDisplay.textContent = "Player: " + playerName; // Reset player name display
    scoreDisplay.textContent = "Score: " + score; // Reset score display
    game = setInterval(draw, speed);
}

// Pause or resume the game
function togglePause() {
    if (!gameOver) {
        paused = !paused;
        pauseBtn.innerText = paused ? "Resume" : "Pause";
    }
}

// Exit the game (stop the loop and clear the canvas)
function exitGame() {
    clearInterval(game);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Exited", canvas.width / 2 - 100, canvas.height / 2);
}

// Set canvas size dynamically based on viewport size
function setCanvasSize() {
    const width = Math.min(window.innerWidth * 0.8, 400); // Maximum width 400px
    const height = Math.min(window.innerHeight * 0.8, 400); // Maximum height 400px
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener("resize", setCanvasSize); // Adjust canvas size on window resize
setCanvasSize(); // Set initial canvas size

// Start the game loop
game = setInterval(draw, speed);
