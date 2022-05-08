import { rotate } from '../cube/cubeOutput'
import { Direction } from './constants'
import { addEvaluation, addGuess, fixateFinalGuess, moveToNextGuess, removeGuess } from './moveOutput'

const faceNames = ['L', 'R', 'U', 'D', 'B', 'F']

const EvaluationState = {
    CORRECT: 'correct', // green
    PRESENT: 'present', // yellow
    ABSENT: 'absent', // grey
    EMPTY: 'empty', // uncolored
}

// hard-coded, for now
const solution = [ "F'", "L'", "F'", "U", "L'" ]
const GUESS_LENGTH = solution.length;

const GUESS_COUNT = 5;

const DIRECTION_NOTATIONS = {
    [Direction.CLOCKWISE]: '',
    [Direction.ANTI_CLOCKWISE]: "'",
    [Direction.DOUBLE_MOVE]: '2',
}

function getDirectionNotation(direction) {
    return DIRECTION_NOTATIONS[direction]
}

function inverseDirection(direction) {
    switch (direction) {
        case Direction.CLOCKWISE: return Direction.ANTI_CLOCKWISE;
        case Direction.ANTI_CLOCKWISE: return Direction.CLOCKWISE;
        case Direction.DOUBLE_MOVE: return Direction.DOUBLE_MOVE;
    }
}

function getNotation(face, direction) {
    const faceNotation = faceNames[face];
    const directionNotation = getDirectionNotation(direction)
    return `${faceNotation}${directionNotation}`
}

/**
 * Return the {face, direction} representation of the notation string 
 */
function getObjectFromNotation(notation) {
    const face = faceNames.indexOf(notation.charAt(0));
    const direction = Object.keys(DIRECTION_NOTATIONS).find(key => DIRECTION_NOTATIONS[key] === notation.charAt(1));
    return { face, direction }
}

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
        console.log("wow! nice! you won!")
    } else if (previousGuesses.length >= GUESS_COUNT){
        fixateFinalGuess();
        lastMoves = []
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