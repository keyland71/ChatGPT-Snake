const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Get the element that displays the food counter
const counterElement = document.getElementById('counter');

// Get the container element that holds the canvas
const container = document.getElementById('container');

// Center the canvas within the container element
canvas.style.marginLeft = `${(container.offsetWidth - canvas.offsetWidth) / 2}px`;
canvas.style.marginTop = `${(window.innerHeight - canvas.height) / 2}px`;

// Initialize the food counter to 0
let counter = 0;

// Initialize the snake as an array of objects representing its segments
let snake = [{ x: 150, y: 130 }, { x: 140, y: 130 }, { x: 130, y: 130 }];

// Initialize the snake's movement delta (change in x and y position) to 10 pixels to the right
let dx = 10;
let dy = 0;

// Initialize the food object with an x and y position
let food = { x: 300, y: 300 };

// Function to reset the game to its initial state
function restartGame() {
    // Reset the snake to its initial position and movement delta
    snake = [{ x: 150, y: 130 }, { x: 140, y: 130 }, { x: 130, y: 130 }];
    dx = 10;
    dy = 0;

    // Create new food
    createFood();

    // Reset the counter to 0
    counter = 0;

    // Update the counter element to display the new counter value
    counterElement.innerHTML = `Food eaten: ${counter}`;
}


function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iterate through each segment of the snake
    for (let i = 0; i < snake.length; i++) {
        // Set the fill color of the snake segment to green if it's the head, or white if it's any other segment
        ctx.fillStyle = (i === 0) ? 'green' : 'white';

        // Fill a rectangle representing the snake segment
        ctx.fillRect(snake[i].x, snake[i].y, 10, 10);

        // Set the stroke color of the snake segment to red
        ctx.strokeStyle = 'red';

        // Draw a red outline around the snake segment
        ctx.strokeRect(snake[i].x, snake[i].y, 10, 10);
    }

    // Set the fill color of the food to red
    ctx.fillStyle = 'red';

    // Fill a rectangle representing the food
    ctx.fillRect(food.x, food.y, 10, 10);

    // Remove the last segment of the snake
    snake.pop();

    // Calculate the new head of the snake based on its current position and movement delta
    let newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Add the new head to the front of the snake
    snake.unshift(newHead);

    // Set the fill color of the food to red
    ctx.fillStyle = 'red';

    // Fill a rectangle representing the food
    ctx.fillRect(food.x, food.y, 10, 10);

    // If the snake's head is at the same position as the food
    if (snake[0].x === food.x && snake[0].y === food.y) {
        // Create new food
        createFood();

        // Increment the counter by 1
        counter++;

        // Calculate the position of the new tail segment based on the position of the current last segment
        let newTail = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };

        // Add the new tail segment to the snake
        snake.push(newTail);

        // Update the counter element to display the new counter value
        counterElement.innerHTML = `Food eaten: ${counter}`;
    }

    // If the snake's head is outside the boundaries of the canvas
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        // Restart the game
        restartGame()
    }

    // Iterate through each segment of the snake, starting from the second segment
    for (let i = 1; i < snake.length; i++) {
        // If the snake's head is at the same position as any other segment
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            // Restart the game
            restartGame()

            // Break out of the loop
            break;
        }
    }
}


// Start the main game loop, which calls the draw function every 100 milliseconds
function main() {
    setInterval(draw, 100);
}

// Add an event listener for the keydown event to change the direction of the snake based on the key pressed
document.addEventListener('keydown', changeDirection);

// Function to handle the keydown event
function changeDirection(event) {
    // Constants representing the arrow keys
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Get the code of the key that was pressed
    const keyPressed = event.keyCode;

    // Check if the snake is currently moving up
    const goingUp = dy === -10;

    // Check if the snake is currently moving down
    const goingDown = dy === 10;

    // Check if the snake is currently moving right
    const goingRight = dx === 10;

    // Check if the snake is currently moving left
    const goingLeft = dx === -10;

    // If the left arrow key was pressed and the snake is not already moving right
    if (keyPressed === LEFT_KEY && !goingRight) {
        // Set the movement delta to move the snake 10 pixels to the left
        dx = -10;
        dy = 0;
    }
    // If the up arrow key was pressed and the snake is not already moving down
    if (keyPressed === UP_KEY && !goingDown) {
        // Set the movement delta to move the snake 10 pixels up
        dx = 0;
        dy = -10;
    }
    // If the right arrow key was pressed and the snake is not already moving left
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        // Set the movement delta to move the snake 10 pixels to the right
        dx = 10;
        dy = 0;
    }
    // If the down arrow key was pressed and the snake is not already moving up
    if (keyPressed === DOWN_KEY && !goingUp) {
        // Set the movement delta to move the snake 10 pixels down
        dx = 0;
        dy = 10;
    }
}

// Function to generate a random integer multiple of 10 between two values (inclusive)
function randomTen(min, max) {
    // Round the result of the calculation to the nearest multiple of 10
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

// Function to create a new food object with random x and y position
function createFood() {
    // Initialize the food object with random x and y position
    food = {
        x: randomTen(0, canvas.width - 10),
        y: randomTen(0, canvas.height - 10)
    };

    // Iterate through each segment of the snake
    for (let i = 0; i < snake.length; i++) {
        // If the food is at the same position as a snake segment
        if (food.x === snake[i].x && food.y === snake[i].y) {
            // Create new food at a different position
            createFood();
        }
    }
}

createFood();
main();