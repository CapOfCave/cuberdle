import "./style.scss";
import { turn } from './game'
import { init as inputInit} from './cube/cubeInput'
import { init as outputInit} from './cube/cubeOutput'

function init() {
    inputInit();
    outputInit();
}

function undoButtonClicked() {
    turn(Math.floor(Math.random() * 6), Math.floor(Math.random() * 2));
}

init();
window.undoButtonClicked = undoButtonClicked;
