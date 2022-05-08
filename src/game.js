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

function inverseDirection(direction) {
    switch (direction) {
        case Direction.CLOCKWISE: return Direction.ANTI_CLOCKWISE;
        case Direction.ANTI_CLOCKWISE: return Direction.CLOCKWISE;
        case Direction.DOUBLE_MOVE: return Direction.DOUBLE_MOVE;
    }
}

function getNotation(face, direction) {
    const faceNotation = faceNames[face];
    const directionNotation = getDirectionNotation(direction)
    return `${faceNotation}${directionNotation}`
}

// array of { face, direction } objects
const lastMoves = []

function addMoveToStack(face, direction) {
    lastMoves.push({ face, direction });
}

export function turn(face, direction) {
    addMoveToStack(face, direction);
    rotate(face, direction);
}

export function undo() {
    if (lastMoves.length == 0) return;
    const lastMove = lastMoves.pop();
    const inversedDirection = inverseDirection(lastMove.direction)
    // rotate without adding move to stack
    rotate(lastMove.face, inversedDirection);
}