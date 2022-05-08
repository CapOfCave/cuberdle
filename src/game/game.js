import { rotate } from '../cube/cubeOutput';
import { directionsList, EvaluationState } from './constants';
import { addEvaluation, addGuess, fixateFinalGuess, moveToNextGuess, removeGuess } from './moveOutput';
import { getNotation, getObjectFromNotation, inverseDirection, mapDirectionToNumber, mapNumberToDirection } from './utils';

// ##########
// # Config #
// ##########
const GUESS_COUNT = 5;
const GUESS_LENGTH = 5;

/**
 * Adds a new Move to the stack, possibly by combining it with the last one that existed
 * Does NOT check if the lastMoves array overflows! This should be checked elsewhere.
 * 
 * Return an array that indicates if the value was appended or the last element was modified/removed 
 * and the notation of the resulting move (if applicable)
 */
 function addMoveToStack(notation, stack) {
    if (stack.length === 0) {
        stack.push(notation);
        return { status: "appended", notation };
    }

    const newMove = getObjectFromNotation(notation);
    const previousMoveNotation = stack[stack.length - 1];

    const previousMove = getObjectFromNotation(previousMoveNotation);
    if (previousMove.face !== newMove.face) {
        stack.push(notation);
        return { status: "appended", notation };
    }

    const directionValue = mapDirectionToNumber(newMove.direction) + mapDirectionToNumber(previousMove.direction);
    const resultingDirection = mapNumberToDirection(directionValue);

    stack.pop();
    if (resultingDirection === null) {
        return { status: "removed" };
    }

    const resultingMove = getNotation(newMove.face, resultingDirection);

    stack.push(resultingMove);

    return { status: "modified", notation: resultingMove };
}


function initSolution() {
    const solution = []
    while (solution.length < GUESS_LENGTH) {
        const direction = directionsList[Math.floor(Math.random() * 2)];
        const face = Math.floor(Math.random() * 6);
        const notation = getNotation(face, direction)
        addMoveToStack(notation, solution);
    }
    return solution;
}

// ##############
// # GAME STATE #
// ##############

const solution = initSolution();
// const solution = [ "L", "D'", "B", "F'", "D"  ];
// array of ["U", "F'", "D2"...] strings
let lastMoves = []
let gameOver = false;

const previousGuesses = [];
const previousEvaluations = [];

/**
 * Evaluate a guess by returning it's evaluation array (which contains the strings 'correct', 'present', and 'absent')
 * 
 * Guess and solution must look like this: ["U", "F'", "D2"...]
 */
function evaluateGuess(guess, solution) {
    if (guess.length != solution.length) throw new Error("Guess length must be same as solution length");

    // create a map of move -> remaining occurences
    const remainingOccurencesOfMove = {};
    for (let element of solution) {
        if (element in remainingOccurencesOfMove) {
            remainingOccurencesOfMove[element]++;
        } else {
            remainingOccurencesOfMove[element] = 1;
        }
    }

    const result = new Array(solution.length).fill(EvaluationState.ABSENT);

    // Step 1: Get green values
    for (let i = 0; i < solution.length; i++) {
        if (guess[i] === solution[i]) {
            result[i] = EvaluationState.CORRECT
            remainingOccurencesOfMove[guess[i]]--;
        }
    }

    // Step 2: Get yellow values
    for (let i = 0; i < solution.length; i++) {
        if (result[i] !== EvaluationState.ABSENT) continue;

        const guessedMove = guess[i];
        if (remainingOccurencesOfMove[guessedMove] > 0) {
            result[i] = EvaluationState.PRESENT;
            remainingOccurencesOfMove[guess[i]]--;
        }
    }
    return result;
}

function isStackFull() {
    return lastMoves.length >= GUESS_LENGTH
}


export function turn(face, direction) {
    if (gameOver) return;
    if (isStackFull() && face != getObjectFromNotation(lastMoves[lastMoves.length - 1]).face) return;
    const notation = getNotation(face, direction);
    rotate(face, direction);
    const addMoveResponse = addMoveToStack(notation, lastMoves);
    switch ( addMoveResponse.status ) {
        case "appended": 
            addGuess(lastMoves.length - 1, addMoveResponse.notation);
            break;
        case "modified":
            addGuess(lastMoves.length - 1, addMoveResponse.notation);
        case "removed":
            removeGuess(lastMoves.length);
    }

    
}

function revert(moveNotation, skipAnimation = false) {
    const lastMove = getObjectFromNotation(moveNotation);
    const inversedDirection = inverseDirection(lastMove.direction)
    // rotate without adding move to stack
    rotate(lastMove.face, inversedDirection, skipAnimation);
}

export function undo() {
    if (lastMoves.length == 0) return;
    const lastMoveNotation = lastMoves.pop();
    revert(lastMoveNotation);
    removeGuess(lastMoves.length)
}

export function clearGuess() {
    while (lastMoves.length > 0) {
        undo();
    }
}

/**
 * Clear the Cube without affecting the last guess
 */
function clearCube() {
    while (lastMoves.length > 0) {
        revert(lastMoves.pop())
    }
}

function isAllCorrect(evaluations) {
    return evaluations.every(evaluation => evaluation === EvaluationState.CORRECT)
}

export function submit() {
    if (lastMoves.length != GUESS_LENGTH) return;
    previousGuesses.push([...lastMoves]);
    const evaluations = evaluateGuess(lastMoves, solution);
    previousEvaluations.push(evaluations)
    addEvaluation(evaluations)
    if (isAllCorrect(evaluations)) {
        fixateFinalGuess();
        lastMoves = []
        gameOver = true;
        console.log("wow! nice! you won!")
    } else if (previousGuesses.length >= GUESS_COUNT) {
        fixateFinalGuess();
        lastMoves = []
        gameOver = true;
        console.log("oh no. You lost. The solution was", solution);
    } else {
        moveToNextGuess();
        clearCube()
    }
}


function setup() {
    setupGuesses();
    setupCube();
}

function setupCube() {
    [...solution].reverse().forEach(notation => revert(notation, true))
}

function setupGuesses() {
    for (let i = 0; i < GUESS_COUNT; i++) {
        const guessRow = document.createElement('div');
        guessRow.classList.add('guess-row')
        if (i === 0) guessRow.setAttribute('id', 'currentGuess');

        for (let j = 0; j < GUESS_LENGTH; j++) {
            const moveCard = document.createElement('div');
            moveCard.classList.add('move-card')
            moveCard.dataset.state = EvaluationState.EMPTY;
            guessRow.appendChild(moveCard)
        }

        const guessSection = document.getElementById("guessSection")
        guessSection.appendChild(guessRow);
    }
}

export function init() {
    window.addEventListener('load', setup);
}