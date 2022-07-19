import { showInstructions } from './uiOutput';

function setupInstructions() {
    if (!window.localStorage.getItem('skipInstructions')) {
        showInstructions();
        window.localStorage.setItem('skipInstructions', "true")
    }
}

export function init() {
    window.addEventListener('load', setupInstructions);
}