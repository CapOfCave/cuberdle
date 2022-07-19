import { EvaluationState } from '../../game/constants';
import { getCurrentGame } from '../../game/game';
import { shareResults } from '../../game/uiOutput';
import { createEmojiPattern } from '../../game/utils';
import { DailyGame } from './daily-game';

function createShareText() {

    const game = getCurrentGame() as DailyGame;
    if (!game) return `invalid`;

    const { puzzleId, previousEvaluations, config} = game.getGameState();
    const [_difficultyId, dayId] = puzzleId!.split("-");

    let lastGuess = previousEvaluations[previousEvaluations.length - 1];
    let tries = lastGuess.every(val => val === EvaluationState.CORRECT) ? previousEvaluations.length : 'X';

    return `Cuberdle #${dayId} (Normal Difficulty) ${tries}/${config.guessCount}
${createEmojiPattern(previousEvaluations, '\n')}https://cuberdle.com`;

}

export function shareButtonClicked() {
    const text = createShareText();
    shareResults(text);
}
