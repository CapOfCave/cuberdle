
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