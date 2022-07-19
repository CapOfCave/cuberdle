import { Difficulty, updateItem } from '../ui/settings';
import { directionsList } from './constants';
import { getCurrentGame } from './game';
import { closeModal } from './uiOutput';

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

function chooseDifficulty(difficulty: Difficulty) {
    updateItem({ difficulty });
    closeModal();
}

export function chooseEasyDifficulty() {
    chooseDifficulty(Difficulty.EASY);
}

export function chooseMediumDifficulty() {
    chooseDifficulty(Difficulty.MEDIUM);
}

export function chooseHardDifficulty() {
    chooseDifficulty(Difficulty.HARD);
}
