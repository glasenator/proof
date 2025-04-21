const initialGridSize = 5;
let gridSize = initialGridSize;
let level = 1;
let playerPos = { x: 0, y: 0 };
let bigfootPos = { x: 4, y: 4 };
let previousBigfootPos = { x: 4, y: 4 }; // Track Bigfoot's previous position
let fbiPos = { x: 2, y: 2 }; // Initial position of the FBI
let previousFbiPos = { x: 2, y: 2 }; // Track FBI's previous position
let footprints = [];
let isWinDialogVisible = false; // Track if level-up dialog is visible
let isLoseDialogVisible = false; // Track if game-over dialog is visible

// Function to place Bigfoot in a random unoccupied cell
function placeBigfoot() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
    } while ((x === playerPos.x && y === playerPos.y) || (x === fbiPos.x && y === fbiPos.y));
    
    return { x, y };
}

// Function to reset the game state for a new level
function resetLevel() {
    // Clear the game container
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    
    // Reset positions
    const middleX = Math.floor(gridSize / 2);
    playerPos = { x: middleX, y: gridSize - 1 }; // Bottom middle cell
    fbiPos = { x: middleX, y: 0 }; // Top middle cell
    previousFbiPos = { ...fbiPos };
    bigfootPos = placeBigfoot();
    previousBigfootPos = { ...bigfootPos };
    
    // Reset game state
    footprints = [];
    
    // Update level display
    document.getElementById('level').textContent = level;
    document.getElementById('footprint-display').textContent = '';
    document.getElementById('footprint-display').className = '';
    
    // Render the new grid
    renderGrid();
}

// Function to start next level
function startNextLevel() {
    level++;
    gridSize = initialGridSize + (level - 1) * 2;
    isWinDialogVisible = false; // Reset win dialog visibility
    resetLevel();
    document.getElementById('level-up-dialog').style.display = 'none';
}

// Render the grid in the HTML
function renderGrid() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

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
            isWinDialogVisible = true; // Set dialog as visible
            document.getElementById('level-up-dialog').style.display = 'flex';
        }, 50);
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
            isLoseDialogVisible = true;
            document.getElementById('final-level').textContent = level;
            document.getElementById('game-over-dialog').style.display = 'flex';
        }, 50);
    }
}

// Function to restart the game
function restartGame() {
    level = 1;
    gridSize = initialGridSize;
    isWinDialogVisible = false;
    isLoseDialogVisible = false;
    resetLevel();
    document.getElementById('game-over-dialog').style.display = 'none';
}

// Handle player movement
function movePlayer(dx, dy) {
    // Don't allow movement while dialog is visible
    if (isWinDialogVisible || isLoseDialogVisible) return;
    
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
            footprintDisplay.textContent = footprint.symbol;
            footprintDisplay.classList.add(footprint.class);
        } else {
            footprintDisplay.textContent = '';
        }

        // Check win condition
        if (playerPos.x === bigfootPos.x && playerPos.y === bigfootPos.y) {
            renderGrid();
            setTimeout(() => {
                isDialogVisible = true;
                document.getElementById('level-up-dialog').style.display = 'flex';
            }, 50);
            return;
        }

        // Check lose condition
        if (playerPos.x === fbiPos.x && playerPos.y === fbiPos.y) {
            renderGrid();
            setTimeout(() => {
                isDialogVisible = true;
                document.getElementById('final-level').textContent = level;
                document.getElementById('game-over-dialog').style.display = 'flex';
            }, 50);
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

// Add event listeners for dialog buttons
document.getElementById('next-level-btn').addEventListener('click', startNextLevel);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Start the game
resetLevel();
