export const faceNames = ['L', 'R', 'U', 'D', 'B', 'F']

export const Direction = {
    CLOCKWISE: 'clockwise',
    ANTI_CLOCKWISE: 'anticlockwise',
    DOUBLE_MOVE: 'double_move',
}

export const directionsList = [Direction.CLOCKWISE, Direction.ANTI_CLOCKWISE, Direction.DOUBLE_MOVE];

export const DIRECTION_NOTATIONS = {
    [Direction.CLOCKWISE]: '',
    [Direction.ANTI_CLOCKWISE]: "'",
    [Direction.DOUBLE_MOVE]: '2',
}

export const EvaluationState = {
    CORRECT: 'correct', // green
    PRESENT: 'present', // yellow
    ABSENT: 'absent', // grey
    EMPTY: 'empty', // uncolored
}
