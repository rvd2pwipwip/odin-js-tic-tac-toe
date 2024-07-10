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
    const player1 = createPlayer(player1name, 'X');
    const player2 = createPlayer(player2name, 'O');
    players.push(player1, player2);
    console.log('Players initialized:', players);
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

  console.log('drew board');
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

  let players = [];
  //isGameActive to pause game in case of end scenario
  let isGameActive = true;
  //store current player to know who's turn it is
  let currentPlayer = null;

  const playerDisplay = document.querySelector('.player-display');

  //access the board array
  const board = gameboard.board;

  //validate legal move
  const isValidPlay = (tile) => (tile.innerText === '' ? true : false);

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
      isGameActive = false;
    }
  };

  //handle player change
  const changePlayer = () => {
    playerDisplay.classList.remove(`player${currentPlayer.marker}`);
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    console.log(`current player: ${currentPlayer.name}`);
    playerDisplay.innerText = `${currentPlayer.name}'s turn to play ${currentPlayer.marker}`;
    playerDisplay.classList.add(`player${currentPlayer.marker}`);
  };

  //handle player turn
  const playTurn = (e) => {
    if (isGameActive) {
      const tile = e.target;
      if (isValidPlay(tile)) {
        e.target.innerText = currentPlayer.marker;
        board[e.target.dataset.tileId] = currentPlayer.marker;
        changePlayer();
      }
      evaluateGame();
    }
  };

  const resetGame = () => {
    gameboard.board = ['', '', '', '', '', '', '', '', ''];
    gameboard.grid.innerHTML = '';
    gameboard.drawBoard();
    isGameActive = true;
    currentPlayer = players[0];
    playerDisplay.innerText = `${currentPlayer.name}'s turn to play ${currentPlayer.marker}`;
    playerDisplay.classList.add(`player${currentPlayer.marker}`);
  };

  const setPlayers = (newPlayers) => {
    players = newPlayers;
    currentPlayer = players[0];
    console.log('Current player set:', currentPlayer);
    playerDisplay.innerText = `${currentPlayer.name}'s turn to play ${currentPlayer.marker}`;
    playerDisplay.classList.add(`player${currentPlayer.marker}`);
  };

  console.log('set gameController');
  return {
    isGameActive,
    playTurn,
    evaluateGame,
    resetGame,
    setPlayers,
  };
})();

const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
  gameController.resetGame();
});
