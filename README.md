# Sudoku

Link to deployed game website:
https://cocopuffff.github.io/Sudoku/

## Background information

According to Wikipedia, Sudoku is a logic based number placement puzzle. The objective of the game is to fill the 9 x 9 grid puzzle so that each row, column and 3 x 3 subgrids that composes the grid contains unique digits from 1 to 9. The game board is partially filled with numbers from the start and only has one solution.

More information: https://en.wikipedia.org/wiki/Sudoku

I have implemented a slightly modified version of the Sudoku game with lives as another consideration for players. Every new game starts the player out with 3 lives. Lives are deducted when the player fills the cell with the wrong digit. The player can also expend a life to get a hint for a cell of interest. This hint will show the player the list of possible digits for the cell based on the digits shown on the board currently. The player loses the game if his / her lives reaches zero.

## Features

- Lives mechanism
- Time tracking
- Toggle answer / add notes mode
- Retry puzzle on lose
- Share puzzle on win & lose, load shared puzzle using URI parameter
- Responsive web design (mobile-optimised)

## Screenshot(s) of game:

### Difficulty menu

![Choose difficulty on load](./screenshots/1_choose_difficulty.png?raw=true "Difficulty menu")

### In-game functionalities

![Toggle add notes mode](./screenshots/2_toggle_add_notes.png?raw=true "Add notes mode")
![Live deducted on wrong move](./screenshots/3_lives_mechanic.png?raw=true "Lives mechanic")
![Clicking on hint button actives an event listener for the next cell that I click on](./screenshots/4_click_hint_button.png?raw=true "Click hint button")
![Clicked on cell after toggling hint](./screenshots/5_hint_on_e4.png?raw=true "Hint generated candidate numbers for cell e4")

# Share link functionality and win-lose modals

![Includes link sharing, retry game and start new game functionality](./screenshots/6_lose_share.png?raw=true "Lose game modal")
![Game includes a board game decoder using URI component parameters on load](./screenshots/7_load_game_using_share_link.png?raw=true "Load shared game")
![Includes link sharing and start new game functionality](./screenshots/8_win.png?raw=true "Win game modal")
![Gives user an option to start new game and show difficulty menu](./screenshots/9_start_over_modal.png?raw=true "Click start over game")

## Technologies Used:

- HTML
- CSS with Bootstrap
- Javascript

## Getting Started:

This game uses toggle buttons in the top right corner of the window to modify how the digits are input into empty cells. Selecting Answer causes input cells to be evaluated when it loses focus (when the player clicks elsewhere) and if input cell is not empty. Selecting Add notes allows the player to add / remove notes dynamically if he / she enters 1 - 9 digits.

For example, the user starts a new game and tries to add notes to the empty cell a1. Typing "2", "4" and "5" in the input cell adds it to the notes in real time. If the user was to remove "2" from his notes, typing "2" again removes it.

## Next Steps:

I would like to add a "challenge of the day" feature where every player gets the same puzzle and the game displays a leaderboard of players who solved the puzzle the most quickly.

## Attributions:

- ChatGPT: recursive filling of board puzzle, pulse animation on lives = 1, sharing of current Board with other friends in URI
- Create timer functionality: https://www.educative.io/answers/how-to-create-a-stopwatch-in-javascript
- Create copy to clipboard button: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
- Style copy to clipboard button within input area: https://stackoverflow.com/questions/15314407/how-to-add-button-inside-an-input
- Style title and button group: https://stackoverflow.com/questions/33444666/how-to-center-align-one-flex-item-and-right-align-another-using-flexbox
- Check & uncheck radio button by javascript: https://bobbyhadz.com/blog/javascript-set-radio-to-checked-unchecked#:~:text=To%20set%20a%20radio%20button,same%20name%20attribute%20become%20unchecked.
