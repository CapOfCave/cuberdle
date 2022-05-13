import { Direction, faceNames } from "./constants";

export type FaceNotation = 'L' | 'R' | 'U' | 'D' | 'B' | 'F';
export type DirectionNotation = '' | "'" | '2';
export type Notation = `${FaceNotation}${DirectionNotation}`

const DIRECTION_NOTATIONS: {[key in Direction]: DirectionNotation} = {
    [Direction.CLOCKWISE]: '',
    [Direction.ANTI_CLOCKWISE]: "'",
    [Direction.DOUBLE_MOVE]: '2',
}

export function getDirectionNotation(direction: Direction) {
    return DIRECTION_NOTATIONS[direction]
}

/**
 * Return the {face, direction} representation of the notation string 
 */
 export function getObjectFromNotation(notation: Notation) {
    const face = faceNames.indexOf(notation.charAt(0) as FaceNotation);
    const direction = Object.keys(DIRECTION_NOTATIONS).find(key => DIRECTION_NOTATIONS[key] === notation.charAt(1));
    return { face, direction }
}

export function getNotation(face: number, direction: Direction): Notation {
    const faceNotation = faceNames[face];
    const directionNotation = getDirectionNotation(direction)
    return `${faceNotation}${directionNotation}`
}