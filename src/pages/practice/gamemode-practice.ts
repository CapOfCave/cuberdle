import { directionsList } from '../../game/constants';
import { setConfig, setSaveToLocalStorage, setSolution, setUpGuesses } from '../../game/game';
import { addMoveToStack } from '../../game/gameLogic';
import { closeModal } from '../../game/uiOutput';
import { getNotation } from '../../game/notation';
import { getGameConfig } from '../../game/difficulty';
import { GameConfig } from '../../game/types';


function generateSolution(solutionLength: number, allowDoubleMoves: boolean) {
    const solution = []
    while (solution.length < solutionLength) {
        const directionTypeCount = allowDoubleMoves ? 3 : 2;
        const direction = directionsList[Math.floor(Math.random() * directionTypeCount)];
        const face = Math.floor(Math.random() * 6);
        const notation = getNotation(face, direction)
        addMoveToStack(notation, solution, allowDoubleMoves);
    }
    return solution;
}

export function setup() {
    setSaveToLocalStorage(false);
    reset();
}

export function reset() {
    const difficultySettings: GameConfig = getGameConfig();
    const solution = generateSolution(difficultySettings.guessLength, difficultySettings.allowDoubleMoves);
    setConfig(difficultySettings)
    setUpGuesses(difficultySettings);
    setSolution(solution)
}

export function playAgain() {
    reset();
    closeModal();
}

export function init() {
    window.addEventListener('load', setup);
}