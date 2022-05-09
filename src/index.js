import { directionsList } from './game/constants';
import { init as inputInit } from './cube/cubeInput';
import { init as outputInit } from './cube/cubeOutput';
import { turn, undo, submit, clearGuess, init as initCube } from './game/game';
import "./style.scss";

function init() {
    inputInit();
    outputInit();
    initCube();
}

function randomMoveButtonClicked() {
    // no double moves for now
    const direction = directionsList[Math.floor(Math.random() * 2)];
    turn(Math.floor(Math.random() * 6), direction);
}

function undoButtonClicked() {
    undo();
}

function submitButtonClicked() {
    submit();
}

function clearButtonClicked() {
    clearGuess()
}

function closeModal() {
    document.body.classList.remove("modal-open")
    const activeModals = document.getElementsByClassName("active-modal");
    for (let modal of activeModals) {
        modal.classList.remove("active-modal");
    }
}

function openModal(modalId) {
    document.body.classList.add("modal-open")
    // close all other modals
    const activeModals = document.getElementsByClassName("active-modal");
    for (let modal of activeModals) {
        modal.classList.remove("active-modal");
    }
    document.getElementById(modalId).classList.add("active-modal");
}

init();
window.actions = {
    randomMoveButtonClicked,
    undoButtonClicked,
    submitButtonClicked,
    clearButtonClicked,
    closeModal,
    openModal,
}
