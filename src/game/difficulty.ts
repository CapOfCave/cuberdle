import { Difficulty, loadSettings } from "../ui/settings";
import { GameConfig } from "./types";


const difficultyGameConfigs: {[key in Difficulty]: GameConfig} = {
    [Difficulty.EASY]: {
        allowDoubleMoves: false,
        guessLength: 1,
        guessCount: 5,
    },
    [Difficulty.MEDIUM]: {
        allowDoubleMoves: false,
        guessLength: 2,
        guessCount: 5,
    },
    [Difficulty.HARD]: {
        allowDoubleMoves: true,
        guessLength: 3,
        guessCount: 5,
    }
}


export function getDifficulty(): Difficulty {
    return loadSettings().difficulty;
}

export function getGameConfig(): GameConfig {
    const difficulty = getDifficulty();
    return difficultyGameConfigs[difficulty];
}