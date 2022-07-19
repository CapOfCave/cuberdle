import { reset as resetCube, rotate } from '../cube/cubeOutput';
import { EvaluationState, GameState } from './constants';
import { addEvaluation, addGuess, clearGuesses, fixateFinalGuess, moveToNextGuess, removeGuess, setGuessesAndEvaluation } from './moveOutput';
import { showInstructions, showLossScreen, showWinScreen } from './uiOutput';
import { inverseDirection } from './utils';
import { addMoveToStack, evaluateGuess, isNextMoveOverflowing } from './gameLogic'
import { getNotation, getObjectFromNotation } from './notation'
import { Evaluation, GameConfig, Guess } from './types';

let currentInstance: Game | null = null;

export function getCurrentGame(): Game | null {
    return currentInstance;
}

export class Game {

    pConfig: GameConfig;
    solution: Guess;
    lastMoves: Guess = []
    gameResult = GameState.ONGOING;
    previousGuesses: Guess[] = [];
    previousEvaluations: Evaluation[] = [];

    saveToLocalStorage = false;

    // TODO move to daily
    puzzleId: string | null = null;

    constructor(config: GameConfig, solution: Guess, saveToLocalStorage: boolean, puzzleId: string | null = null) {
        this.pConfig = config;
        this.saveToLocalStorage = saveToLocalStorage;
        this.solution = solution;
        this.puzzleId = puzzleId;
    }

    start = () => {
        setUpGuesses(this.pConfig);
        this.setSolution(this.solution);
        // replace the 'current' instance
        currentInstance = this;
    }

    turn = (face, direction) => {
        if (this.gameResult !== GameState.ONGOING) return;
        if (isNextMoveOverflowing(face, direction, this.lastMoves, this.pConfig!)) return;
        const notation = getNotation(face, direction);
        rotate(face, direction);
        const addMoveResponse = addMoveToStack(notation, this.lastMoves, this.pConfig!.allowDoubleMoves);
        switch (addMoveResponse.status) {
            case "appended":
                addGuess(this.lastMoves.length - 1, addMoveResponse.notation);
                break;
            case "modified":
                addGuess(this.lastMoves.length - 1, addMoveResponse.notation);
                break;
            case "removed":
                removeGuess(this.lastMoves.length);
        }
    }

    revert = (moveNotation, skipAnimation = false) => {
        const lastMove = getObjectFromNotation(moveNotation);
        const inversedDirection = inverseDirection(lastMove.direction)
        // rotate without adding move to stack
        rotate(lastMove.face, inversedDirection, skipAnimation);
    }

    undo = (skipAnimation = false) => {
        if (this.lastMoves.length == 0) return;
        const lastMoveNotation = this.lastMoves.pop();
        this.revert(lastMoveNotation, skipAnimation);
        removeGuess(this.lastMoves.length)
    }

    clearGuess = () => {
        while (this.lastMoves.length > 0) {
            this.undo(true);
        }
    }

    /**
     * Clear the Cube without affecting the last guess
     */
    clearCube = () => {
        while (this.lastMoves.length > 0) {
            this.revert(this.lastMoves.pop())
        }
    }

    submit = () => {
        if (this.lastMoves.length != this.pConfig.guessLength) return;
        this.previousGuesses.push([...this.lastMoves]);
        const evaluations = evaluateGuess(this.lastMoves, this.solution);
        this.previousEvaluations.push(evaluations)
        addEvaluation(evaluations)
        if (isAllCorrect(evaluations)) {
            fixateFinalGuess();
            this.lastMoves = []
            this.gameResult = GameState.WIN;
            showWinScreen(this.previousEvaluations, this.solution);
        } else if (this.previousGuesses.length >= this.pConfig.guessCount) {
            fixateFinalGuess();
            this.lastMoves = []
            this.gameResult = GameState.LOSS;
            showLossScreen(this.previousEvaluations, this.solution)
        } else {
            moveToNextGuess();
            this.clearCube()
        }
        this.updateLocalStorage();
    }

    setupCube = () => {
        [...this.solution].reverse().forEach(notation => this.revert(notation, true))
    }

    setSolution = (newSolution) => {
        resetCube();
        clearGuesses();
        this.lastMoves = [];
        this.gameResult = GameState.ONGOING;
        this.previousEvaluations = [];
        this.previousGuesses = [];

        // solution = newSolution;
        this.updateLocalStorage();
        this.setupCube();
    }

    updateLocalStorage = () => {
        if (!this.saveToLocalStorage) return;
        window.localStorage.setItem("daily_puzzleId", this.puzzleId!);
        window.localStorage.setItem("daily_solution", JSON.stringify(this.solution));
        window.localStorage.setItem("daily_gameState", this.gameResult);
        window.localStorage.setItem("daily_guesses", JSON.stringify(this.previousGuesses));
        window.localStorage.setItem("daily_evaluations", JSON.stringify(this.previousEvaluations));
    }

    // TODO cleanup :)
    loadFromLocalStorage = () => {
        const localSolution = JSON.parse(window.localStorage.getItem("daily_solution")!);
        this.solution = localSolution;
        this.setupCube();

        const localGameResult = window.localStorage.getItem("daily_gameState");
        const localPreviousGuesses = JSON.parse(window.localStorage.getItem("daily_guesses")!);
        const localPreviousEvaluations = JSON.parse(window.localStorage.getItem("daily_evaluations")!);

        this.previousGuesses = localPreviousGuesses ?? []
        this.previousEvaluations = localPreviousEvaluations ?? []

        setGuessesAndEvaluation(this.previousGuesses, this.previousEvaluations, localGameResult === GameState.LOSS || localGameResult === GameState.WIN);

        if (localGameResult === GameState.LOSS) {
            showLossScreen(this.previousEvaluations, localSolution);
            this.gameResult = localGameResult;
        } else if (localGameResult === GameState.WIN) {
            showWinScreen(this.previousEvaluations, localSolution);
            this.gameResult = localGameResult;
        } else {
            this.gameResult = GameState.ONGOING;
        }

        this.puzzleId = window.localStorage.getItem("daily_puzzleId");
    }

    getGameState = () => {
        return {
            puzzleId: this.puzzleId,
            previousEvaluations: this.previousEvaluations,
            config: this.pConfig!,
            solution: this.solution,
        }
    }
}

function init() {
    window.addEventListener('load', setupInstructions);
}

function isAllCorrect(evaluations) {
    return evaluations.every(evaluation => evaluation === EvaluationState.CORRECT)
}

function setupInstructions() {
    if (!window.localStorage.getItem('skipInstructions')) {
        showInstructions();
        window.localStorage.setItem('skipInstructions', "true")
    }
}

function setUpGuesses(config: GameConfig) {
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
