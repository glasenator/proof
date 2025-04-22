import {
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
    showWinDialog,
    showLoseDialog,
    isGameInProgress,
    startNextLevel,
    restartGame,
    initializeGame
} from './gameState.js';
import { movePlayer } from './movement.js';
import { renderGrid } from './render.js';
import './camera.js'; // Import camera module
import './telescope.js';

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