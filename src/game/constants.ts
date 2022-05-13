import { DirectionNotation, FaceNotation } from "./notation";

export const faceNames: FaceNotation[] = ['L', 'R', 'U', 'D', 'B', 'F']

export enum Direction {
    CLOCKWISE = "clockwise",
    ANTI_CLOCKWISE = "anti_clockwise",
    DOUBLE_MOVE = "double_move",
}

export const directionsList = [Direction.CLOCKWISE, Direction.ANTI_CLOCKWISE, Direction.DOUBLE_MOVE];

export enum EvaluationState {
    CORRECT = 'correct', // green
    PRESENT = 'present', // yellow
    ABSENT = 'absent', // grey
    EMPTY = 'empty', // uncolored
}

export enum GameState {
    ONGOING = "ongoing",
    WIN = "win",
    LOSS = "loss",
}