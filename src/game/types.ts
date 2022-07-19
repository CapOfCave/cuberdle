import { EvaluationState } from "./constants";
import { Notation } from "./notation";

export type Guess = Notation[]

export type Evaluation = EvaluationState[]


export interface GameConfig {
    guessCount: number;
    guessLength: number;
    allowDoubleMoves: boolean;
}

declare global {
    interface Window { actions: {[key: string]: () => void}; }
}