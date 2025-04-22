import {
    playerPos,
    bigfootPos,
    footprints,
    gridSize,
    revealedBigfootPos
} from './gameState.js';
import { renderGrid } from './render.js';

let isTelescopeActive = false;

function activateTelescope() {
    if (isTelescopeActive) return;
    
    isTelescopeActive = true;
    highlightBorderCells();
    
    const telescopeBtn = document.getElementById('telescope-btn');
    telescopeBtn.disabled = true;
    
    // Disable camera button
    const cameraBtn = document.getElementById('camera-btn');
    cameraBtn.disabled = true;
}

function deactivateTelescope() {
    isTelescopeActive = false;
    removeHighlightFromCells();
    
    const telescopeBtn = document.getElementById('telescope-btn');
    telescopeBtn.disabled = false;
    
    // Re-enable camera button
    const cameraBtn = document.getElementById('camera-btn');
    cameraBtn.disabled = false;
}

function highlightBorderCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        if ((x === playerPos.x && (y === 0 || y === gridSize - 1) && !(x === playerPos.x && y === playerPos.y)) ||
            (y === playerPos.y && (x === 0 || x === gridSize - 1) && !(x === playerPos.x && y === playerPos.y))) {
            cell.classList.add('clickable');
            
            // Add hover event listeners
            cell.addEventListener('mouseenter', () => {
                const dx = x - playerPos.x;
                const dy = y - playerPos.y;
                const steps = Math.max(Math.abs(dx), Math.abs(dy));
                
                for (let i = 0; i <= steps; i++) {
                    const checkX = playerPos.x + Math.sign(dx) * i;
                    const checkY = playerPos.y + Math.sign(dy) * i;
                    const lineCell = document.querySelector(`.cell[data-x="${checkX}"][data-y="${checkY}"]`);
                    if (lineCell) {
                        lineCell.classList.add('telescope-line');
                    }
                }
            });
            
            cell.addEventListener('mouseleave', () => {
                const cells = document.querySelectorAll('.cell');
                cells.forEach(cell => {
                    cell.classList.remove('telescope-line');
                });
            });
        }
    });
}

function removeHighlightFromCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('clickable');
        cell.classList.remove('telescope-line');
        // Remove event listeners
        cell.removeEventListener('mouseenter', null);
        cell.removeEventListener('mouseleave', null);
    });
}

function handleCellClick(event) {
    if (!isTelescopeActive) return;

    const cell = event.target.closest('.cell');
    if (!cell) return;

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    // Calculate the direction vector
    const dx = Math.sign(x - playerPos.x);
    const dy = Math.sign(y - playerPos.y);
    let currentX = playerPos.x + dx;
    let currentY = playerPos.y + dy;

    // Check each cell along the line
    while (currentX !== x || currentY !== y) {
        // If we find Bigfoot along the line, reveal him
        if (currentX === bigfootPos.x && currentY === bigfootPos.y) {
            revealedBigfootPos.x = currentX;
            revealedBigfootPos.y = currentY;
            renderGrid();
            deactivateTelescope();
            return;
        }

        // Mark the cell as checked
        const lineCell = document.querySelector(`.cell[data-x="${currentX}"][data-y="${currentY}"]`);
        if (lineCell) {
            lineCell.classList.add('checked');
        }

        currentX += dx;
        currentY += dy;
    }

    // Check the final clicked cell as well
    if (x === bigfootPos.x && y === bigfootPos.y) {
        revealedBigfootPos.x = x;
        revealedBigfootPos.y = y;
        renderGrid();
    }

    deactivateTelescope();
}

// Add event listeners
document.getElementById('telescope-btn').addEventListener('click', activateTelescope);
document.getElementById('game-container').addEventListener('click', handleCellClick);

export {
    isTelescopeActive,
    activateTelescope,
    deactivateTelescope
}; 