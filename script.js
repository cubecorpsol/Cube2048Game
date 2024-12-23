const boardSize = 4;
let board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
let score = 0;

// Render the board in a 4x4 grid
function renderBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = '';
    board.forEach(row => {
        row.forEach(tile => {
            const tileDiv = document.createElement('div');
            tileDiv.className = `tile tile-${tile}`;
            tileDiv.textContent = tile > 0 ? tile : '';
            boardContainer.appendChild(tileDiv);
        });
    });
    document.getElementById('score').textContent = score;
}

// Add a new tile to the board
function addNewTile() {
    const emptyTiles = [];
    board.forEach((row, r) => {
        row.forEach((tile, c) => {
            if (tile === 0) emptyTiles.push([r, c]);
        });
    });
    if (emptyTiles.length === 0) return false;
    const [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
    return true;
}

// Move the board in a specific direction
function moveBoard(direction) {
    let moved = false;

    const mergeRow = row => {
        const newRow = row.filter(value => value !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i];
                newRow[i + 1] = 0;
            }
        }
        return newRow.filter(value => value !== 0);
    };

    for (let i = 0; i < boardSize; i++) {
        let row = board[i];
        if (direction === 'left' || direction === 'right') {
            if (direction === 'right') row = row.reverse();
            const newRow = mergeRow(row);
            while (newRow.length < boardSize) newRow.push(0);
            if (direction === 'right') newRow.reverse();
            if (row.join() !== newRow.join()) moved = true;
            board[i] = newRow;
        } else {
            let col = board.map(row => row[i]);
            if (direction === 'down') col = col.reverse();
            const newCol = mergeRow(col);
            while (newCol.length < boardSize) newCol.push(0);
            if (direction === 'down') newCol.reverse();
            if (col.join() !== newCol.join()) moved = true;
            newCol.forEach((val, idx) => (board[idx][i] = val));
        }
    }

    if (moved) addNewTile();
    if (!addNewTile()) isGameOver();
    renderBoard();
}

// Check if the game is over
function isGameOver() {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) return false;
            if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) return false;
            if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    document.getElementById('game-over-message').style.display = 'block';
    return true;
}

// Event listeners for controls
document.getElementById('up').addEventListener('click', () => moveBoard('up'));
document.getElementById('down').addEventListener('click', () => moveBoard('down'));
document.getElementById('left').addEventListener('click', () => moveBoard('left'));
document.getElementById('right').addEventListener('click', () => moveBoard('right'));

// Handle keyboard arrow keys
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveBoard('up');
            break;
        case 'ArrowDown':
            moveBoard('down');
            break;
        case 'ArrowLeft':
            moveBoard('left');
            break;
        case 'ArrowRight':
            moveBoard('right');
            break;
        default:
            break;
    }
});

document.getElementById('restartButton').addEventListener('click', () => {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    score = 0;
    document.getElementById('game-over-message').style.display = 'none';
    addNewTile();
    addNewTile();
    renderBoard();
});

// Initialize the game
addNewTile();
addNewTile();
renderBoard();
