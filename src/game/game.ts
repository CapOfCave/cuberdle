import { reset as resetCube, rotate } from '../cube/cubeOutput';
import { EvaluationState, GameState } from './constants';
import { addMoveToStack, evaluateGuess, isNextMoveOverflowing } from './gameLogic';
import { addEvaluation, addGuess, fixateFinalGuess, moveToNextGuess, removeGuess } from './moveOutput';
import { getNotation, getObjectFromNotation } from './notation';
import { Evaluation, GameConfig, Guess } from './types';
import { showLossScreen, showWinScreen } from './uiOutput';
import { inverseDirection } from './utils';

let currentInstance: Game | null = null;

export function getCurrentGame(): Game | null {
    return currentInstance;
}

export interface GameStateData {
    puzzleId: string | null;
    previousEvaluations: Evaluation[];
    config: GameConfig;
    solution: Guess;
}
export interface GameCallbacks {
    onChanged?(gameState: GameStateData): void;
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
    callbacks: GameCallbacks;


    constructor(config: GameConfig, solution: Guess, saveToLocalStorage: boolean, callbacks: GameCallbacks, puzzleId: string | null = null, ) {
        this.pConfig = config;
        this.saveToLocalStorage = saveToLocalStorage;
        this.solution = solution;
        this.callbacks = callbacks;
        this.puzzleId = puzzleId;
    }

    start = () => {
        resetCube();
        this.setupCube();
        setUpGuesses(this.pConfig);
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
    }

    setupCube = () => {
        [...this.solution].reverse().forEach(notation => this.revert(notation, true))
    }

    getGameState = (): GameStateData => {
        return {
            puzzleId: this.puzzleId,
            previousEvaluations: this.previousEvaluations,
            config: this.pConfig!,
            solution: this.solution,
        }
    }

    notifyChanged = () => {
        if (this.callbacks.onChanged) {
            this.callbacks.onChanged(this.getGameState());
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