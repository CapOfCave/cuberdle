import { loadFromLocalStorage, setConfig, setPuzzleId, setSaveToLocalStorage, setSolution, setUpGuesses } from '../../game/game';

const FETCH_URL = "http://localhost:8888/.netlify/functions/fetch-daily"

const config = {
    guessCount: 5,
    guessLength: 5,
    allowDoubleMoves: false,
}

function fetchDailyChallenge() {
    return fetch(FETCH_URL)
        .then(response => response.json())
}

function loadRelevantPuzzle(fetchPuzzleId, fetchSolution) {

    const localPuzzleId = window.localStorage.getItem(`daily_puzzleId`);
    const localSolution = window.localStorage.getItem(`daily_solution`);

    if (localPuzzleId && localSolution && localPuzzleId === fetchPuzzleId) {
        loadFromLocalStorage();
        return;
    }

    setConfig(config)

    setPuzzleId(fetchPuzzleId);
    setSolution(fetchSolution);


}

export function setup() {
    setSaveToLocalStorage(true);
    setUpGuesses(config);

    fetchDailyChallenge()
        .then(response => loadRelevantPuzzle(response.normal.id, response.normal.solution));
}

export function init() {
    window.addEventListener('load', setup);
}