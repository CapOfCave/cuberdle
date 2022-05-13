import { loadFromLocalStorage, setSaveToLocalStorage, setSolution, setup as setupGame } from '../../game/game';

const FETCH_URL = "http://localhost:8888/.netlify/functions/fetch-daily"

function fetchDailyChallenge() {
    fetch(FETCH_URL)
        .then(response => response.json())
        .then(r => {console.log(r);return r})
        .then(challenges => challenges.normal)
        .then(result => setSolution(result));
}

export function setup() {
    setSaveToLocalStorage(true);
    setupGame();
    
    if (window.localStorage.getItem("daily_solution")) {
        loadFromLocalStorage();
    } else {
        fetchDailyChallenge();
    }
}

export function init() {
    window.addEventListener('load', setup);
}