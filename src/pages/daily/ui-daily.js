import { EvaluationState } from '../../game/constants';
import { getGameState } from '../../game/game';
import { shareResults } from '../../game/uiOutput';
import { createEmojiPattern } from '../../game/utils';

function createShareText() {

    const { puzzleId, previousEvaluations, config} = getGameState();

    const [_difficultyId, dayId] = puzzleId.split("-");

    let lastGuess = previousEvaluations[previousEvaluations.length - 1];
    let tries = lastGuess.every(val => val === EvaluationState.CORRECT) ? previousEvaluations.length : 'X';

    return `Cuberdle #${dayId} (Normal Difficulty) ${tries}/${config.guessCount}
${createEmojiPattern(previousEvaluations, '\n')}https://cuberdle.com`;

}

export function shareButtonClicked() {
    const text = createShareText();
    shareResults(text);
}
