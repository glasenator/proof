import {
    gridSize,
    playerPos,
    bigfootPos,
    previousBigfootPos,
    fbiPos,
    previousFbiPos,
    footprints,
    showLoseDialog,
    showWinDialog,
    cameraFlashPos,
    clearCameraFlash,
    isGameInProgress,
    revealedBigfootPos
} from './gameState.js';
import { renderGrid } from './render.js';

// Move Bigfoot to a random orthogonal cell
export function moveBigfoot() {
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

    // Update positions
    previousBigfootPos.x = bigfootPos.x;
    previousBigfootPos.y = bigfootPos.y;
    bigfootPos.x += move.x;
    bigfootPos.y += move.y;
}

// Move FBI to a random orthogonal cell
export function moveFbi() {
    const directions = [
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 }   // Right
    ];

    // If there's a camera flash, move towards it
    if (cameraFlashPos) {
        // Calculate the best move to get closer to the flash
        const dx = cameraFlashPos.x - fbiPos.x;
        const dy = cameraFlashPos.y - fbiPos.y;
        
        // Prioritize the direction with the larger difference
        let move;
        if (Math.abs(dx) > Math.abs(dy)) {
            move = { x: Math.sign(dx), y: 0 };
        } else {
            move = { x: 0, y: Math.sign(dy) };
        }

        // Check if the move is valid
        const newX = fbiPos.x + move.x;
        const newY = fbiPos.y + move.y;
        
        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
            // Store current position before moving
            previousFbiPos.x = fbiPos.x;
            previousFbiPos.y = fbiPos.y;
            
            // Update FBI position
            fbiPos.x = newX;
            fbiPos.y = newY;

            // If FBI reaches the flash, clear it
            if (fbiPos.x === cameraFlashPos.x && fbiPos.y === cameraFlashPos.y) {
                clearCameraFlash();
            }
            
            return;
        }
    }

    // If no flash or can't move towards it, move randomly
    const validMoves = directions.filter(dir => {
        const newX = fbiPos.x + dir.x;
        const newY = fbiPos.y + dir.y;
        
        // Check if the move is within bounds
        if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
            return false;
        }

        // Don't move to the previous position
        if (newX === previousFbiPos.x && newY === previousFbiPos.y) {
            return false;
        }

        return true;
    });

    if (validMoves.length > 0) {
        // Store current position before moving
        previousFbiPos.x = fbiPos.x;
        previousFbiPos.y = fbiPos.y;
        
        // Choose a random valid move
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        
        // Update FBI position
        fbiPos.x += move.x;
        fbiPos.y += move.y;
    }
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
    // Check lose condition
    if (playerPos.x === fbiPos.x && playerPos.y === fbiPos.y) {
        renderGrid();
        showLoseDialog();
        return true;
    }

    return false;
}

// Handle player movement
export function movePlayer(dx, dy) {
    if (!isGameInProgress()) return;
    
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    // Check if the move is valid
    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
        // Reset revealedBigfootPos when player moves
        revealedBigfootPos.x = null;
        revealedBigfootPos.y = null;
        
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
        }
        
        renderGrid();
    }
} 