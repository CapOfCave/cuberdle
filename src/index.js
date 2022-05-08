import { directionsList } from './cube/constants';
import { init as inputInit } from './cube/cubeInput';
import { init as outputInit } from './cube/cubeOutput';
import { turn, undo } from './game';
import "./style.scss";

function init() {
    inputInit();
    outputInit();
}

function randomeMoveButtonClicked() {
    // no double moves for now
    const direction = directionsList[Math.floor(Math.random() * 2)];
    turn(Math.floor(Math.random() * 6), direction);
}

function undoButtonClicked() {
    undo();
}

init();
window.actions = {
    randomeMoveButtonClicked,
    undoButtonClicked,
}
