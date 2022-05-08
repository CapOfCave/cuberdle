import { rotate } from '../cube/cubeOutput'
import { Direction, directionsList, EvaluationState } from './constants'
import { addEvaluation, addGuess, fixateFinalGuess, moveToNextGuess, removeGuess } from './moveOutput'
import { getNotation, getObjectFromNotation, inverseDirection } from './utils';

const GUESS_COUNT = 5;
const GUESS_LENGTH = 5;

let gameOver = false;

function initSolution() {
    const solution = []
    for (let i = 0; i < GUESS_LENGTH; i++) {
        const direction = directionsList[Math.floor(Math.random() * 2)];
        const face = Math.floor(Math.random() * 6);
        const notation = getNotation(face, direction)
        solution.push(notation);
    }
    return solution;
}

const solution = initSolution();

// array of ["U", "F'", "D2"...] strings
let lastMoves = []

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
        if (remainingOccurencesOfMove[guessedMove] > 0 ) {
            result[i] = EvaluationState.PRESENT;
            remainingOccurencesOfMove[guess[i]]--;
        }
    }
    return result;
}

function isStackFull() {
    return lastMoves.length >= GUESS_LENGTH
}

function addMoveToStack(notation) {
    lastMoves.push(notation);
}

export function turn(face, direction) {
    if (gameOver) return;
    if (isStackFull()) return;
    const notation = getNotation(face, direction);
    rotate(face, direction);
    addMoveToStack(notation);
    addGuess(lastMoves.length - 1, notation);
}

function revert(moveNotation) {
    const lastMove = getObjectFromNotation(moveNotation);
    const inversedDirection = inverseDirection(lastMove.direction)
    // rotate without adding move to stack
    rotate(lastMove.face, inversedDirection);
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
    } else if (previousGuesses.length >= GUESS_COUNT){
        fixateFinalGuess();
        lastMoves = []
        gameOver = true;
        console.log("oh no. You lost");
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
    [...solution].reverse().forEach(notation => revert(notation)) 
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