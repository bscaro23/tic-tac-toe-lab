//1) Define the required variables used to track the state of the game.

//2) Store cached element references.

//3) Upon loading, the game state should be initialized, and a function should 
//   be called to render this game state.

//4) The state of the game should be rendered to the user.

//5) Define the required constants.

//6) Handle a player clicking a square with a `handleClick` function.

//7) Create Reset functionality.

/*-------------------------------- Constants --------------------------------*/
const messageEl = document.querySelector('#message');
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

let perfectArr = [0, 2, 6, 8]; //Needed for checking for the corners of the board
let difficultyModifier = 0;


/*---------------------------- Variables (state) ----------------------------*/

let board = [];
let turn;
let winner;
let tie;
let playerOScore;
let playerXScore;
let turnCounter = 0;
let winArr = [];
let lossArr = [];
let computerOn = false;
let computerFirst = false;

/*------------------------ Cached Element References ------------------------*/
let squareEls = document.querySelectorAll('.sqr');  
let resetBtnEl = document.querySelector('#reset');
let playerXScoreEl = document.querySelector('#player1');
let playerOScoreEl = document.querySelector('#player2');
let replayBtnEl = document.querySelector('#replay');
let difficultyBtnEl = document.querySelectorAll('.difficulty');

/*-------------------------------- Functions --------------------------------*/



const updateBoard = () => {
    board.forEach((square, Idx) => {
        squareEls[Idx].textContent = square;
    })
}

const updateMessage = () => {
    if (winner === false && tie === false) {
        messageEl.textContent = `It's ${turn}'s turn`;
    }else if (winner === false && tie === true) {
        messageEl.textContent = `It's a Tie!`;
    } else {
        messageEl.textContent = `${winner} has won! Congratulations.`;
    }
}

const updateScore = () => {
    playerOScoreEl.textContent = playerOScore;
    playerXScoreEl.textContent = playerXScore;
}

const handleClick = (event, Idx) => {
    if (board[Idx] !== '') return `Square is already taken`;
    if (winner === true || tie === true) return `Game is over!`;
    placePiece(Idx);
    checkForWinner();
    checkForTie();
    turnCounter += 1;
    if (computerOn){
        difficultyPlay();
    } else {
        switchPlayerTurn();
    }
    render();
}

const placePiece = (index) => {
    if (winner !== false || tie !== false) return;
    board[index] = turn;
}

const render = () => {
    updateBoard();
    updateScore();
    updateMessage();
}

const checkForWinner = () => {
    for (let i = 0; i < winningCombos.length; i++){
        let x = 0;
        let o = 0;
        let empty = 0;
        let Idx; 
        winningCombos[i].forEach((value) => {
            if (board[value] === 'X') x += 1;
            if (board[value] === 'O') o += 1;
            if (board[value] === ''){ // Allows to check if there is a winning combination with one gap, no need for array as there will only be one if true
                empty += 1;
                Idx = value;
            }
        })
        if (x === 3) winner = 'X';
        if (o === 3) winner = 'O';
        if (o === 2 && empty === 1){ // Gets the win index and saves it for later use, array used incase there are multiple choices.
            winArr.push(Idx);
        }
        if (x === 2 && empty === 1){ // Gets the index of possible losses
            lossArr.push(Idx);
        }
    }
}


const checkForTie = () => {
    if (!board.includes('') && winner === false) tie = true;
}

const switchPlayerTurn = () => {
    if (winner === 'X' || winner === '0') { //Stops additional addition to the board following a winner
        return;
    } else if (turn === 'X') {
        turn = 'O';
    } else if (turn === 'O') {
        turn = 'X';
    }
    
}

const init = () => {
    for (let i = 0; i < 9; i++){
        board[i] = '';
    }
    player1Turn = 'X';
    turn = 'X';
    winner = false;
    tie = false;
    playerXScore = 0;
    playerOScore = 0;
    turnCounter = 0;
    winArr = [];
    lossArr = [];
    computerOn = false;
    computerFirst = false;
    render();
}

const replay = () => {
    if (winner === false && tie === false) return; //Stops the game being replayed early.
    for (let i = 0; i < 9; i++){
        board[i] = '';
    }
    if (winner === 'X'){
        playerXScore += 1;
    } else if (winner === 'O'){
        playerOScore += 1;
    }
    winner = false;
    tie = false;
    turnCounter = 0;
    winArr = [];
    lossArr = [];
    perfectArr = [0, 2, 6, 8];
    if (!computerOn){
        if (turn === 'X'){
            turn = 'O';
        } else {
            turn = 'X';
        }
    } else {
        if (!computerFirst){
            computerFirst = true;
        } else {
            computerFirst = false;
        }
        if(computerFirst) difficultyPlay();
    }
    
    render();
    
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

const perfectPlay = () =>{
    let perfectIndex;
    if (turnCounter === 0){//If going first
        perfectIndex = perfectArr[getRandomInt(4)];
    }
    if (turnCounter === 1){
        if (board[4] === ''){
            perfectIndex = 4;
        }else{
            perfectIndex = perfectArr[getRandomInt(4)];
        }
    }

    if (winArr.length !== 0){ //Check if there are any winning indexes
        for (let i = 0; i < winArr.length; i++){
            if (board[winArr[i]] === '') perfectIndex = winArr[i]; 
        }
        winArr = [];
        if (isNaN(perfectIndex)){ //Checks wether any of the winning indexes have since been filled
            if (lossArr.length !== 0){ //Checks if there are any ways to lose and covers them
                for (let i = 0; i < lossArr.length; i++){
                    if (board[lossArr[i]] === '') perfectIndex = lossArr[i];
                }
                lossArr = [];
            }   
        }
    } else if (lossArr.length !== 0){//Checks if there is any way to lose in the event there is no Indexes previously 
        for (let i = 0; i < lossArr.length; i++){
            if (board[lossArr[i]] === '') perfectIndex = lossArr[i];
        }
        lossArr = []; //Make sure to reset the array of indexes each time
    }   

 
    
    if (isNaN(perfectIndex)){
        let i = 4;
        while (board[perfectIndex] !== '') {
            if (perfectArr.length === 0) break;
            const index = getRandomInt(i);
            if (board[perfectArr[index]] === '') perfectIndex = perfectArr[index]; //Ensures there is an index
            perfectArr.splice(index, 1);
        }
    }
    if (isNaN(perfectIndex)){
        for (let i = 0; i < 9; i ++){
            if (board[i] === '') perfectIndex = i; //Ensures ther is an index
        }
    }
    return perfectIndex;
}

const playComputer = (event, Idx) =>{
    difficultyBtnEl.forEach(button => {
        button.disabled = false;
        button.classList.remove('disabled');
    });

    event.target.disabled = true;
    event.target.classList.add('disabled');

    init();
    
    if (turnCounter <= 1) computerOn = true; //As is in a node list the index refers to the number in list the lower down the easier
    difficultyModifier = Idx + 1;

    
    
}

const difficultyPlay = () => {

    if(winner !== false || tie !== false) return; //Stops continued pushing.

    let isPerfect = getRandomInt(difficultyModifier); 

    let compIndex = '';

    if (difficultyModifier === 5){ // If you choose the easiest, it will never choose the perfect position
        let index = perfectPlay();
        let arrPos = []
        board.forEach((square, Idx) => {
            if (square === '' && Idx !== index) arrPos.push(Idx);
        })
        if (arrPos.length !== 0){
            index = arrPos[getRandomInt(arrPos.length)]; //If at all possible swaps the perfect index for another random one
        }
        compIndex = index;
    } else if (isPerfect === 0){ //Chance of perfect play is decreased as index goes up
        compIndex = perfectPlay();
    } else {
        let arrPos = [];
        board.forEach((square, Idx) => {
            if (square === '') arrPos.push(Idx);
        })
        compIndex = arrPos[getRandomInt(arrPos.length)];
    }
    turnCounter += 1;
    board[compIndex] = 'O';
    checkForTie();
    checkForWinner();
}


init();
/*----------------------------- Event Listeners -----------------------------*/


squareEls.forEach((square, Idx) => {
    square.addEventListener('click', (event) => handleClick(event, Idx));
})

resetBtnEl.addEventListener('click', init);

replayBtnEl.addEventListener('click', replay);

difficultyBtnEl.forEach((difficulty, Idx) => {
    difficulty.addEventListener('click', (event) => playComputer(event, Idx));
})



//I added the functionality to play the computer
//Attempted a little bit of CSS but got a bit stuck with the table.