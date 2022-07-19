import { GameState } from '../../game/constants';
import { getDifficulty, getGameConfig } from '../../game/difficulty';
import { GameStateData } from '../../game/game';
import { Guess } from '../../game/types';
import { Difficulty } from '../../ui/settings';
import { DailyGame } from './daily-game';

// const FETCH_URL = "http://localhost:8888/.netlify/functions/fetch-daily";
const FETCH_URL = "/.netlify/functions/fetch-daily";

interface ResponseGameData {
    id: string,
    solution: Guess,
}

interface Response {
    id: string,
    easy: ResponseGameData,
    medium: ResponseGameData,
    hard: ResponseGameData,
    normal: ResponseGameData,
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

function onCubeChange(gameState: GameStateData, puzzleId: string, difficulty: string) {
    window.localStorage.setItem(`daily_${difficulty}_puzzleId`, puzzleId);
    window.localStorage.setItem(`daily_${difficulty}_solution`, JSON.stringify(gameState.solution));
    window.localStorage.setItem(`daily_${difficulty}_gameState`, gameState.gameResult);
    window.localStorage.setItem(`daily_${difficulty}_guesses`, JSON.stringify(gameState.previousGuesses));
    window.localStorage.setItem(`daily_${difficulty}_evaluations`, JSON.stringify(gameState.previousEvaluations));
}

function loadRelevantPuzzle(response: Response) {
    const fetchPuzzleId = response.id;
    const difficulty = getDifficulty();

    const fetchSolution = extractSolution(response, difficulty);

    const localPuzzleId = window.localStorage.getItem(`daily_${difficulty}_puzzleId`);
    const localSolution = window.localStorage.getItem(`daily_${difficulty}_solution`);

    if (localPuzzleId && localSolution && localPuzzleId == fetchPuzzleId) {
        const game = loadFromLocalStorage();
        game.start()
        return;
    }

    const game = new DailyGame(getGameConfig(), fetchSolution, { onChange: (gameState) => onCubeChange(gameState, fetchPuzzleId, difficulty) }, fetchPuzzleId, difficulty);
    game.start();

}

function extractSolution(response: Response, difficulty: Difficulty) {
    switch (difficulty) {
        case Difficulty.EASY: 
            return response.easy.solution
        case Difficulty.MEDIUM:
            return response.medium.solution
        case Difficulty.HARD:
            return response.hard.solution
    }
}

function loadFromLocalStorage() {
    const difficulty = getDifficulty();
    
    const localSolution = JSON.parse(window.localStorage.getItem(`daily_${difficulty}_solution`)!);
    const localGameResult = window.localStorage.getItem(`daily_${difficulty}_gameState`);
    const localPreviousGuesses = JSON.parse(window.localStorage.getItem(`daily_${difficulty}_guesses`)!);
    const localPreviousEvaluations = JSON.parse(window.localStorage.getItem(`daily_${difficulty}_evaluations`)!);
    const localPuzzleId = window.localStorage.getItem(`daily_${difficulty}_puzzleId`) ?? "unknown";

    const game = new DailyGame(getGameConfig(), localSolution, { onChange: (gameState) => onCubeChange(gameState, localPuzzleId, difficulty) }, localPuzzleId, difficulty, {
        gameResult: localGameResult ? <GameState>localGameResult : GameState.ONGOING,
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
    document.addEventListener('settings-changed-difficulty', ((e: CustomEvent) => {
        setup();
    }) as EventListener);
}