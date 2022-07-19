import { GameState } from "../../game/constants";
import { Game, GameCallbacks, GameStateData } from "../../game/game";
import { Evaluation, GameConfig, Guess } from "../../game/types";

export interface DailyGameStateData extends GameStateData {
    puzzleId: string;
}

export class DailyGame extends Game {

    private puzzleId: string;

    constructor(config: GameConfig, solution: Guess, callbacks: GameCallbacks, puzzleId: string, existingData: { gameResult: GameState, previousGuesses: Guess[], previousEvaluations: Evaluation[] } | null = null) {
        super(config, solution, callbacks, existingData)
        this.puzzleId = puzzleId;
    }

    getGameState = (): DailyGameStateData => {
        return {
            ...super.getGameState(),
            puzzleId: this.puzzleId,
        }
    }
}
