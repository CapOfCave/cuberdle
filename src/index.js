import { init as inputInit } from './cube/cubeInput';
import { init as outputInit } from './cube/cubeOutput';
import { turn, undo } from './game';
import "./style.scss";

function init() {
    inputInit();
    outputInit();
}

function randomeMoveButtonClicked() {
    turn(Math.floor(Math.random() * 6), Math.floor(Math.random() * 2));
}

function undoButtonClicked() {
    undo();
}

init();
window.actions = {
    randomeMoveButtonClicked,
    undoButtonClicked,
}
