function initialiseBoard() {
  const board = {};
  const rows = "abcdefghi";
  const cols = "123456789";

  const square11 = [],
    square12 = [],
    square13 = [],
    square21 = [],
    square22 = [],
    square23 = [],
    square31 = [],
    square32 = [],
    square33 = [];
  const squareMap = {
    square11,
    square12,
    square13,
    square21,
    square22,
    square23,
    square31,
    square32,
    square33,
  };

  for (let row = 1; row <= rows.length; row++) {
    for (let col = 1; col <= cols.length; col++) {
      // update board structure
      const cell = rows.split("")[row - 1] + cols.split("")[col - 1];
      board[cell] = null;

      // update squareMap structure where square11 represents top left 3x3 cells and square33 represents btm right 3x3
      const squareName = "square" + Math.ceil(row / 3) + Math.ceil(col / 3);
      let key = rows[row - 1] + col;

      if (squareMap[squareName]) {
        squareMap[squareName].push(key);
      }
    }
  }

  const userMoves = [];
  return { board, squareMap, userMoves };
}

function createUserBoardDataStructure() {
  const userBoard = {};
  const rows = "abcdefghi";
  const cols = "123456789";

  for (const row of rows) {
    for (const col of cols) {
      const cell = row + col;
      userBoard[cell] = {
        shownAtStart: false,
        choice: null,
        userNote: [],
      };
    }
  }
  return userBoard;
}

// Iterate through boardState's cellRow to get numbers and check whether all numbers are unique and 1 - 9;
function checkRow(cell, boardState) {
  const validNumbers = Array.from("123456789");
  const cellRow = cell[0];
  const boardCells = Object.keys(boardState);
  const boardNumbers = Object.values(boardState);
  const checkRowResult = { isValid: false, usedNumbers: [] };

  for (let i = 0; i < boardCells.length; i++) {
    if (boardCells[i][0] === cellRow && boardNumbers[i] !== null) {
      checkRowResult.usedNumbers.push(Object.values(boardState)[i]);
    }
  }
  // console.log(checkRowResult.usedNumbers);
  for (const number of checkRowResult.usedNumbers) {
    if (
      checkRowResult.usedNumbers.indexOf(number) !==
        checkRowResult.usedNumbers.lastIndexOf(number) ||
      !validNumbers.includes(number)
    ) {
      return checkRowResult;
    }
  }
  checkRowResult.isValid = true;
  return checkRowResult;
}

// Iterate through boardState's cellCol to get numbers and check whether all numbers are unique and 1 - 9;
function checkCol(cell, boardState) {
  const validNumbers = Array.from("123456789");
  const cellCol = cell[1];
  const boardCells = Object.keys(boardState);
  const boardNumbers = Object.values(boardState);
  const checkColResult = { isValid: false, usedNumbers: [] };

  for (let i = 0; i < boardCells.length; i++) {
    if (boardCells[i][1] === cellCol && boardNumbers[i] !== null) {
      checkColResult.usedNumbers.push(Object.values(boardState)[i]);
    }
  }
  // console.log(checkColResult.usedNumbers);
  for (const number of checkColResult.usedNumbers) {
    if (
      checkColResult.usedNumbers.indexOf(number) !==
        checkColResult.usedNumbers.lastIndexOf(number) ||
      !validNumbers.includes(number)
    ) {
      return checkColResult;
    }
  }
  checkColResult.isValid = true;
  return checkColResult;
}

// Iterate through boardState's 3 x 3 square which holds cell position, to get numbers and check whether all numbers are unique and 1 - 9;
function check3x3(cell, boardState, squareMap) {
  const rows = "abcdefghi";
  const validNumbers = Array.from("123456789");
  let cells = [];
  const check3x3Result = { isValid: false, usedNumbers: [] };
  for (const [square, squareCells] of Object.entries(squareMap)) {
    if (squareCells.includes(cell)) {
      cells = [...Object.values(squareMap[square])];
      break;
    }
  }
  // console.log(cells);
  for (const cell of cells) {
    // console.log(cell);
    // console.log(Object.keys(boardState));
    // console.log(boardState[cell]);
    if (boardState[cell] !== null) {
      check3x3Result.usedNumbers.push(boardState[cell]);
    }
  }
  // console.log(check3x3Result.usedNumbers);
  for (const number of check3x3Result.usedNumbers) {
    if (
      check3x3Result.usedNumbers.indexOf(number) !==
        check3x3Result.usedNumbers.lastIndexOf(number) ||
      !validNumbers.includes(number)
    ) {
      return check3x3Result;
    }
  }
  check3x3Result.isValid = true;
  return check3x3Result;
}

// Check cell against row, column and 3x3 square logic. Returns an array of candidate numbers.
function getCandidateNumbersForCell(cell, boardState, squareMap) {
  let candidateNumbers = Array.from("123456789");
  const checkRowResult = checkRow(cell, boardState);
  let checkColResult, check3x3Result;
  if (checkRowResult.isValid) {
    checkColResult = checkCol(cell, boardState);
  } else {
    candidateNumbers = [];
  }

  if (checkColResult.isValid) {
    check3x3Result = check3x3(cell, boardState, squareMap);
  } else {
    candidateNumbers = [];
  }
  const uniqueUsedNumbers = [
    ...new Set(
      checkRowResult.usedNumbers.concat(
        checkColResult.usedNumbers,
        check3x3Result.usedNumbers
      )
    ),
  ];

  for (const usedNumber of uniqueUsedNumbers) {
    candidateNumbers = candidateNumbers.filter(
      (candidateNumber) => candidateNumber !== usedNumber
    );
  }

  return candidateNumbers;
}

// Shuffle array using Fisher-Yates suffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Log board in console
function logBoardState(boardState) {
  let lastBoardState = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null)
  );
  const boardNumbersList = [...Object.values(boardState)];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      lastBoardState[i][j] = boardNumbersList.shift();
    }
    console.log(lastBoardState[i]);
  }
}

// Fill the grid with recursive algorithm / backtracking algorithm
function fillBoard(boardState, emptyCellsQueue, filledCellsArray) {
  if (emptyCellsQueue.length === 0) {
    return true;
  }

  const nextEmptyCell = emptyCellsQueue[0];
  let candidateNumbers = getCandidateNumbersForCell(
    nextEmptyCell,
    boardState,
    squareMap
  );
  candidateNumbers = shuffleArray(candidateNumbers);
  if (candidateNumbers.length === 0 || candidateNumbers === null) {
    return false;
  }

  for (const number of candidateNumbers) {
    boardState[nextEmptyCell] = number;
    emptyCellsQueue.shift();
    filledCellsArray.push(nextEmptyCell);

    if (fillBoard(boardState, emptyCellsQueue, filledCellsArray)) {
      return true;
    }
    // console.log(`Before backtracking:`);
    // console.log(`nextEmptyCell: ${nextEmptyCell}, boardState[nextEmptyCell]: ${boardState[nextEmptyCell]}`);
    // console.log(`emptyCellsQueue: ${emptyCellsQueue}, length: ${emptyCellsQueue.length}`);
    // console.log(`filledCellsArray: ${filledCellsArray}, length: ${filledCellsArray.length}`);

    emptyCellsQueue.unshift(nextEmptyCell);
    boardState[nextEmptyCell] = null;
    filledCellsArray.pop();

    // console.log(`After backtracking:`);
    // console.log(`nextEmptyCell: ${nextEmptyCell}, boardState[nextEmptyCell]: ${boardState[nextEmptyCell]}`);
    // console.log(`emptyCellsQueue: ${emptyCellsQueue}, length: ${emptyCellsQueue.length}`);
    // console.log(`filledCellsArray: ${filledCellsArray}, length: ${filledCellsArray.length}`);
  }

  // Backtrack further because algorithm is not able to fill next cell based on rules
  return false;
}

function gameOver() {
  // overlay game over, time taken, number of lives left
  // create 1. try again button to restart same challenge and 2. new challenge button to change difficulty and reshuffle board

  if (clickTryAgain) {
    resetLevel();
    tryAgain();
  } else if (clickNewChallenge) {
    resetLevel();
    // create difficulty buttons and event listener to choose difficulty
    // on click, generateLevel
    generateLevel(difficulty);
  }
}

function resetLevel() {
  // reset data structures
  // reset lives
  // reset timer
}

function tryAgain() {
  // resassign board data structure to original generated data structure;
}

function SetDifficulty(difficulty) {
  let valid = false;
  let countOfNumbersToReveal = 9;
  let minNumbersToRevealPerSquare = 1;
  switch (difficulty) {
    case "demo":
      countOfNumbersToReveal = 78;
      minNumbersToRevealPerSquare = 6;
      valid = true;
      break;
    case "easy":
      // reveal many numbers
      countOfNumbersToReveal = 63;
      minNumbersToRevealPerSquare = 5;
      valid = true;
      break;
    case "medium":
      // reveal some numbers
      countOfNumbersToReveal = 54;
      minNumbersToRevealPerSquare = 4;
      valid = true;
      break;
    case "hard":
      // reveal little numbers
      countOfNumbersToReveal = 45;
      minNumbersToRevealPerSquare = 3;
      valid = true;
      break;
    default:
      break;
  }

  return { valid, countOfNumbersToReveal, minNumbersToRevealPerSquare };
}

function UpdateMove(boardPosition) {}

// function calls
const { board: board, squareMap, moves } = initialiseBoard(); // board = { cell: null }, squareMap = { square11 = [a1, a2, a3, ... ] , ...,  square33 = []}, moves = [];

const userBoard = createUserBoardDataStructure();
const cellsList = Object.keys(board);
fillBoard(board, cellsList, []);
updateUserBoard(board, userBoard, "demo");
logBoardState(board);
displayBoardTemplate(userBoard);

function updateUserBoard(systemBoard, userBoard, difficulty = "demo") {
  const { difficulty: countOfNumbersToReveal, minNumbersToRevealPerSquare } =
    SetDifficulty(difficulty);
  const populatedUserBoard = updateUserBoardBySystemBoard(
    systemBoard,
    userBoard
  );
  const hiddenUserBoard = updateUserBoardByDifficulty(
    populatedUserBoard,
    countOfNumbersToReveal,
    minNumbersToRevealPerSquare
  );
}

function updateDisplayWithSystemBoard() {
  for (const cell of Object.keys(board)) {
    const id = `#${cell}`;
    document.querySelector(id).innerText = board[cell];
  }
}

function updateUserBoardBySystemBoard(systemBoard, userBoard) {
  // loop through system board kvp to find userBoard
  for (const [cell, number] of Object.entries(systemBoard)) {
    console.log(`cell: ${cell}, number: ${number}`);
    userBoard[cell].choice = number;
  }
  return userBoard;
}

function updateUserBoardByDifficulty(
  userBoard,
  countOfNumbersToReveal,
  minNumbersToRevealPerSquare
) {
  // Iterate through the userBoard.cell
  // grey out numbers that are userBoard.cell.shownAtStart = true
  return;
}

function updateDisplayWithUserBoard() {}
function displayBoardTemplate(userBoard) {
  // For development only
  const systemBoard = document.querySelector("#system-board");
  for (const [key, value] of Object.entries(squareMap)) {
    const square3x3 = document.createElement("div");
    square3x3.id = key;
    square3x3.classList.add("square");
    for (const cell of value) {
      const displayCell = document.createElement("div");
      displayCell.id = cell;
      displayCell.classList.add("cell");
      square3x3.appendChild(displayCell);
    }
    systemBoard.appendChild(square3x3);
  }
  updateDisplayWithSystemBoard();

  // For actual production
  const board = document.querySelector("#board");
  for (const [key, value] of Object.entries(squareMap)) {
    const square3x3 = document.createElement("div");
    square3x3.id = key;
    square3x3.classList.add("square");
    for (const cell of value) {
      const displayCell = document.createElement("div");
      displayCell.id = cell;
      displayCell.classList.add("cell");
      square3x3.appendChild(displayCell);
    }
    board.appendChild(square3x3);
  }
  updateUserBoard(board, userBoard, "demo");
}

// code timer
const sec = document.querySelector("#seconds");
const minute = document.querySelector("#minutes");
const hour = document.querySelector("#hours");
let totalSeconds = 0;

function updateTime() {
  // totalSeconds++;
  // 100 seconds
  const seconds = totalSeconds / 60 / 60;
  const minutes = Math.floor(totalSeconds / 60);
}