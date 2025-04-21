import { renderGrid } from './render.js';

let initialGridSize = 5;
let gridSize = initialGridSize;
let level = 1;
let playerPos = { x: 2, y: 4 };
let bigfootPos = { x: 2, y: 2 };
let previousBigfootPos = { x: 2, y: 2 };
let fbiPos = { x: 2, y: 0 };
let previousFbiPos = { x: 2, y: 0 };
let footprints = [];
let isWinDialogVisible = false;
let isLoseDialogVisible = false;

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
    isWinDialogVisible = false;
    isLoseDialogVisible = false;
    
    // Update level display
    document.getElementById('level').textContent = level;
    document.getElementById('footprint-display').textContent = '';
    document.getElementById('footprint-display').className = '';
    
    // Update grid size
    container.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;
}

// Function to start next level
function startNextLevel() {
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
function restartGame() {
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

// Functions to handle dialog visibility
function showWinDialog() {
    console.log('Showing win dialog'); // Debug log
    isWinDialogVisible = true;
    const dialog = document.getElementById('level-up-dialog');
    if (dialog) {
        dialog.style.display = 'flex';
    } else {
        console.error('Win dialog element not found!');
    }
}

function showLoseDialog() {
    isLoseDialogVisible = true;
    document.getElementById('final-level').textContent = level;
    document.getElementById('game-over-dialog').style.display = 'flex';
}

// Function to check if game is in progress
function isGameInProgress() {
    return !isWinDialogVisible && !isLoseDialogVisible;
}

// Initialize the game
function initializeGame() {
    resetLevel();
    renderGrid();
}

export {
    gridSize,
    level,
    playerPos,
    bigfootPos,
    previousBigfootPos,
    fbiPos,
    previousFbiPos,
    footprints,
    isWinDialogVisible,
    isLoseDialogVisible,
    placeBigfoot,
    resetLevel,
    startNextLevel,
    restartGame,
    showWinDialog,
    showLoseDialog,
    isGameInProgress,
    initializeGame
}; 