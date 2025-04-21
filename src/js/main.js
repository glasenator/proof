import { resetLevel, startNextLevel, restartGame, initializeGame } from './gameState.js';
import { renderGrid } from './render.js';
import { movePlayer } from './movement.js';

// Add event listeners for dialog buttons
document.getElementById('next-level-btn').addEventListener('click', startNextLevel);
document.getElementById('restart-btn').addEventListener('click', restartGame);

// Add keyboard event listener for player movement
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

// Initialize the game
initializeGame(); 