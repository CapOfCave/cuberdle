import { EvaluationState } from "./constants";

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


function resetCurrentGuess() {
    const currentGuess = document.getElementById('currentGuess');
    if (currentGuess) {
        currentGuess.id = ""
    }
    const next =  document.getElementsByClassName('guess-row')[0];
    next.id = "currentGuess";
   

}
export function clearGuesses() {
    const guessSection = document.getElementById('guessSection');
    const moveCards = guessSection.querySelectorAll('.move-card');
    for (let moveCard of moveCards) {
        moveCard.textContent = ""
        moveCard.dataset.state = EvaluationState.EMPTY
    }
    resetCurrentGuess();
}

export function setGuessesAndEvaluation(guesses, evaluations, gameOver) {
    
    for (let i = 0; i < guesses.length; i++) {
        for (let j = 0; j < guesses[i].length; j++) {
            addGuess(j, guesses[i][j]);
        }
        addEvaluation(evaluations[i]);
        if (i === guesses.length - 1 && gameOver) {
            fixateFinalGuess();
        } else {
            moveToNextGuess();
        }
    }
}