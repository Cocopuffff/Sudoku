/* Section: Generate Sudoku Board */
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
  for (const cell of cells) {
    if (boardState[cell] !== null) {
      check3x3Result.usedNumbers.push(boardState[cell]);
    }
  }
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
  console.log("New board:");
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

// Fill the grid with recursive algorithm
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

function updateDisplayWithSystemBoard() {
  for (const cell of Object.keys(board)) {
    const id = `#${cell}`;
    document.querySelector(id).innerText = board[cell];
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

function updateUserBoardByDifficulty(
  userBoard,
  countOfNumbersToReveal,
  minNumbersToRevealPerSquare,
  squareMap,
  sameLevel = false
) {
  if (!sameLevel) {
    let squareMapOfCellsToReveal = structuredClone(squareMap);
    const arrOfNumberOfCellsToRevealInSquares =
      randomiseNoOfCellsToRevealInEachSquare(
        minNumbersToRevealPerSquare,
        countOfNumbersToReveal
      );

    squareMapOfCellsToReveal = removeCellsToRevealRandomly(
      squareMapOfCellsToReveal,
      arrOfNumberOfCellsToRevealInSquares
    );

    listOfCellsToReveal = concatCellsToReveal(squareMapOfCellsToReveal);
  }

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

function updateUserBoard(
  systemBoard,
  userBoard,
  squareMap,
  difficulty = "demo",
  sameLevel = false
) {
  const [valid, countOfNumbersToReveal, minNumbersToRevealPerSquare] =
    SetDifficulty(difficulty);
  updateUserBoardByDifficulty(
    userBoard,
    countOfNumbersToReveal,
    minNumbersToRevealPerSquare,
    squareMap,
    sameLevel
  );
  highlightEmptyCells();
}

function highlightEmptyCells() {
  const emptyCellInputs = document.querySelectorAll(".board-input");
  for (const cellInput of emptyCellInputs) {
    cellInput.classList.add("active");
  }
}

function displayBoardTemplate(userBoard) {
  // For development only
  // const systemBoard = document.querySelector("#system-board");
  // for (const [key, value] of Object.entries(squareMap)) {
  //   const square3x3 = document.createElement("div");
  //   square3x3.id = key;
  //   square3x3.classList.add("square");
  //   for (const cell of value) {
  //     const displayCell = document.createElement("div");
  //     displayCell.id = cell;
  //     displayCell.classList.add("cell");
  //     square3x3.appendChild(displayCell);
  //   }
  //   systemBoard.appendChild(square3x3);
  // }
  // updateDisplayWithSystemBoard();

  // For actual production
  const displayBoard = document.querySelector("#board");
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
    displayBoard.appendChild(square3x3);
  }

  const boardInputs = document.querySelectorAll(".board-input");
  for (const input of boardInputs) {
    input.addEventListener("focusin", clearInput);
    input.addEventListener("input", validateInput);
    input.addEventListener("focusout", evaluateCell);
  }
}

function clearInput(event) {
  event.target.value = "";
}

function validateInput(event) {
  // const acceptedValues = "123456789".split("").map((x) => +x);
  const acceptedValues = "123456789";
  let inputValue = event.target.value;
  if (inputValue.length === 1 && acceptedValues.includes(inputValue)) {
    return;
  } else {
    if (acceptedValues.includes(inputValue.at(-1))) {
      event.target.value = inputValue.at(-1);
    } else {
      event.target.value = "";
    }
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
    userBoard[cellId].choice = e.target.value.toString();

    // check win condition
    if (checkWin(userBoard)) {
      // confetti modal, displaying lives left, time taken, share results, share same puzzle
      stopStopwatch();
      document.querySelector("#difficultySelected").innerText =
        difficultySelected;
      winGame.show();
      document.querySelector(".winModalStopwatch").innerHTML =
        stopwatch.innerHTML;
      const winModal = document.querySelector("#winModal");
      winModal.addEventListener("click", handleWinGameModalClick);
    }
  } else {
    e.target.style.backgroundColor = "var(--cell-wrong-colour)";
    lives--;

    const livesDisplay = document.querySelector(".lives span");
    livesDisplay.innerText = lives;
    document.querySelector("#winModal .lives strong").innerText = lives;
    if (lives === 1) {
      livesDisplay.classList.toggle("warning");
    }
    // check lose condition
    if (lives === 0) {
      stopStopwatch();
      livesDisplay.classList.toggle("warning");
      // Lose modal with try again button to retry same level or start over
      loseGame.show();
      const loseModal = document.querySelector("#loseModal");
      loseModal.addEventListener("click", handleLoseModalClick);
    }
  }
}

function checkWin(userBoard) {
  return Object.values(userBoard).every((cell) => cell.choice !== null);
}

/* Section: Choose and handle difficulty setting */

// Updates userBoard, hides modal and starts stopwatch
function handleDifficultyButtonsClick(event) {
  if (event.target.classList.contains("difficulty")) {
    difficultySelected = event.target.id;
    updateUserBoard(board, userBoard, squareMap, difficultySelected);
    logBoardState(board);
    startStopwatch();
    chooseDifficulty.hide();
  }
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

function showDifficulty(event) {
  const chooseDifficultyEl = document.querySelector("#chooseDifficulty");
  chooseDifficultyEl.addEventListener("click", handleDifficultyButtonsClick);
  chooseDifficulty.show();
}

/* Section: Start over */

function tryAgain(newLevel = true) {
  // Resassign board data structure to original generated data structure. Reset variable values.
  lives = 3;
  document.querySelector(".lives span").innerText = lives;
  // document.querySelector("#system-board").innerHTML = "";
  document.querySelector("#board").innerHTML = "";
  document.querySelector("#message").innerText = "";
  resetStopwatch();
  if (newLevel) {
    [board, squareMap] = initialiseBoard();
    userBoard = createUserBoardDataStructure();
    cellsList = Object.keys(board);
    fillBoard(board, cellsList, []);
  } else {
    // reset userBoard based on if shownAtStart = false, choice = null;
    for (const cell of Object.keys(userBoard)) {
      if (!userBoard[cell].shownAtStart) {
        userBoard[cell].choice = null;
      }
    }
  }

  logBoardState(board);
  displayBoardTemplate(userBoard);
  if (newLevel) {
    showDifficulty();
  } else {
    updateUserBoard(board, userBoard, squareMap, difficultySelected, true);
    startStopwatch();
  }
}

function handleStartOverModalClick(event) {
  const startOverResult = event.target.classList;
  if (startOverResult.contains("no")) {
    startOver.hide();
    return;
  } else if (startOverResult.contains("tryAgain")) {
    stopStopwatch();
    startOver.hide();
    tryAgain();
  }
}

function handleStartOverClick() {
  const startOverEl = document.querySelector("#startOverModal");
  startOverEl.addEventListener("click", handleStartOverModalClick);
  startOver.show();
}

function handleWinGameModalClick(event) {
  if (event.target.id === "tryAgain") {
    winGame.hide();
    tryAgain();
  } else if (event.target.id === "share") {
    // Share puzzle link or trigger print browser as PDF
    console.log("You real social bro!");
  }
}

function handleLoseModalClick(event) {
  if (event.target.id === "retryBoard") {
    loseGame.hide();
    tryAgain(false);
  } else if (event.target.id === "tryNewPuzzle") {
    loseGame.hide();
    tryAgain();
  }
}

function changeUserBoardDataStructureToSystemBoardDataStructure(
  systemBoard,
  userBoard
) {
  const newBoard = {};
  for (const cell of Object.keys(userBoard)) {
    newBoard[cell] = userBoard[cell].choice;
  }
  return newBoard;
}

function renderCandidateNumbersOnCell(cell, candidateNumbersArr) {
  if (candidateNumbersArr.length === 0) {
    return;
  }
  const cellDOM = document.querySelector(`#${cell}`);

  for (const child of cellDOM.childNodes) {
    if (child.tagName !== "INPUT") {
      cellDOM.removeChild(child);
    }
  }
  const candidateNumbersHolder = document.createElement("div");
  candidateNumbersHolder.classList.add("candidate-number-holder");
  cellDOM.appendChild(candidateNumbersHolder);
  for (const number of candidateNumbersArr) {
    const candidateNumberDiv = document.createElement("div");
    candidateNumberDiv.classList.add("candidate-number");
    candidateNumberDiv.innerText = number;
    candidateNumbersHolder.appendChild(candidateNumberDiv);
  }
  candidateNumbersHolder.addEventListener("click", (event) => {
    if (candidateNumbersHolder.previousSibling.tagName === "INPUT") {
      candidateNumbersHolder.previousSibling.focus();
    }
  });
}

function handleHintSelectCell(event) {
  const displayBoard = document.querySelector("#board");
  displayBoard.removeEventListener("click", handleHintClick);
  displayBoard.removeEventListener("click", handleHintSelectCell);
  hintbutton.classList.toggle("hint-on");
  lives--;
  const livesDisplay = document.querySelector(".lives span");
  livesDisplay.innerText = lives;
  if (event.target.classList.contains("board-input")) {
    const selectedCell = event.target.parentNode.id;
    const currentBoard = changeUserBoardDataStructureToSystemBoardDataStructure(
      board,
      userBoard
    );
    const candidateNumbersArr = getCandidateNumbersForCell(
      selectedCell,
      currentBoard,
      squareMap
    );
    renderCandidateNumbersOnCell(selectedCell, candidateNumbersArr);
  }
}

function handleHintClick() {
  const message = document.querySelector("#message");
  if (lives <= 1) {
    message.innerText = "Not enough lives left to get more hints!";
    return;
  }

  hintbutton.classList.toggle("hint-on");
  const displayBoard = document.querySelector("#board");
  displayBoard.addEventListener("click", handleHintSelectCell);
}

/* Section: Stopwatch */

const stopwatch = document.querySelector(".stopwatch");
let startTime, stopwatchInterval;

function pad(number) {
  // adds a leading zero if number is less than 10
  return (number < 10 ? "0" : "") + number;
}

function startStopwatch() {
  // startTime is represented in milliseconds
  startTime = new Date().getTime();
  stopwatchInterval = setInterval(updateStopwatch, 1000);
}

function updateStopwatch() {
  // currentTime is represented in milliseconds
  let currentTime = new Date().getTime();
  let elapsedTime = currentTime - startTime;
  let seconds = Math.floor(elapsedTime / 1000) % 60;
  let minutes = Math.floor(elapsedTime / 1000 / 60) % 60;
  let hours = Math.floor(elapsedTime / 1000 / 60 / 60);
  let displayTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  stopwatch.innerHTML = displayTime;
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  startTime = null;
  stopwatchInterval = null;
  document.querySelector(".winModalStopwatch").innerHTML = stopwatch.innerHTML;
}

function resetStopwatch() {
  stopwatch.innerHTML = "00:00:00";
  document.querySelector(".winModalStopwatch").innerHTML = stopwatch.innerHTML;
}

/* Section: function calls to get game rolling */

let [board, squareMap] = initialiseBoard();
let userBoard = createUserBoardDataStructure();
// board = { cell: null },
// squareMap = { square11 = [a1, a2, a3, ... ] , ...,  square33 = []}, moves = [];
// userBoard = {a1: { shownAtStart: false, choice: null, userNotes:[] }}
let cellsList = Object.keys(board);
let lives = 3;
let difficultySelected, listOfCellsToReveal;
const chooseDifficulty = new bootstrap.Modal("#chooseDifficulty");
const startOver = new bootstrap.Modal("#startOverModal");
const winGame = new bootstrap.Modal("#winModal");
const loseGame = new bootstrap.Modal("#loseModal");

fillBoard(board, cellsList, []);
logBoardState(board);
displayBoardTemplate(userBoard);
const startOverButton = document.querySelector("#startOver");
startOverButton.addEventListener("click", handleStartOverClick);
const hintbutton = document.querySelector("#hint");
hintbutton.addEventListener("click", handleHintClick);
window.addEventListener("load", showDifficulty);
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

//https://www.educative.io/answers/how-to-create-a-stopwatch-in-javascript
// ChatGPT: recursive filling of board puzzle, pulse animation on lives = 1
