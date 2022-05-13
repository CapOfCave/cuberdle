import "../../defaults.scss";
import "../../style.scss";

import { init as inputInit } from '../../cube/cubeInput';
import { init as outputInit } from '../../cube/cubeOutput';
import { init as initGame } from './gamemode-daily';
import { clearButtonClicked, randomMoveButtonClicked, submitButtonClicked, undoButtonClicked, playAgain, shareButtonClicked } from '../../game/uiInput';
import { closeModal, showInstructions, showWinScreen } from '../../game/uiOutput';

function init() {
    inputInit();
    outputInit();
    initGame();
}

init();
window.actions = {
    randomMoveButtonClicked,
    undoButtonClicked,
    submitButtonClicked,
    clearButtonClicked,
    closeModal,
    showInstructions,
    showWinScreen,
    shareButtonClicked,
}
