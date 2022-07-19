import { getGameConfig } from '../../game/difficulty';
import { Game, GameStateData } from '../../game/game';
import { GameConfig } from '../../game/types';
import { closeModal } from '../../game/uiOutput';
import { generateScramble } from '../../generator';



function generateSolution(solutionLength: number, allowDoubleMoves: boolean) {
    return generateScramble(solutionLength, allowDoubleMoves, 0.3);
}

export function setup() {
    reset();
}

export function reset() {
    const difficultySettings: GameConfig = getGameConfig();
    const solution = generateSolution(difficultySettings.guessLength, difficultySettings.allowDoubleMoves);
    const game = new Game(difficultySettings, solution, false, {});
    game.start();
}

export function playAgain() {
    reset();
    closeModal();
}

export function init() {
    window.addEventListener('load', setup);
}