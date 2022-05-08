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