////////////////////////////////////////////
///// players
///////////////////////////////////////////
const setPlayers = (() => {
  const start = document.getElementById('start');
  const startScreen = document.getElementById('start-screen');
  const gameScreen = document.getElementById('game-screen');

  const createPlayer = (name, marker) => {
    return { name, marker };
  };

  let players = [];

  start.addEventListener('click', (e) => {
    e.preventDefault(); //prevent form submission page reload
    const player1name = document.getElementById('player-one').value;
    const player2name = document.getElementById('player-two').value;
    const player1 = createPlayer(player1name || 'Player 1', 'X');
    const player2 = createPlayer(player2name || 'Player 2', 'O');
    players.push(player1, player2);
    gameController.setPlayers(players); // Set players in gameController
    gameboard.drawBoard();
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
  });
})();

////////////////////////////////////////////
///// gameboard
///////////////////////////////////////////

const gameboard = (() => {
  const grid = document.querySelector('.grid');
  let board = ['', '', '', '', '', '', '', '', ''];

  const drawBoard = () => {
    grid.innerHTML = ''; // Clear the grid before drawing
    board.forEach((item, index) => {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.dataset.tileId = index;
      tile.addEventListener('click', (e) => {
        gameController.playTurn(e);
      });

      grid.appendChild(tile);
    });
  };

  const resetBoard = () => {
    // modify original board array in place
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  return {
    board,
    grid,
    drawBoard,
    resetBoard,
  };
})();

////////////////////////////////////////////
///// game
///////////////////////////////////////////

const gameController = (() => {
  //declare variables used to track game state

  let players = [];
  //isGameActive to pause game in case of end scenario
  let isGameActive = true;
  //store current player to know who's turn it is
  let currentPlayer = null;
  //validate legal move
  const isValidPlay = (tile) => (tile.innerText === '' ? true : false);

  const playerDisplay = document.querySelector('.player-display');

  //access the board array
  const board = gameboard.board;
  /*
   board indexes:
   [0] [1] [2]
   [3] [4] [5]
   [6] [7] [8]
  */
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //evaluate game result
  const evaluateGame = () => {
    let gameWon = false;
    const length = winningCombos.length;

    for (let i = 0; i < length; i++) {
      const combo = winningCombos[i];
      const a = board[combo[0]];
      const b = board[combo[1]];
      const c = board[combo[2]];
      // console.log(`Evaluating combo: ${combo}, values: ${a}, ${b}, ${c}`);

      if (a === '' || b === '' || c === '') {
        continue;
      }
      if (a === b && b === c) {
        gameWon = true;
        break;
      }
    }

    if (gameWon) {
      playerDisplay.innerText = `${currentPlayer.name} wins the game!`;
      resetButton.innerText = 'Play Again';
      isGameActive = false;
      return;
    }

    if (!board.includes('')) {
      playerDisplay.innerText = "It's a tie...";
      resetButton.innerText = 'Play Again';
      isGameActive = false;
    }
    changePlayer();
  };

  //get players
  const setPlayers = (newPlayers) => {
    players = newPlayers;
    currentPlayer = players[0];
    playerDisplay.innerText = `${currentPlayer.name}'s turn to play ${currentPlayer.marker}`;
    playerDisplay.classList.add(`player${currentPlayer.marker}`);
  };

  //handle player change
  const changePlayer = () => {
    if (isGameActive) {
      playerDisplay.classList.remove(`player${currentPlayer.marker}`);
      currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
      playerDisplay.innerText = `${currentPlayer.name}'s turn to play ${currentPlayer.marker}`;
      playerDisplay.classList.add(`player${currentPlayer.marker}`);
    }
  };

  //handle player turn
  const playTurn = (e) => {
    if (isGameActive) {
      const tile = e.target;
      if (isValidPlay(tile)) {
        e.target.innerText = currentPlayer.marker;
        board[e.target.dataset.tileId] = currentPlayer.marker;
        resetButton.disabled = false;
      }
      evaluateGame();
    }
  };

  //game reset
  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', () => {
    gameController.resetGame();
  });

  const resetGame = () => {
    gameboard.resetBoard(); // Reset the board array
    // gameboard.board = ['', '', '', '', '', '', '', '', ''];//creates new array instead of reset!!!
    gameboard.drawBoard();
    isGameActive = true;
    currentPlayer = players[0];
    playerDisplay.innerText = `${currentPlayer.name}'s turn to play ${currentPlayer.marker}`;
    playerDisplay.classList.add(`player${currentPlayer.marker}`);
    resetButton.innerText = 'Restart';
    resetButton.disabled = true;
    // console.log('Game reset. Current board:', gameboard.board);
  };

  return {
    isGameActive,
    playTurn,
    evaluateGame,
    resetGame,
    setPlayers,
  };
})();
