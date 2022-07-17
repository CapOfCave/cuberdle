import { createEmojiPattern } from "./utils";

export function openModal(modalId) {
    document.body.classList.add("modal-open")
    // close all other modals
    const activeModals = document.getElementsByClassName("active-modal");
    for (let modal of activeModals) {
        modal.classList.remove("active-modal");
    }
    document.getElementById(modalId)!.classList.add("active-modal");
}

export function closeModal() {
    document.body.classList.remove("modal-open")
    const activeModals = document.getElementsByClassName("active-modal");
    for (let modal of activeModals) {
        modal.classList.remove("active-modal");
    }
}

function showResultPattern(previousEvaluations) {
    for (let element of document.getElementsByClassName("result-pattern")) {
        element.innerHTML = createEmojiPattern(previousEvaluations, '<br>')
    }
}

function showSolution(solution) {
    for (let element of document.getElementsByClassName("solution")) {
        element.innerHTML = solution.join(', ');
    }
}

export function showWinScreen(previousEvaluations, solution) {
    showResultPattern(previousEvaluations);
    showSolution(solution);
    openModal("winModal")
}


export function showLossScreen(previousEvaluations, solution) {
    showResultPattern(previousEvaluations);
    showSolution(solution);
    openModal("lossModal")
}

export function showInstructions() {
    openModal("instructionsModal")
}

export function showSettings() {
    openModal("settingsModal")
}

export function shareResults(text) {
    navigator.clipboard.writeText(text);

    const tooltips = document.getElementsByClassName("share-tooltip");
    for (let tooltip of tooltips) {
        tooltip.classList.add("visible")
    }

    setTimeout(() => {
        for (let tooltip of tooltips) {
            tooltip.classList.remove("visible")
        }
    }, 1000)
}