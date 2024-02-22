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
  return [board, squareMap];
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

    emptyCellsQueue.unshift(nextEmptyCell);
    boardState[nextEmptyCell] = null;
    filledCellsArray.pop();
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
  [board, squareMap] = initialiseBoard();
  cellsList = Object.keys(board);
  console.log(board);
  userBoard = createUserBoardDataStructure();

  document.querySelector("#system-board").innerHTML = "";
  document.querySelector("#board").innerHTML = "";
  fillBoard(board, cellsList, []);
  // logBoardState(board);
  displayBoardTemplate(userBoard);
  console.log(userBoard);
  showDifficulty();
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
    case "beginner":
      // reveal some numbers
      countOfNumbersToReveal = 54;
      minNumbersToRevealPerSquare = 4;
      valid = true;
      break;
    case "novice":
      // reveal little numbers
      countOfNumbersToReveal = 45;
      minNumbersToRevealPerSquare = 3;
      valid = true;
      break;
    case "advanced":
      // reveal very little numbers
      countOfNumbersToReveal = 36;
      minNumbersToRevealPerSquare = 2;
      valid = true;
      break;
    case "master":
      // reveal very little numbers
      countOfNumbersToReveal = 27;
      minNumbersToRevealPerSquare = 1;
      valid = true;
      break;
    case "insane":
      // reveal very little numbers
      countOfNumbersToReveal = 5;
      minNumbersToRevealPerSquare = 0;
      valid = true;
      break;
    default:
      break;
  }
  return [valid, countOfNumbersToReveal, minNumbersToRevealPerSquare];
}

function UpdateMove(boardPosition) {}

function updateUserBoard(
  systemBoard,
  userBoard,
  squareMap,
  difficulty = "demo"
) {
  console.log(userBoard);
  const [valid, countOfNumbersToReveal, minNumbersToRevealPerSquare] =
    SetDifficulty(difficulty);
  console.log(`countOfNumbersToReveal: ${countOfNumbersToReveal}`);
  console.log(`minNumbersToRevealPerSquare: ${minNumbersToRevealPerSquare}`);
  updateUserBoardByDifficulty(
    userBoard,
    countOfNumbersToReveal,
    minNumbersToRevealPerSquare,
    squareMap
  );
  highlightEmptyCells();
}

function updateDisplayWithSystemBoard() {
  for (const cell of Object.keys(board)) {
    const id = `#${cell}`;
    document.querySelector(id).innerText = board[cell];
  }
}

function updateUserBoardByDifficulty(
  userBoard,
  countOfNumbersToReveal,
  minNumbersToRevealPerSquare,
  squareMap
) {
  let squareMapOfCellsToReveal = structuredClone(squareMap);
  const arrOfNumberOfCellsToRevealInSquares =
    randomiseNoOfCellsToRevealInEachSquare(
      minNumbersToRevealPerSquare,
      countOfNumbersToReveal
    );
  console.log(arrOfNumberOfCellsToRevealInSquares);

  squareMapOfCellsToReveal = removeCellsToRevealRandomly(
    squareMapOfCellsToReveal,
    arrOfNumberOfCellsToRevealInSquares
  );

  const listOfCellsToReveal = concatCellsToReveal(squareMapOfCellsToReveal);

  for (const cell of listOfCellsToReveal) {
    if (cell in userBoard) {
      userBoard[cell].choice = board[cell];
      userBoard[cell].shownAtStart = true;
      document.querySelector(`#board .square #${cell}`).innerHTML =
        userBoard[cell].choice;
    }
  }

  return userBoard;
}

function highlightEmptyCells() {
  const emptyCellInputs = document.querySelectorAll(".board-input");
  for (const cellInput of emptyCellInputs) {
    cellInput.classList.add("active");
  }
}

// Start with a 2D array of minNumbersToRevealPerSquare, then add cells to show to squares randomly until we reach countOfNumbersToReveal
function randomiseNoOfCellsToRevealInEachSquare(
  minNumbersToRevealPerSquare,
  countOfNumbersToReveal
) {
  const arrOfNumberOfCellsToRevealInSquares = Array.from(
    { length: 9 },
    (x) => (x = minNumbersToRevealPerSquare)
  );
  let countOfNumbersRevealed =
    arrOfNumberOfCellsToRevealInSquares.length * minNumbersToRevealPerSquare;

  while (countOfNumbersRevealed < countOfNumbersToReveal) {
    i = Math.floor(Math.random() * 9);
    if (arrOfNumberOfCellsToRevealInSquares[i] !== 9) {
      arrOfNumberOfCellsToRevealInSquares[i]++;
      countOfNumbersRevealed++;
    }
  }
  return arrOfNumberOfCellsToRevealInSquares;
}

// Iterate through squareMapOfCellsToReveal to shuffle and remove cells according to pre-determined number of cells to show
function removeCellsToRevealRandomly(
  squareMapOfCellsToReveal,
  arrOfNumberOfCellsToRevealInSquares
) {
  let iteratorIndex = 0;
  for (let [square, cellsToReveal] of Object.entries(
    squareMapOfCellsToReveal
  )) {
    squareMapOfCellsToReveal[square] = shuffleArray(cellsToReveal);
    while (
      squareMapOfCellsToReveal[square].length >
      arrOfNumberOfCellsToRevealInSquares[iteratorIndex]
    ) {
      squareMapOfCellsToReveal[square].pop();
    }
    iteratorIndex++;
  }
  return squareMapOfCellsToReveal;
}

function concatCellsToReveal(squareMapOfCellsToReveal) {
  let result = [];
  for (const cell of Object.values(squareMapOfCellsToReveal)) {
    result = result.concat(cell);
  }
  return result;
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
      displayCell.innerHTML = `<input type="number" min="1" max="9" step="1" class="board-input">`;
      square3x3.appendChild(displayCell);
    }
    board.appendChild(square3x3);
  }

  const boardInputs = document.querySelectorAll(".board-input");
  for (const input of boardInputs) {
    input.addEventListener("focusout", evaluateCell);
  }
}

function evaluateCell(e) {
  const cellHTML = e.target.parentNode;
  const cellId = e.target.parentNode.id;
  if (e.target.value === undefined || e.target.value.length === 0) {
    return;
  }

  if (e.target.value === board[cellId]) {
    cellHTML.innerHTML = e.target.value;
    cellHTML.style.backgroundColor = "var(--cell-right-colour)";
    // check win condition
  } else {
    e.target.style.backgroundColor = "var(--cell-wrong-colour)";
    lives--;
    if (lives === 0) {
      console.log("You died");
    }
    document.querySelector(".lives span").innerText = lives;
    // check lose condition
  }
}

function showDifficulty(event) {
  const chooseDifficulty = new bootstrap.Modal("#chooseDifficulty");
  const chooseDifficultyEl = document.querySelector("#chooseDifficulty");
  chooseDifficultyEl.addEventListener("click", (event) => {
    if (event.target.classList.contains("difficulty")) {
      const difficultySelected = event.target.id;
      console.log(board);
      console.log(userBoard);
      console.log(squareMap);
      console.log(difficultySelected);
      updateUserBoard(board, userBoard, squareMap, difficultySelected);
      chooseDifficulty.hide();
    }
  });
  chooseDifficulty.show();
}

function startOverQuestion() {
  console.log("clicked");
  const startOver = new bootstrap.Modal("#startOverModal");
  const startOverEl = document.querySelector("#startOverModal");
  startOverEl.addEventListener("click", (event) => {
    const startOverResult = event.target.id;
    if (startOverResult === "no") {
      return;
    } else if (startOverResult === "yes") {
      startOver.hide();
      tryAgain();
    }
  });
  startOver.show();
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

// function calls
// const modal = new bootstrap.Modal('')
window.addEventListener("load", showDifficulty); // toggle chooseDifficulty model
let [board, squareMap] = initialiseBoard(); // board = { cell: null }, squareMap = { square11 = [a1, a2, a3, ... ] , ...,  square33 = []}, moves = [];

let userBoard = createUserBoardDataStructure();
let cellsList = Object.keys(board);
let lives = 3;
fillBoard(board, cellsList, []);
logBoardState(board);
displayBoardTemplate(userBoard);
const startOverButton = document.querySelector("#startOver");
startOverButton.addEventListener("click", startOverQuestion);
