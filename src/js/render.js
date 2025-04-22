import {
    gridSize,
    playerPos,
    bigfootPos,
    fbiPos,
    footprints,
    revealedBigfootPos
} from './gameState.js';

// Render the grid in the HTML
export function renderGrid() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    container.style.gridTemplateRows = `repeat(${gridSize}, 50px)`;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;

            // Add content to cell
            if (x === playerPos.x && y === playerPos.y) {
                cell.classList.add('player');
                cell.textContent = '🕵️';
            } else if (revealedBigfootPos && x === revealedBigfootPos.x && y === revealedBigfootPos.y) {
                cell.classList.add('bigfoot');
                cell.textContent = '🦧';
            } else if (x === fbiPos.x && y === fbiPos.y) {
                cell.classList.add('fbi');
                cell.textContent = '👮';
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