type FaceNotation = 'L' | 'R' | 'U' | 'D' | 'B' | 'F';
type DirectionNotation = '' | "'" | '2';

export const faceNames: FaceNotation[] = ['L', 'R', 'U', 'D', 'B', 'F']

export enum Direction {
    CLOCKWISE = "clockwise",
    ANTI_CLOCKWISE = "anti_clockwise",
    DOUBLE_MOVE = "double_move",
}

export const directionsList = [Direction.CLOCKWISE, Direction.ANTI_CLOCKWISE, Direction.DOUBLE_MOVE];

export const DIRECTION_NOTATIONS: {[key in Direction]: DirectionNotation} = {
    [Direction.CLOCKWISE]: '',
    [Direction.ANTI_CLOCKWISE]: "'",
    [Direction.DOUBLE_MOVE]: '2',
}

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