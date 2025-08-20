"use strict";

const playerOneInput = document.getElementById("playerOneName");
const playerTwoInput = document.getElementById("playerTwoName");
const startGameBtn = document.querySelector(".startGameBtn");
const gameContainer = document.querySelector(".game-container");
const formContainer = document.querySelector(".player-name-form");

//Creating and managing the 3*3 board or grid of cells

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMark = (row, column, playerMark) => {
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
      console.log("Invalid row or column. Please choose within 0-2.");
      return false;
    }

    if (board[row][column].getValue() !== "") {
      console.log("That cell is already taken. Please choose another.");
      return false;
    }

    board[row][column].addMark(playerMark);
    return true;
  };

  const printBoard = () => {
    const boardValues = board.map((row) =>
      row.map((cell) => {
        const value = cell.getValue();
        return value === "" ? " " : value;
      })
    );

    console.log(`-------------`);
    for (let i = 0; i < 3; i++) {
      console.log(
        `| ${boardValues[i][0]} | ${boardValues[i][1]} | ${boardValues[i][2]} |`
      );
      console.log(`-------------`);
    }
  };

  return { getBoard, placeMark, printBoard };
}

//Representation of single cell on a Tic-Tac-Toe board

function Cell() {
  let value = "";

  const addMark = (playerMark) => {
    value = playerMark;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  let board = Gameboard();

  const players = [
    { name: playerOneName || "Player One", mark: "X" },
    {
      name: playerTwoName || "Player Two",
      mark: "O",
    },
  ];

  const winningCombos = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  let activePlayer = players[0];
  let movesMade = 0;
  let gameOver = false;
  let winner = "";

  const getGameOverStatus = () => gameOver;

  const getActivePlayer = () => activePlayer;

  const getWinner = () => winner;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const printNewRound = () => {
    board.printBoard();
    if (!checkWin() && !checkDraw()) {
      console.log(
        `${getActivePlayer().name}'s turn (${getActivePlayer().mark}).`
      );
    }
  };

  const checkWin = () => {
    const currentBoard = board.getBoard();
    const activeMark = activePlayer.mark;

    for (const combo of winningCombos) {
      if (
        currentBoard[combo[0][0]][combo[0][1]].getValue() === activeMark &&
        currentBoard[combo[1][0]][combo[1][1]].getValue() === activeMark &&
        currentBoard[combo[2][0]][combo[2][1]].getValue() === activeMark
      ) {
        return true;
      }
    }
    return false;
  };

  const checkDraw = () => {
    return movesMade === 9 && !checkWin();
  };

  const restart = () => {
    board = Gameboard();
    activePlayer = players[0];
    movesMade = 0;
    gameOver = false;
    winner = "";
    printNewRound();
  };

  const getBoard = () => board.getBoard();

  const playRound = (row, column) => {
    if (gameOver) {
      console.log("Game is already over!");
      return;
    }

    const moveSuccessful = board.placeMark(row, column, getActivePlayer().mark);

    if (moveSuccessful) {
      movesMade++;

      if (checkWin()) {
        board.printBoard();
        console.log(
          `\n ${getActivePlayer().name} ${
            getActivePlayer().mark
          } wins the game. Congratulations`
        );
        winner = getActivePlayer().name;
        gameOver = true;
        return;
      }
      if (checkDraw()) {
        board.printBoard();
        console.log(`\nIt's a draw! No more moves possible.`);
        gameOver = true;
        return;
      }
      switchPlayerTurn();
      printNewRound();
    } else {
      console.log("Invalid move. Please try again.");
      printNewRound();
    }
  };
  printNewRound();
  return {
    playRound,
    getActivePlayer,
    getBoard,
    getGameOverStatus,
    getWinner,
    restart,
  };
}

function ScreenController(game) {
  const turnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");
  const restartButton = document.querySelector(".restartBtn");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const winner = game.getWinner();

    if (game.getGameOverStatus()) {
      const winner = game.getWinner();

      if (winner) {
        turnDiv.textContent = `${winner} wins!`;
      } else {
        turnDiv.textContent = "It's a Draw.";
      }
      restartButton.style.display = "block";
    } else {
      turnDiv.textContent = `${activePlayer.name}'s turn...`;
      restartButton.style.display = "none";
    }

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = colIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  const clickHandlerBoard = (e) => {
    if (game.getGameOverStatus()) {
      console.log("Game is Over. No more moves allowed.");
      return;
    }

    const selectedRow = parseInt(e.target.dataset.row);
    const selectedCol = parseInt(e.target.dataset.column);

    if (isNaN(selectedRow) || isNaN(selectedCol)) return;

    game.playRound(selectedRow, selectedCol);
    updateScreen();
  };

  restartButton.addEventListener("click", () => {
    game.restart();
    updateScreen();
  });

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

function startGame() {
  const playerOneName = playerOneInput.value.trim();
  const playerTwoName = playerTwoInput.value.trim();

  if (!playerOneName || !playerTwoName) {
    alert("Please enter names for both players to start the game.");
    return;
  }

  const game = GameController(playerOneName, playerTwoName);

  formContainer.style.display = "none";
  gameContainer.style.display = "flex";

  ScreenController(game);
}

startGameBtn.addEventListener("click", startGame);

ScreenController();
