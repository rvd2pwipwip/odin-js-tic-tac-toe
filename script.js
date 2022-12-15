////////////////////////////////////////////
///// board
///////////////////////////////////////////

const gameboard = (() => {
  const grid = document.querySelector('.grid');
  let board = ['', '', '', '', '', '', '', '', ''];

  const drawBoard = () => {
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

  return {
    board,
    grid,
    drawBoard,
  };
})();

////////////////////////////////////////////
///// game
///////////////////////////////////////////

const gameController = (() => {
  //declare variables used to track game state

  //isGameActive to pause game in case of end scenario
  let isGameActive = true;
  //store current player to know who's turn it is
  let currentPlayer = 'X';

  const playerDisplay = document.querySelector('.player-display');

  //access the board array
  const board = gameboard.board;

  //validate legal move
  const isValidPlay = (tile) => {
    if (tile.innerText === 'X' || tile.innerText === 'O') {
      return false;
    }
    return true;
  };

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
      console.log(combo);
      const a = board[combo[0]];
      const b = board[combo[1]];
      const c = board[combo[2]];

      if (a === '' || b === '' || c === '') {
        continue;
      }

      if (a === b && b === c) {
        gameWon = true;
        break;
      }
    }

    if (gameWon) {
      console.log('game won');
      isGameActive = false;
      return;
    }

    if (!board.includes('')) {
      console.log('tie');
    }
  };

  //handle player change
  const changePlayer = () => {
    playerDisplay.classList.remove(`player${currentPlayer}`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerDisplay.innerText = currentPlayer;
    playerDisplay.classList.add(`player${currentPlayer}`);
  };

  //handle player turn
  const playTurn = (e) => {
    const tile = e.target;
    if (isValidPlay(tile)) {
      e.target.innerText = currentPlayer;
      board[e.target.dataset.tileId] = currentPlayer;
      changePlayer();
    }
    evaluateGame();
  };

  return {
    currentPlayer,
    isGameActive,
    playTurn,
    evaluateGame,
  };
})();

const playerFactory = (name, player) => {
  return { name, player };
};

const player1 = playerFactory('dude', true);

gameboard.drawBoard();