import { loadFromLocalStorage, setPuzzleId, setSaveToLocalStorage, setSolution, setup as setupGame } from '../../game/game';

const FETCH_URL = "http://localhost:8888/.netlify/functions/fetch-daily"

function fetchDailyChallenge() {
    return fetch(FETCH_URL)
        .then(response => response.json())
}

function loadRelevantPuzzle(fetchPuzzleId, fetchSolution) {
    const localPuzzleId = window.localStorage.getItem("daily_puzzleId");
    const localSolution = window.localStorage.getItem("daily_solution");

    if (localPuzzleId && localSolution && localPuzzleId === fetchPuzzleId) {
        loadFromLocalStorage();
        return;
    }

    setPuzzleId(fetchPuzzleId);
    setSolution(fetchSolution);


}

export function setup() {
    setSaveToLocalStorage(true);
    setupGame();

    fetchDailyChallenge()
        .then(response => loadRelevantPuzzle(response.normal.id, response.normal.solution));
}

export function init() {
    window.addEventListener('load', setup);
}