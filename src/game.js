import { rotate } from './cube/cubeOutput'
import { Direction } from './cube/constants'

const faceNames = ['L', 'R', 'U', 'D', 'B', 'F']

function getDirectionNotation(direction) {
    switch (direction) {
        case Direction.CLOCKWISE: return ''
        case Direction.ANTI_CLOCKWISE: return "'"
        case Direction.DOUBLE_MOVE: return '2'
    }
}

// array of { face, direction } objects
let lastMoves = []

function getNotation(face, direction) {
    const faceNotation = faceNames[face];
    const directionNotation = getDirectionNotation(direction)
    return `${faceNotation}${directionNotation}`
}

function addMoveToStack(face, direction) {
    lastMoves.push({ face, direction });
}

export function turn(face, direction) {
    addMoveToStack(face, direction)

    switch (direction) {
        case Direction.CLOCKWISE:
            rotate(face, true);
            break;
        case Direction.ANTI_CLOCKWISE:
            rotate(face, false);
            break;
        case Direction.DOUBLE_MOVE:
            rotate(face, true);
            rotate(face, true);
            break;
        default:
            throw new Error(`Unknown direction: ${direction}`)
    }
}

export function undo() {

}