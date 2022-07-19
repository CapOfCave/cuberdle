import '../../styles/styles'
import '../../ui/settingsDom'

import { init as inputInit } from '../../cube/cubeInput';
import { init as outputInit } from '../../cube/cubeOutput';
import { init as initGame } from './gamemode-practice';
import { init as instructionsInit } from '../../game/instructions';

import { clearButtonClicked, randomMoveButtonClicked, submitButtonClicked, undoButtonClicked, chooseEasyDifficulty, chooseMediumDifficulty, chooseHardDifficulty } from '../../game/uiInput';
import { closeModal, showInstructions, showSettings } from '../../game/uiOutput';
import { playAgain } from './gamemode-practice';
import { shareButtonClicked } from './ui-practice';

function init() {
    inputInit();
    outputInit();
    instructionsInit();
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
    playAgain,
    chooseEasyDifficulty,
    chooseMediumDifficulty,
    chooseHardDifficulty,
}
