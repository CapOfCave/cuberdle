import { Direction, DIRECTION_NOTATIONS, faceNames } from "./constants";

export function getDirectionNotation(direction) {
    return DIRECTION_NOTATIONS[direction]
}

export function inverseDirection(direction) {
    switch (direction) {
        case Direction.CLOCKWISE: return Direction.ANTI_CLOCKWISE;
        case Direction.ANTI_CLOCKWISE: return Direction.CLOCKWISE;
        case Direction.DOUBLE_MOVE: return Direction.DOUBLE_MOVE;
    }
}

export function getNotation(face, direction) {
    const faceNotation = faceNames[face];
    const directionNotation = getDirectionNotation(direction)
    return `${faceNotation}${directionNotation}`
}

/**
 * Return the {face, direction} representation of the notation string 
 */
export function getObjectFromNotation(notation) {
    const face = faceNames.indexOf(notation.charAt(0));
    const direction = Object.keys(DIRECTION_NOTATIONS).find(key => DIRECTION_NOTATIONS[key] === notation.charAt(1));
    return { face, direction }
}

/**
 * Return a direction to the number of clockwise rotation it needs to reach said direction
 */
export function mapDirectionToNumber(direction) {
    switch (direction) {
        case Direction.CLOCKWISE: return 1;
        case Direction.ANTI_CLOCKWISE: return 3;
        case Direction.DOUBLE_MOVE: return 2;
    }
}

/**
 * Return a direction to the number of clockwise rotation it needs to reach said direction
 */
 export function mapNumberToDirection(directionNumber) {
    if (directionNumber % 4 === 0) return null;
    
    switch (directionNumber % 4) {
        case 0: return null;
        case 1: return Direction.CLOCKWISE;
        case 2: return Direction.DOUBLE_MOVE;
        case 3: return Direction.ANTI_CLOCKWISE;
    }


}