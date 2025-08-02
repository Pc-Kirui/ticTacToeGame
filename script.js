"use strict";

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
  const board = Gameboard();

  const players = [
    { name: playerOneName, mark: "X" },
    {
      name: playerTwoName,
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

  const getActivePlayer = () => activePlayer;

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
      const [cell1Coords, cell2Coords, cell3Coords] = combo;

      const cell1 = currentBoard[cell1Coords[0]][cell1Coords[1]];
      const cell2 = currentBoard[cell2Coords[0]][cell2Coords[1]];
      const cell3 = currentBoard[cell3Coords[0]][cell3Coords[1]];

      const val1 = cell1.getValue();
      const val2 = cell2.getValue();
      const val3 = cell3.getValue();

      if (val1 === activeMark && val2 === activeMark && val3 === activeMark) {
        return true;
      }
    }
    return false;
  };

  const checkDraw = () => {
    return movesMade === 9 && !checkWin();
  };

  const playRound = (row, column) => {
    console.log(
      `${getActivePlayer().name} ${
        getActivePlayer().mark
      } attempts to place mark at  row ${row}, column ${column}...`
    );
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
        return;
      }
      if (checkDraw()) {
        board.printBoard();
        console.log(`\nIt's a draw! No more moves possible.`);
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
  return { playRound, getActivePlayer, getBoard: board.getBoard };
}
// const myGame = Gameboard();
const game = GameController();
