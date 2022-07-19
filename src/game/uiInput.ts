import { directionsList } from './constants';
import { getCurrentGame } from './game';

export function undoButtonClicked() {
    getCurrentGame()?.undo();
}

export function submitButtonClicked() {
    getCurrentGame()?.submit();
}

export function clearButtonClicked() {
    getCurrentGame()?.clearGuess()
}

export function randomMoveButtonClicked() {
    // no double moves for now
    const direction = directionsList[Math.floor(Math.random() * 2)];
    getCurrentGame()?.turn(Math.floor(Math.random() * 6), direction);
}

