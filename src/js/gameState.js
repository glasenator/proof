import { renderGrid } from './render.js';

let initialGridSize = 5;
export let gridSize = initialGridSize;
export let level = 1;
export let playerPos = { x: 2, y: 4 };
export let bigfootPos = { x: 2, y: 2 };
export let previousBigfootPos = { x: 2, y: 2 };
export let fbiPos = { x: 2, y: 0 };
export let previousFbiPos = { x: 2, y: 0 };
export let footprints = [];
export let walls = [];
export let isWinDialogVisible = false;
export let isLoseDialogVisible = false;
export let cameraFlashPos = null; // Track the position of the camera flash

// Function to place Bigfoot in a random unoccupied cell
export function placeBigfoot() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
    } while ((x === playerPos.x && y === playerPos.y) || (x === fbiPos.x && y === fbiPos.y));
    
    return { x, y };
}

// Function to reset the game state for a new level
export function resetLevel() {
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
    walls = [];
    isWinDialogVisible = false;
    isLoseDialogVisible = false;
    cameraFlashPos = null; // Reset camera flash
    
    // Update level display
    document.getElementById('level').textContent = level;
    document.getElementById('footprint-display').textContent = '';
    document.getElementById('footprint-display').className = '';
    
    // Update grid size
    container.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;
}

// Function to start next level
export function startNextLevel() {
    // Hide the win dialog first
    document.getElementById('level-up-dialog').style.display = 'none';
    isWinDialogVisible = false;
    
    // Increment level and update grid size
    level++;
    gridSize = initialGridSize + (level - 1) * 2;
    
    // Reset the game state
    resetLevel();
    
    // Render the grid immediately
    renderGrid();
}

// Function to restart the game
export function restartGame() {
    // Hide the game over dialog
    document.getElementById('game-over-dialog').style.display = 'none';
    isLoseDialogVisible = false;
    
    // Reset level and grid size
    level = 1;
    gridSize = initialGridSize;
    
    // Reset the game state
    resetLevel();
    
    // Render the grid immediately
    renderGrid();
}

// Function to check if a wall exists between two positions
export function hasWall(pos1, pos2) {
    return walls.some(wall => 
        (wall.x1 === pos1.x && wall.y1 === pos1.y && wall.x2 === pos2.x && wall.y2 === pos2.y) ||
        (wall.x1 === pos2.x && wall.y1 === pos2.y && wall.x2 === pos1.x && wall.y2 === pos1.y)
    );
}

// Function to add a wall between two positions
export function addWall(pos1, pos2) {
    // Only create walls between Bigfoot and FBI
    if ((pos1 === bigfootPos && pos2 === fbiPos) || (pos1 === fbiPos && pos2 === bigfootPos)) {
        // Determine which side to place the wall based on relative positions
        let wallSide;
        if (pos1.x === pos2.x) {
            // Vertical wall (same column)
            wallSide = pos1.y < pos2.y ? 'top' : 'bottom';
        } else {
            // Horizontal wall (same row)
            wallSide = pos1.x < pos2.x ? 'left' : 'right';
        }

        // Check if wall already exists
        if (!hasWall(pos1, pos2)) {
            // Create wall in the space between the two positions
            const wall = {
                x1: pos1.x,
                y1: pos1.y,
                x2: pos2.x,
                y2: pos2.y,
                side: wallSide
            };
            walls.push(wall);
            console.log('Created wall between Bigfoot and FBI:', {
                bigfootPos: { ...bigfootPos },
                fbiPos: { ...fbiPos },
                wallSide,
                wall,
                walls: [...walls]
            });
        }
    }
}

// Function to check if a move is valid (not blocked by walls)
export function isValidMove(fromPos, toPos) {
    // FBI can move through walls
    if (fromPos === fbiPos) return true;
    
    // Check if there's a wall blocking the move
    return !hasWall(fromPos, toPos);
}

// Functions to handle dialog visibility
export function showWinDialog() {
    console.log('Showing win dialog'); // Debug log
    isWinDialogVisible = true;
    const dialog = document.getElementById('level-up-dialog');
    if (dialog) {
        dialog.style.display = 'flex';
    } else {
        console.error('Win dialog element not found!');
    }
}

export function showLoseDialog() {
    isLoseDialogVisible = true;
    document.getElementById('final-level').textContent = level;
    document.getElementById('game-over-dialog').style.display = 'flex';
}

// Function to check if game is in progress
export function isGameInProgress() {
    return !isWinDialogVisible && !isLoseDialogVisible;
}

// Function to set camera flash position
export function setCameraFlash(x, y) {
    cameraFlashPos = { x, y };
}

// Function to clear camera flash
export function clearCameraFlash() {
    cameraFlashPos = null;
}

// Initialize the game
export function initializeGame() {
    resetLevel();
    renderGrid();
} 