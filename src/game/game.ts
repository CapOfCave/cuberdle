import { reset as resetCube, rotate } from '../cube/cubeOutput';
import { EvaluationState, GameState } from './constants';
import { addEvaluation, addGuess, clearGuesses, fixateFinalGuess, moveToNextGuess, removeGuess, setGuessesAndEvaluation } from './moveOutput';
import { showInstructions, showLossScreen, showWinScreen } from './uiOutput';
import { createEmojiPattern, inverseDirection } from './utils';
import { addMoveToStack, evaluateGuess, isNextMoveOverflowing } from './gameLogic' 
import { getNotation, getObjectFromNotation } from './notation'
import { Evaluation, GameConfig, Guess } from './types';


let pConfig: GameConfig | null = null;

// ##############
// # GAME STATE #
// ##############

let solution;
// const solution = [ "L", "D'", "B", "F'", "D"  ];
// array of ["U", "F'", "D2"...] strings
let lastMoves: Guess = []
let gameResult = GameState.ONGOING;

let previousGuesses: Guess[] = [];
let previousEvaluations: Evaluation[] = [];

let saveToLocalStorage = false;

// TODO move to daily
let puzzleId: string | null = null;

export function turn(face, direction) {
    if (gameResult !== GameState.ONGOING) return;
    if (isNextMoveOverflowing(face, direction, lastMoves, pConfig!)) return;
    const notation = getNotation(face, direction);
    rotate(face, direction);
    const addMoveResponse = addMoveToStack(notation, lastMoves, pConfig!.allowDoubleMoves);
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

export function undo(skipAnimation = false) {
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
    if (lastMoves.length != pConfig!.guessLength) return;
    previousGuesses.push([...lastMoves]);
    const evaluations = evaluateGuess(lastMoves, solution);
    previousEvaluations.push(evaluations)
    addEvaluation(evaluations)
    if (isAllCorrect(evaluations)) {
        fixateFinalGuess();
        lastMoves = []
        gameResult = GameState.WIN;
        showWinScreen(previousEvaluations, solution);
    } else if (previousGuesses.length >= pConfig!.guessCount) {
        fixateFinalGuess();
        lastMoves = []
        gameResult = GameState.LOSS;
        showLossScreen(previousEvaluations, solution)
    } else {
        moveToNextGuess();
        clearCube()
    }
    updateLocalStorage();
}


function setupInstructions() {
    if (!window.localStorage.getItem('skipInstructions')) {
        showInstructions();
        window.localStorage.setItem('skipInstructions', "true")
    }
}

export function setupCube() {
    [...solution].reverse().forEach(notation => revert(notation, true))
}

export function setUpGuesses(config: GameConfig) {
    const guessSection = document.getElementById("guessSection")
    while (guessSection!.firstChild) {
        guessSection!.removeChild(guessSection!.lastChild!);
      }
    for (let i = 0; i < config.guessCount; i++) {
        const guessRow = document.createElement('div');
        guessRow.classList.add('guess-row')
        if (i === 0) guessRow.setAttribute('id', 'currentGuess');

        for (let j = 0; j < config.guessLength; j++) {
            const moveCard = document.createElement('div');
            moveCard.classList.add('move-card')
            moveCard.dataset.state = EvaluationState.EMPTY;
            guessRow.appendChild(moveCard)
        }

        guessSection!.appendChild(guessRow);
    }
}

export function setSolution(newSolution) {
    resetCube();
    clearGuesses();
    lastMoves = [];
    gameResult = GameState.ONGOING;
    previousEvaluations = [];
    previousGuesses = [];

    solution = newSolution;
    updateLocalStorage();
    setupCube();
}

function updateLocalStorage() {
    if (!saveToLocalStorage) return;
    window.localStorage.setItem("daily_puzzleId", puzzleId!);
    window.localStorage.setItem("daily_solution", JSON.stringify(solution));
    window.localStorage.setItem("daily_gameState", gameResult);
    window.localStorage.setItem("daily_guesses", JSON.stringify(previousGuesses));
    window.localStorage.setItem("daily_evaluations", JSON.stringify(previousEvaluations)); 
}

// TODO cleanup :)
export function loadFromLocalStorage() {
    const localSolution = JSON.parse(window.localStorage.getItem("daily_solution")!);
    solution = localSolution;
    setupCube();

    const localGameResult = window.localStorage.getItem("daily_gameState");
    const localPreviousGuesses = JSON.parse(window.localStorage.getItem("daily_guesses")!);
    const localPreviousEvaluations = JSON.parse(window.localStorage.getItem("daily_evaluations")!);

    previousGuesses = localPreviousGuesses ?? []
    previousEvaluations = localPreviousEvaluations ?? []

    setGuessesAndEvaluation(previousGuesses, previousEvaluations, localGameResult === GameState.LOSS || localGameResult === GameState.WIN);

    if (localGameResult === GameState.LOSS) {
        showLossScreen(previousEvaluations, localSolution);
        gameResult = localGameResult;
    } else if (localGameResult === GameState.WIN) {
        showWinScreen(previousEvaluations, localSolution);
        gameResult = localGameResult;
    } else {
        gameResult = GameState.ONGOING;
    }

    puzzleId = window.localStorage.getItem("daily_puzzleId");
}

export function getGameState() {
    return {
        puzzleId,
        previousEvaluations,
        config: pConfig!,
        solution,
    }
}

export function init() {
    window.addEventListener('load', setupInstructions);
}

export function setSaveToLocalStorage(value) {
    saveToLocalStorage = value;
}

export function setPuzzleId(value) {
    puzzleId = value;
}

export function setConfig(newConfig: GameConfig) {
    pConfig = newConfig;
}