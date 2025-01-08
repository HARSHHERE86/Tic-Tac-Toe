const board = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-btn');
const modeButtons = document.getElementsByName('mode');
let currentPlayer = 'X';
let gameActive = true;
let mode = 'player';

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let gameState = ['', '', '', '', '', '', '', '', ''];

// Check for win
function checkWin() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return gameState[a];
    }
  }
  return null;
}

// Handle AI move
function aiMove() {
  const availableCells = gameState.map((value, index) => value === '' ? index : null).filter(v => v !== null);
  const randomMove = availableCells[Math.floor(Math.random() * availableCells.length)];
  gameState[randomMove] = currentPlayer;
  board[randomMove].textContent = currentPlayer;
  board[randomMove].classList.add('taken');
}

// Handle click event
function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  
  if (gameState[index] || !gameActive) return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('taken');

  const winner = checkWin();
  if (winner) {
    statusDisplay.textContent = `Player ${winner} wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes('')) {
    statusDisplay.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = mode === 'player' ? `Player ${currentPlayer}'s turn` : `Your turn`;

  if (mode === 'ai' && currentPlayer === 'O' && gameActive) {
    setTimeout(() => {
      aiMove();
      const winner = checkWin();
      if (winner) {
        statusDisplay.textContent = `Player ${winner} wins!`;
        gameActive = false;
      } else if (!gameState.includes('')) {
        statusDisplay.textContent = 'Draw!';
        gameActive = false;
      } else {
        currentPlayer = 'X';
        statusDisplay.textContent = `Your turn`;
      }
    }, 500);
  }
}

// Reset game
function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.textContent = `Player X's turn`;
  board.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
}

// Mode selection
modeButtons.forEach(button => {
  button.addEventListener('change', () => {
    mode = button.value;
    resetGame();
  });
});

// Add event listeners
board.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
