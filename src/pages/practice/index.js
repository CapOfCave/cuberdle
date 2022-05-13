import "../../defaults.scss";
import "../../style.scss";

import { init as inputInit } from '../../cube/cubeInput';
import { init as outputInit } from '../../cube/cubeOutput';
import { init as initGame } from './gamemode-practice';
import { clearButtonClicked, randomMoveButtonClicked, submitButtonClicked, undoButtonClicked, shareButtonClicked } from '../../game/uiInput';
import { closeModal, showInstructions, showWinScreen } from '../../game/uiOutput';
import { playAgain } from './gamemode-practice'

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
    playAgain,
}
