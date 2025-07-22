"use strict";

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

  return { getBoard, placeMark };
}

function Cell() {
  let value = "";

  const addMark = (playerMark) => {
    value = playerMark;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

Gameboard();
