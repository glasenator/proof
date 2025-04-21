import {
    gridSize,
    playerPos,
    bigfootPos,
    fbiPos,
    footprints,
    walls,
    cameraFlashPos
} from './gameState.js';

// Render the grid in the HTML
export function renderGrid() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

    // Create cells
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            // Add wall classes
            walls.forEach(wall => {
                if (wall.x1 === x && wall.y1 === y) {
                    cell.classList.add(`wall-${wall.side}`);
                }
            });
            
            // Check if this is the exact collision cell
            const isCollisionCell = x === playerPos.x && y === playerPos.y && 
                                  playerPos.x === bigfootPos.x && playerPos.y === bigfootPos.y;
            
            if (isCollisionCell) {
                // Show Bigfoot in the collision cell
                cell.classList.add('bigfoot');
                cell.textContent = '🦧';
            } else if (playerPos.x === x && playerPos.y === y) {
                // Show player in their cell
                cell.classList.add('player');
                cell.textContent = '🕵️';
            } else if (fbiPos.x === x && fbiPos.y === y) {
                // Show FBI in their cell
                cell.classList.add('fbi');
                cell.textContent = '👮';
            } else if (cameraFlashPos && x === cameraFlashPos.x && y === cameraFlashPos.y) {
                cell.classList.add('flash');
                cell.textContent = '📸';
            } else {
                // Show footprints if present
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