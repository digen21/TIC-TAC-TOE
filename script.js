let origBoard;
const hPlayer = "O";
const computer = "X";

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn')
// console.log(cells);


startGame();


function startGame () {
    document.getElementById("statusText").style.opacity = "0";
    origBoard = Array.from(Array(9).keys());
    // console.log(origBoard);

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = ""
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);   //adding the event listener
    }
}


function turnClick (e) {

    if (typeof origBoard[e.target.id === 'number']) {
        turn(e.target.id, hPlayer);          //when user clicking calling the turn function
        //cellid, player

        if (!checkWin(origBoard, hPlayer) && !checkTie()) turn(bestSpot(), computer);
    }
}




function turn (cellId, player) {
    origBoard[cellId] = player;                                             //getting the cell Id and storing into player
    document.getElementById(cellId).innerText = player;   //displaying the player in cell id
    let gameWon = checkWin(origBoard, player);              // player = checking certain player has won the game
    if (gameWon) gameOver(gameWon)
}




function checkWin (board, player) {
    let plays = board.reduce((a, e, i) =>      //reducer used to calculate the values inside the array
        (e === player) ? a.concat(i) : a, []);
    //a = accumulator  e = element  i = index       if element == player then storing element into an array

    let gameWon = null;

    for (let [index, win] of winConditions.entries()) {    //looping through the win conditions (entries returns the elements in key(index) and pair(win) values)
        if (win.every(ele => plays.indexOf(ele) > -1)) {    //checking the every conditions inside the win conditions
            //plays = all the places that player played on board  described under wining conditions

            gameWon = { index: index, player: player };
            // console.log(gameWon);
            break;

        }
    }
    return gameWon;
}


//the checkWin() function will return the index in winConditions that player plays
// --> suppose player win --> like 1 - 4 - 7 the index will be 4 and the player who won the game



function gameOver (gameWon) {
    for (let index of winConditions[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == hPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == hPlayer ? "You win!" : "You lose.");
}

// gameOver() function--> 1st for loop change the bgcolor as per the player
//                                     --> 2nd for loop will remove the event listener after game over(no more clicks)


function emptyCell () {
    // console.log(origBoard.filter(s => typeof s == 'number'));   //it will returns the empty cell and the places where computer has put it text
    return origBoard.filter(s => typeof s == 'number');
}

function declareWinner (who) {
    document.querySelector("#statusText").style.opacity = "1";
    document.querySelector("#statusText").innerText = who;
}

function bestSpot () {                          //finds the first cell that is empty by the computer
    // console.log(emptyCell()[0]);        //it will returns the cell id where the computer puts its text
    // return emptyCell()[0];

    // console.log(minimax(origBoard, computer).index);
    return minimax(origBoard, computer).index;

}


//checking the tie status
function checkTie () {
    if (emptyCell().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}



//creating strong tic tac toe using minmax algorithm
function minimax (newBoard, player) {
    var availSpots = emptyCell();

    if (checkWin(newBoard, hPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, computer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == computer) {
            var result = minimax(newBoard, hPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, computer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === computer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove]; //possible best moves by the computer...
}
