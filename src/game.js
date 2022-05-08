import {rotate} from './cube/cubeOutput'

const faceNames = ['L', 'R', 'U', 'D', 'B', 'F']

export function turn(face, clockwise) {
    const faceName = faceNames[face];
    console.log(`${faceName}${clockwise ? "" : "'"}`)
    rotate(face, clockwise);
}