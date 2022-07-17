import { getGameConfig } from '../../game/difficulty';
import { setConfig, setSaveToLocalStorage, setSolution, setUpGuesses } from '../../game/game';
import { GameConfig } from '../../game/types';
import { closeModal } from '../../game/uiOutput';
import { generateScramble } from '../../generator';


function generateSolution(solutionLength: number, allowDoubleMoves: boolean) {
    return generateScramble(solutionLength, allowDoubleMoves, 0.3);
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