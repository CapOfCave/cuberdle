import { reset as resetCube, rotate } from '../cube2/cubeOutput';
import { Difficulty } from '../ui/settings';
import { EvaluationState, GameState } from './constants';
import { addMoveToStack, evaluateGuess, isNextMoveOverflowing } from './gameLogic';
import { addEvaluation, addGuess, fixateFinalGuess, moveToNextGuess, removeGuess, setGuessesAndEvaluation } from './moveOutput';
import { getNotation, getObjectFromNotation } from './notation';
import { Evaluation, GameConfig, Guess } from './types';
import { showLossScreen, showWinScreen } from './uiOutput';
import { inverseDirection } from './utils';

let currentInstance: Game | null = null;

export function getCurrentGame(): Game | null {
    return currentInstance;
}

export interface GameStateData {
    previousEvaluations: Evaluation[];
    previousGuesses: Guess[];
    config: GameConfig;
    solution: Guess;
    gameResult: GameState;
    difficulty: Difficulty;
}

export interface GameCallbacks {
    onChange?(gameState: GameStateData): void;
}

export class Game {
    config: GameConfig;
    solution: Guess;
    lastMoves: Guess = []
    gameResult = GameState.ONGOING;
    previousGuesses: Guess[] = [];
    previousEvaluations: Evaluation[] = [];
    callbacks: GameCallbacks;

    difficulty: Difficulty;

    constructor(config: GameConfig, solution: Guess, callbacks: GameCallbacks, difficulty: Difficulty, existingData: {gameResult: GameState, previousGuesses: Guess[], previousEvaluations: Evaluation[]} | null = null) {
        this.config = config;
        this.solution = solution;
        this.callbacks = callbacks;
        this.difficulty = difficulty;
        
        if (existingData) {
            this.gameResult = existingData.gameResult;
            this.previousGuesses = existingData.previousGuesses;
            this.previousEvaluations = existingData.previousEvaluations;
        }
    }

    start = () => {
        resetCube();
        this.setupCube();
        setUpGuesses(this.config);
        setGuessesAndEvaluation(this.previousGuesses, this.previousEvaluations, this.gameResult  === GameState.LOSS ||  this.gameResult === GameState.WIN)
        if (this.previousEvaluations.some(evaluation => isAllCorrect(evaluation))) {
            showWinScreen(this.previousEvaluations, this.solution);
        } else if (this.previousGuesses.length >= this.config.guessCount) {
            showLossScreen(this.previousEvaluations, this.solution);
        } 
        // replace the 'current' instance
        currentInstance = this;
    }

    turn = (face, direction) => {
        if (this.gameResult !== GameState.ONGOING) return;
        if (isNextMoveOverflowing(face, direction, this.lastMoves, this.config!)) return;
        const notation = getNotation(face, direction);
        rotate(face, direction);
        const addMoveResponse = addMoveToStack(notation, this.lastMoves, this.config!.allowDoubleMoves);
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
        this.notifyChanged();
    }

    revert = (moveNotation, skipAnimation = false) => {
        const lastMove = getObjectFromNotation(moveNotation);
        const inversedDirection = inverseDirection(lastMove.direction)
        // rotate without adding move to stack
        rotate(lastMove.face, inversedDirection, skipAnimation);
    }

    undo = (skipAnimation = false, notify = true) => {
        if (this.lastMoves.length == 0) return;
        const lastMoveNotation = this.lastMoves.pop();
        this.revert(lastMoveNotation, skipAnimation);
        removeGuess(this.lastMoves.length);
        if (notify) this.notifyChanged();
    }

    clearGuess = () => {
        while (this.lastMoves.length > 0) {
            this.undo(true, false);
        }
        this.notifyChanged();
    }

    /**
     * Clear the Cube without affecting the last guess
     */
    clearCube = () => {
        while (this.lastMoves.length > 0) {
            this.revert(this.lastMoves.pop())
        }
        this.notifyChanged();
    }

    submit = () => {
        if (this.lastMoves.length != this.config.guessLength) return;
        this.previousGuesses.push([...this.lastMoves]);
        const evaluations = evaluateGuess(this.lastMoves, this.solution);
        this.previousEvaluations.push(evaluations)
        addEvaluation(evaluations)
        if (isAllCorrect(evaluations)) {
            fixateFinalGuess();
            this.lastMoves = []
            this.gameResult = GameState.WIN;
            showWinScreen(this.previousEvaluations, this.solution);
        } else if (this.previousGuesses.length >= this.config.guessCount) {
            fixateFinalGuess();
            this.lastMoves = []
            this.gameResult = GameState.LOSS;
            showLossScreen(this.previousEvaluations, this.solution)
        } else {
            moveToNextGuess();
            this.clearCube()
        }
        this.notifyChanged();
    }

    setupCube = () => {
        [...this.solution].reverse().forEach(notation => this.revert(notation, true))
    }

    getGameState(): GameStateData {
        return {
            previousGuesses: this.previousGuesses,
            previousEvaluations: this.previousEvaluations,
            config: this.config,
            solution: this.solution,
            gameResult: this.gameResult,
            difficulty: this.difficulty,
        }
    }

    notifyChanged = () => {
        if (this.callbacks.onChange) {
            this.callbacks.onChange(this.getGameState());
        }
    }
}

function isAllCorrect(evaluations) {
    return evaluations.every(evaluation => evaluation === EvaluationState.CORRECT)
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