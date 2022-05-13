import { directionsList } from '../../game/constants';
import { setSaveToLocalStorage, setSolution, setup as setupGame } from '../../game/game';
import { closeModal } from '../../game/uiOutput';
import { addMoveToStack, getNotation } from '../../game/utils';

const GUESS_LENGTH = 5;
const ALLOW_DOUBLE_MOVES = false;

function generateSolution(solutionLength, allowDoubleMoves) {
    const solution = []
    while (solution.length < solutionLength) {
        const direction = directionsList[Math.floor(Math.random() * 2)];
        const face = Math.floor(Math.random() * 6);
        const notation = getNotation(face, direction)
        addMoveToStack(notation, solution, allowDoubleMoves);
    }
    return solution;
}

export function setup() {
    setSaveToLocalStorage(false);
    setupGame();
    reset();
}

export function reset() {
    setSolution(generateSolution(GUESS_LENGTH, ALLOW_DOUBLE_MOVES))
}

export function playAgain() {
    reset();
    closeModal();
}

export function init() {
    window.addEventListener('load', setup);
}