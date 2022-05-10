import { EvaluationState } from "./constants";

const EVALUATION_TO_EMOJI_MAP = {
    [EvaluationState.CORRECT]: '🟩',
    [EvaluationState.PRESENT]: '🟨',
    [EvaluationState.ABSENT]: '⬛'
};

function createEmojiPattern(previousEvaluations, separator) {
    let pattern = ''
    for (let i = 0; i < previousEvaluations.length; i++) {
        pattern += previousEvaluations[i].map(res => EVALUATION_TO_EMOJI_MAP[res]).join('') + separator;
    }
    return pattern;
}

export function openModal(modalId) {
    document.body.classList.add("modal-open")
    // close all other modals
    const activeModals = document.getElementsByClassName("active-modal");
    for (let modal of activeModals) {
        modal.classList.remove("active-modal");
    }
    document.getElementById(modalId).classList.add("active-modal");
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