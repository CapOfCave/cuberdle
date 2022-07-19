import { EvaluationState } from '../../game/constants';
import { getCurrentGame } from '../../game/game';
import { shareResults } from '../../game/uiOutput';
import { createEmojiPattern } from '../../game/utils';

function createShareText() {

    const game = getCurrentGame();
    if (!game) return `invalid`;

    const { previousEvaluations, solution, config, difficulty } = game.getGameState();

    let lastGuess = previousEvaluations[previousEvaluations.length - 1];
    let tries = lastGuess.every(val => val === EvaluationState.CORRECT) ? previousEvaluations.length : 'X';

    return `Cuberdle Practice (${difficulty} difficulty) ${tries}/${config.guessCount}
${solution.join(', ')}
${createEmojiPattern(previousEvaluations, '\n')}https://cuberdle.com`;
}

export function shareButtonClicked() {
    const text = createShareText();
    shareResults(text);
}
