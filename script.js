const gridSize = 5;
let playerPos = { x: 0, y: 0 };
let bigfootPos = { x: 4, y: 4 };
let previousBigfootPos = { x: 4, y: 4 }; // Track Bigfoot's previous position
let fbiPos = { x: 2, y: 2 }; // Initial position of the FBI
let previousFbiPos = { x: 2, y: 2 }; // Track FBI's previous position
let footprints = [];

// Render the grid in the HTML
function renderGrid() {
    const container = document.getElementById('game-container');
    container.innerHTML = ''; // Clear previous grid

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (playerPos.x === x && playerPos.y === y) {
                cell.classList.add('player');
                cell.textContent = '🕵️'; // Use emoji for Player
            } else if (bigfootPos.x === x && bigfootPos.y === y) {
                cell.classList.add('bigfoot');
                cell.textContent = '🦧'; // Use emoji for Bigfoot
            } else if (fbiPos.x === x && fbiPos.y === y) {
                cell.classList.add('fbi');
                cell.textContent = '👮'; // Use emoji for FBI
            } else {
                const footprint = footprints.find(f => f.x === x && f.y === y);
                if (footprint) {
                    cell.classList.add('footprint', footprint.class);
                    cell.textContent = footprint.symbol;
                }
            }

            container.appendChild(cell);
        }
    }
}

// Move Bigfoot to a random orthogonal cell
function moveBigfoot() {
    const directions = [
        { x: 0, y: -1, symbol: '🦶', class: 'up' },    // Up
        { x: 0, y: 1, symbol: '🦶', class: 'down' },  // Down
        { x: -1, y: 0, symbol: '🦶', class: 'left' }, // Left
        { x: 1, y: 0, symbol: '🦶', class: 'right' }  // Right
    ];
    const validMoves = directions.filter(dir => {
        const newX = bigfootPos.x + dir.x;
        const newY = bigfootPos.y + dir.y;
        // Exclude the previous position
        return (
            newX >= 0 && newX < gridSize &&
            newY >= 0 && newY < gridSize &&
            !(newX === previousBigfootPos.x && newY === previousBigfootPos.y)
        );
    });
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
    footprints.push({ x: bigfootPos.x, y: bigfootPos.y, symbol: move.symbol, class: move.class });

    // Keep only the last two footprints
    if (footprints.length > 2) {
        footprints.shift();
    }

    // Update Bigfoot's position and track the previous position
    previousBigfootPos = { ...bigfootPos };
    bigfootPos.x += move.x;
    bigfootPos.y += move.y;

    // Check win condition after Bigfoot moves
    if (playerPos.x === bigfootPos.x && playerPos.y === bigfootPos.y) {
        renderGrid();
        setTimeout(() => {
            alert("You found Bigfoot! You win!");
        }, 50); // Slight delay to ensure rendering completes
    }
}

// Move FBI to a random orthogonal cell
function moveFbi() {
    const directions = [
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 }   // Right
    ];
    const validMoves = directions.filter(dir => {
        const newX = fbiPos.x + dir.x;
        const newY = fbiPos.y + dir.y;
        // Exclude the previous position and Bigfoot's position
        return (
            newX >= 0 && newX < gridSize &&
            newY >= 0 && newY < gridSize &&
            !(newX === previousFbiPos.x && newY === previousFbiPos.y) &&
            !(newX === bigfootPos.x && newY === bigfootPos.y)
        );
    });
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];

    // Update FBI's position and track the previous position
    previousFbiPos = { ...fbiPos };
    fbiPos.x += move.x;
    fbiPos.y += move.y;

    // Check lose condition after FBI moves
    if (playerPos.x === fbiPos.x && playerPos.y === fbiPos.y) {
        renderGrid();
        setTimeout(() => {
            alert("The FBI caught you! You lose!");
        }, 50); // Slight delay to ensure rendering completes
    }
}

// Handle player movement
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
        playerPos.x = newX;
        playerPos.y = newY;

        // Check if the player steps on a footprint
        const footprint = footprints.find(f => f.x === playerPos.x && f.y === playerPos.y);
        const footprintDisplay = document.getElementById('footprint-display');
        footprintDisplay.className = ''; // Clear existing classes
        if (footprint) {
            footprintDisplay.textContent = footprint.symbol; // Display the footprint emoji
            footprintDisplay.classList.add(footprint.class); // Apply the correct rotation class
        } else {
            footprintDisplay.textContent = ''; // Clear the display if no footprint
        }

        // Check win condition
        if (playerPos.x === bigfootPos.x && playerPos.y === bigfootPos.y) {
            renderGrid();
            setTimeout(() => {
                alert("You found Bigfoot! You win!");
            }, 50); // Slight delay to ensure rendering completes
            return;
        }

        // Check lose condition
        if (playerPos.x === fbiPos.x && playerPos.y === fbiPos.y) {
            renderGrid();
            setTimeout(() => {
                alert("The FBI caught you! You lose!");
            }, 50); // Slight delay to ensure rendering completes
            return;
        }

        moveBigfoot();
        moveFbi();
        renderGrid();
    }
}

// Listen for arrow key presses
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
});

// Start the game
renderGrid();
