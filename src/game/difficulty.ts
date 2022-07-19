import { Difficulty, loadSettings } from "../ui/settings";
import { GameConfig } from "./types";


const difficultyGameConfigs: {[key in Difficulty]: GameConfig} = {
    [Difficulty.EASY]: {
        allowDoubleMoves: false,
        guessLength: 5,
        guessCount: 5,
    },
    [Difficulty.MEDIUM]: {
        allowDoubleMoves: true,
        guessLength: 6,
        guessCount: 5,
    },
    [Difficulty.HARD]: {
        allowDoubleMoves: true,
        guessLength: 7,
        guessCount: 6,
    }
}


export function getDifficulty(): Difficulty {
    return loadSettings().difficulty;
}

export function getGameConfig(): GameConfig {
    const difficulty = getDifficulty();
    return difficultyGameConfigs[difficulty];
}