import { GameState } from "../../game/constants";
import { Game, GameCallbacks, GameStateData } from "../../game/game";
import { Evaluation, GameConfig, Guess } from "../../game/types";
import { Difficulty } from "../../ui/settings";

export interface DailyGameStateData extends GameStateData {
    puzzleId: string;
}

export class DailyGame extends Game {

    private puzzleId: string;

    constructor(config: GameConfig, solution: Guess, callbacks: GameCallbacks, puzzleId: string, difficulty: Difficulty, existingData: { gameResult: GameState, previousGuesses: Guess[], previousEvaluations: Evaluation[] } | null = null) {
        super(config, solution, callbacks, difficulty, existingData)
        this.puzzleId = puzzleId;
    }

    getGameState = (): DailyGameStateData => {
        return {
            ...super.getGameState(),
            puzzleId: this.puzzleId,
        }
    }
}
