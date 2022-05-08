
function getLetterAt(index) {
    const currentGuess = document.getElementById('currentGuess');
    const children = currentGuess.children;
    return children[index]
}

export function addGuess(index, notation) {
    const relevantChild = getLetterAt(index);
    relevantChild.textContent = notation;
}

export function removeGuess(index) {
    const relevantChild = getLetterAt(index);
    relevantChild.textContent = ""
}

export function moveToNextGuess() {
    const currentGuess = document.getElementById('currentGuess');
    currentGuess.id = ""
    const next = currentGuess.nextElementSibling;
    next.id = "currentGuess";
}

export function fixateFinalGuess() {
    const currentGuess = document.getElementById('currentGuess');
    currentGuess.id = ""
}


export function addEvaluation(evaluations) {
    for (let i = 0; i < evaluations.length; i++) {
        const letter = getLetterAt(i);
        letter.dataset.state = evaluations[i];
    }
}