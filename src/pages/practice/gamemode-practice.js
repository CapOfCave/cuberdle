import { setSaveToLocalStorage, setSolution, setup as setupGame } from '../../game/game';
import { closeModal } from '../../game/uiOutput';
import { generateScramble } from '../../generator';

const GUESS_LENGTH = 5;
const ALLOW_DOUBLE_MOVES = false;

function generateSolution(solutionLength, allowDoubleMoves) {
    const solution = generateScramble(solutionLength, allowDoubleMoves, 0.3);
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