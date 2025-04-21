import {
    gridSize,
    level,
    playerPos,
    bigfootPos,
    previousBigfootPos,
    fbiPos,
    previousFbiPos,
    footprints,
    walls,
    isWinDialogVisible,
    isLoseDialogVisible,
    showWinDialog,
    showLoseDialog,
    isGameInProgress,
    isValidMove,
    addWall,
    hasWall,
    startNextLevel,
    restartGame,
    initializeGame
} from './gameState.js';
import { renderGrid } from './render.js';
import { movePlayer } from './movement.js';
import './camera.js'; // Import camera module

// Initialize the game
initializeGame();

// Add event listeners for dialog buttons
document.getElementById('next-level-btn').addEventListener('click', () => {
    document.getElementById('level-up-dialog').style.display = 'none';
    startNextLevel();
});

document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('game-over-dialog').style.display = 'none';
    restartGame();
});

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (!isGameInProgress()) return;
    
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