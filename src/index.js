import { init as inputInit } from './cube/cubeInput';
import { init as outputInit } from './cube/cubeOutput';
import { init as initCube } from './game/game';
import { clearButtonClicked, randomMoveButtonClicked, submitButtonClicked, undoButtonClicked } from './game/uiInput';
import { closeModal, openModal, showWinScreen } from './game/uiOutput';

import "./style.scss";

function init() {
    inputInit();
    outputInit();
    initCube();
}

init();
window.actions = {
    randomMoveButtonClicked,
    undoButtonClicked,
    submitButtonClicked,
    clearButtonClicked,
    closeModal,
    openModal,
    showWinScreen,
}
