import "./style.scss";
import { turn } from './cube/cube'

function undoButtonClicked() {
    turn(Math.floor(Math.random() * 6), Math.floor(Math.random() * 2));
}


window.undoButtonClicked = undoButtonClicked;