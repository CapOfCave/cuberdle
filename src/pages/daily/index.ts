import '../../styles/styles'
import '../../ui/settingsDom'

import { init as inputInit } from '../../cube/cubeInput';
import { init as outputInit } from '../../cube/cubeOutput';
import { init as initGame } from './gamemode-daily';
import { clearButtonClicked, randomMoveButtonClicked, submitButtonClicked, undoButtonClicked } from '../../game/uiInput';
import { closeModal, showInstructions, showSettings } from '../../game/uiOutput';
import { shareButtonClicked } from './ui-daily';

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
    showSettings,
    shareButtonClicked,
}
