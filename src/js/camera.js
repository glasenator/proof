import {
    playerPos,
    bigfootPos,
    showWinDialog,
    setCameraFlash
} from './gameState.js';
import { renderGrid } from './render.js';

let isCameraActive = false;

function activateCamera() {
    if (isCameraActive) return; // Don't activate if already active
    
    isCameraActive = true;
    highlightClickableCells();
    
    // Disable the camera button
    const cameraBtn = document.getElementById('camera-btn');
    cameraBtn.disabled = true;
    
    // Disable telescope button
    const telescopeBtn = document.getElementById('telescope-btn');
    telescopeBtn.disabled = true;
}

function deactivateCamera() {
    isCameraActive = false;
    removeHighlightFromCells();
    
    // Re-enable the camera button
    const cameraBtn = document.getElementById('camera-btn');
    cameraBtn.disabled = false;
    
    // Re-enable telescope button
    const telescopeBtn = document.getElementById('telescope-btn');
    telescopeBtn.disabled = false;
}

function highlightClickableCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        
        // Highlight cells in the same row or column as the player, but not the player's cell
        if ((x === playerPos.x || y === playerPos.y) && !(x === playerPos.x && y === playerPos.y)) {
            cell.classList.add('clickable');
        }
    });
}

function removeHighlightFromCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('clickable');
    });
}

function handleCellClick(event) {
    if (!isCameraActive) return;
    
    const cell = event.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    
    // Don't allow clicking on the player's cell
    if (x === playerPos.x && y === playerPos.y) {
        return;
    }
    
    // Check if the clicked cell is in the same row or column as the player
    if (x === playerPos.x || y === playerPos.y) {
        // Create camera flash at player's position
        setCameraFlash(playerPos.x, playerPos.y);
        
        // If Bigfoot is in the clicked cell, reveal him and win
        if (x === bigfootPos.x && y === bigfootPos.y) {
            cell.classList.add('bigfoot');
            cell.textContent = '🦧';
            showWinDialog();
        }
    }
    
    deactivateCamera();
    renderGrid(); // Re-render to show the flash
}

// Add event listeners
document.getElementById('camera-btn').addEventListener('click', activateCamera);
document.getElementById('game-container').addEventListener('click', handleCellClick);

export {
    isCameraActive,
    activateCamera,
    deactivateCamera
}; 