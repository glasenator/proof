import {
    gridSize,
    playerPos,
    bigfootPos,
    previousBigfootPos,
    fbiPos,
    previousFbiPos,
    footprints,
    isWinDialogVisible,
    isLoseDialogVisible,
    showWinDialog,
    showLoseDialog,
    isGameInProgress
} from './gameState.js';
import { renderGrid } from './render.js';

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

    // Update positions by modifying the object properties instead of reassigning
    previousBigfootPos.x = bigfootPos.x;
    previousBigfootPos.y = bigfootPos.y;
    bigfootPos.x += move.x;
    bigfootPos.y += move.y;
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
        return (
            newX >= 0 && newX < gridSize &&
            newY >= 0 && newY < gridSize &&
            !(newX === previousFbiPos.x && newY === previousFbiPos.y) &&
            !(newX === bigfootPos.x && newY === bigfootPos.y)
        );
    });
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];

    // Update positions by modifying the object properties instead of reassigning
    previousFbiPos.x = fbiPos.x;
    previousFbiPos.y = fbiPos.y;
    fbiPos.x += move.x;
    fbiPos.y += move.y;
}

// Update the "This Space" display
function updateSpaceDisplay() {
    const footprintDisplay = document.getElementById('footprint-display');
    footprintDisplay.className = ''; // Clear existing classes
    
    // Check if player is on Bigfoot's space
    if (playerPos.x === bigfootPos.x && playerPos.y === bigfootPos.y) {
        footprintDisplay.textContent = '🦧';
        return;
    }
    
    // Check if player is on FBI's space
    if (playerPos.x === fbiPos.x && playerPos.y === fbiPos.y) {
        footprintDisplay.textContent = '👮';
        return;
    }
    
    // Check if player is on a footprint
    const footprint = footprints.find(f => f.x === playerPos.x && f.y === playerPos.y);
    if (footprint) {
        footprintDisplay.textContent = footprint.symbol;
        footprintDisplay.classList.add(footprint.class);
    } else {
        footprintDisplay.textContent = '';
    }
}

// Check for collisions
function checkCollisions() {
    // Check win condition
    if (playerPos.x === bigfootPos.x && playerPos.y === bigfootPos.y) {
        console.log('Win condition met!', { playerPos, bigfootPos }); // Debug log
        renderGrid();
        showWinDialog();
        return true;
    }

    // Check lose condition
    if (playerPos.x === fbiPos.x && playerPos.y === fbiPos.y) {
        renderGrid();
        showLoseDialog();
        return true;
    }

    return false;
}

// Handle player movement
function movePlayer(dx, dy) {
    // Don't allow movement if game is not in progress
    if (!isGameInProgress()) return;
    
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
        // Update player position by modifying the object properties
        playerPos.x = newX;
        playerPos.y = newY;

        // Update the space display
        updateSpaceDisplay();

        // Check for collisions after player moves
        if (checkCollisions()) {
            return;
        }

        // Only move Bigfoot and FBI if the game is still in progress
        if (isGameInProgress()) {
            moveBigfoot();
            moveFbi();
            
            // Check for collisions again after Bigfoot and FBI move
            if (checkCollisions()) {
                return;
            }
            
            // Update the space display again in case Bigfoot or FBI moved to the player's position
            updateSpaceDisplay();
            renderGrid();
        }
    }
}

export { movePlayer }; 