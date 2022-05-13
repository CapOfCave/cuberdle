import { Direction, EvaluationState, faceNames } from "./constants";


export function inverseDirection(direction: Direction) {
    switch (direction) {
        case Direction.CLOCKWISE: return Direction.ANTI_CLOCKWISE;
        case Direction.ANTI_CLOCKWISE: return Direction.CLOCKWISE;
        case Direction.DOUBLE_MOVE: return Direction.DOUBLE_MOVE;
    }
}

/**
 * Return a direction to the number of clockwise rotation it needs to reach said direction
 */
export function mapDirectionToNumber(direction: Direction) {
    switch (direction) {
        case Direction.CLOCKWISE: return 1;
        case Direction.ANTI_CLOCKWISE: return 3;
        case Direction.DOUBLE_MOVE: return 2;
    }
}

/**
 * Return a direction to the number of clockwise rotation it needs to reach said direction
 */
 export function mapNumberToDirection(directionNumber: number) {
    if (directionNumber % 4 === 0) return null;
    
    switch (directionNumber % 4) {
        case 1: return Direction.CLOCKWISE;
        case 2: return Direction.DOUBLE_MOVE;
        case 3: return Direction.ANTI_CLOCKWISE;
        default: return null;
    }
}

const EVALUATION_TO_EMOJI_MAP = {
    [EvaluationState.CORRECT]: '🟩',
    [EvaluationState.PRESENT]: '🟨',
    [EvaluationState.ABSENT]: '⬛'
};

export function createEmojiPattern(previousEvaluations, separator) {
    let pattern = ''
    for (let i = 0; i < previousEvaluations.length; i++) {
        pattern += previousEvaluations[i].map(res => EVALUATION_TO_EMOJI_MAP[res]).join('') + separator;
    }
    return pattern;
}