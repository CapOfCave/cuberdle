import { Game } from '../../game/game';
import { Guess } from '../../game/types';

const FETCH_URL = "/.netlify/functions/fetch-daily";

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

    const game = new Game(config, fetchSolution, true, fetchPuzzleId);

    game.start();

}

export function setup() {
    fetchDailyChallenge()
        .then((response: Response) => loadRelevantPuzzle(response));
}

export function init() {
    window.addEventListener('load', setup);
}