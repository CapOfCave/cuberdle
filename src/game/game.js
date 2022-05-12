import { rotate, reset as resetCube } from '../cube/cubeOutput';
import { directionsList, EvaluationState, GameState } from './constants';
import { addEvaluation, addGuess, clearGuesses, fixateFinalGuess, moveToNextGuess, removeGuess } from './moveOutput';
import { showWinScreen, showLossScreen, showInstructions } from './uiOutput';
import { createEmojiPattern, getNotation, getObjectFromNotation, inverseDirection, mapDirectionToNumber, mapNumberToDirection } from './utils';

// ##########
// # Config #
// ##########
const GUESS_COUNT = 5;
const GUESS_LENGTH = 5;
const FETCH_URL = "http://localhost:8888/.netlify/functions/fetch-daily"

const ALLOW_DOUBLE_MOVES = false;

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

    if (resultingDirection === null) {
        stack.pop();
        return { status: "removed" };
    }

    if (ALLOW_DOUBLE_MOVES) {
        const resultingMove = getNotation(newMove.face, resultingDirection);
        stack.pop();
        stack.push(resultingMove);
        return { status: "modified", notation: resultingMove };
    } else {
        stack.push(notation);
        return { status: "appended", notation };
    }
}

// ##############
// # GAME STATE #
// ##############

let solution;
// const solution = [ "L", "D'", "B", "F'", "D"  ];
// array of ["U", "F'", "D2"...] strings
let lastMoves = []
let gameResult = GameState.ONGOING;

let previousGuesses = [];
let previousEvaluations = [];

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

function isNextMoveOverflowing(face, direction) {

    if (lastMoves.length === 0) {
        return false;
    }

    const last = getObjectFromNotation(lastMoves[lastMoves.length - 1])

    if (ALLOW_DOUBLE_MOVES && face === last.face) {
        // with double moves, all moves of the same face will combine
        return false;
    }


    if (!ALLOW_DOUBLE_MOVES && face === last.face && direction !== last.direction) {
        // without double moves, only moves in opposite directions will combine
        // since there are no double moves, all different moves will be opposite moves
        return false;
    }
    return lastMoves.length >= GUESS_LENGTH;

}

export function turn(face, direction) {
    if (gameResult !== GameState.ONGOING) return;
    if (isNextMoveOverflowing(face, direction)) return;
    const notation = getNotation(face, direction);
    rotate(face, direction);
    const addMoveResponse = addMoveToStack(notation, lastMoves);
    switch (addMoveResponse.status) {
        case "appended":
            addGuess(lastMoves.length - 1, addMoveResponse.notation);
            break;
        case "modified":
            addGuess(lastMoves.length - 1, addMoveResponse.notation);
            break;
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

export function undo(skipAnimation) {
    if (lastMoves.length == 0) return;
    const lastMoveNotation = lastMoves.pop();
    revert(lastMoveNotation, skipAnimation);
    removeGuess(lastMoves.length)
}

export function clearGuess() {
    while (lastMoves.length > 0) {
        undo(true);
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
        gameResult = GameState.WIN;
        showWinScreen(previousEvaluations, solution);
    } else if (previousGuesses.length >= GUESS_COUNT) {
        fixateFinalGuess();
        lastMoves = []
        gameResult = GameState.LOSS;
        showLossScreen(previousEvaluations, solution)
    } else {
        moveToNextGuess();
        clearCube()
    }
}


function setupInstructions() {
    if (!window.localStorage.getItem('skipInstructions')) {
        showInstructions();
        window.localStorage.setItem('skipInstructions', true)
    }
}

function setup() {
    fetchDailyChallenge();
    setupGuesses();
    setupInstructions();
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

function setSolution(newSolution) {
    resetCube();
    clearGuesses();
    lastMoves = [];
    gameResult = GameState.ONGOING;
    previousEvaluations = [];
    previousGuesses = [];

    solution = newSolution;
    setupCube();
}

function fetchDailyChallenge() {
    fetch(FETCH_URL)
        .then(response => response.json())
        .then(challenges => challenges.normal)
        .then(result => setSolution(result));
}

export function createShareText() {
    let lastGuess = previousEvaluations[previousEvaluations.length - 1];
    let tries = lastGuess.every(val => val === EvaluationState.CORRECT) ? previousEvaluations.length : 'X';

    return `Cuberdle Random (Normal Difficulty) ${tries}/${GUESS_COUNT}
${solution.join(', ')}

${createEmojiPattern(previousEvaluations, '\n')}
https://cuberdle.com`;

}

export function init() {
    window.addEventListener('load', setup);
}