import { GameState } from '../../game/constants';
import { Game, GameStateData } from '../../game/game';
import { Guess } from '../../game/types';

const FETCH_URL = "http://localhost:8888/.netlify/functions/fetch-daily";
// const FETCH_URL = "/.netlify/functions/fetch-daily";

const config = {
    guessCount: 5,
    guessLength: 5,
    allowDoubleMoves: false,
}

interface Response {
    normal: {
        id: string,
        solution: Guess,
    }
}

let fetchCache: Response | null = null;

async function fetchDailyChallenge(): Promise<Response> {
    if (fetchCache !== null) {
        return fetchCache;
    }

    return fetch(FETCH_URL)
        .then(response => response.json())
        .then((response: Response) => {
            fetchCache = response;
            return response;
        })
}

function onCubeChange(gameState: GameStateData, puzzleId: string) {
    window.localStorage.setItem("daily_puzzleId", puzzleId!);
    window.localStorage.setItem("daily_solution", JSON.stringify(gameState.solution));
    window.localStorage.setItem("daily_gameState", gameState.gameResult);
    window.localStorage.setItem("daily_guesses", JSON.stringify(gameState.previousGuesses));
    window.localStorage.setItem("daily_evaluations", JSON.stringify(gameState.previousEvaluations));
}

function loadRelevantPuzzle(response: Response) {

    // switch (getDifficulty()) {
    //     case Difficulty.EASY: 
    //         break;
    //     case Difficulty.MEDIUM:
    //         break;
    //     case Difficulty.HARD:
    //         break;
    // }

    const fetchPuzzleId = response.normal.id;
    const fetchSolution = response.normal.solution;

    const localPuzzleId = window.localStorage.getItem(`daily_puzzleId`);
    const localSolution = window.localStorage.getItem(`daily_solution`);

    if (localPuzzleId && localSolution && localPuzzleId === fetchPuzzleId) {
        console.log("locally")
        const game = loadFromLocalStorage(fetchPuzzleId);
        game.start()
        return;
    }

    const game = new Game(config, fetchSolution, { onChange: (gameState) => onCubeChange(gameState, fetchPuzzleId) }, fetchPuzzleId);

    game.start();

}

function loadFromLocalStorage(fetchPuzzleId: string) {
    const localSolution = JSON.parse(window.localStorage.getItem("daily_solution")!);
    const localGameResult = window.localStorage.getItem("daily_gameState");
    const localPreviousGuesses = JSON.parse(window.localStorage.getItem("daily_guesses")!);
    const localPreviousEvaluations = JSON.parse(window.localStorage.getItem("daily_evaluations")!);
    const localPuzzleId = window.localStorage.getItem("daily_puzzleId");

    const game = new Game(config, localSolution, { onChange: (gameState) => onCubeChange(gameState, fetchPuzzleId) }, localPuzzleId, {
        gameResult: (localGameResult && GameState[localGameResult]) ?? GameState.ONGOING,
        previousGuesses: localPreviousGuesses,
        previousEvaluations: localPreviousEvaluations,
    });
    return game;
}

export function setup() {
    fetchDailyChallenge()
        .then((response: Response) => loadRelevantPuzzle(response));
}

export function init() {
    window.addEventListener('load', setup);
}