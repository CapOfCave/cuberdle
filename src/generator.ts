import { DirectionNotation, FaceNotation, Notation } from "./game/notation";

interface Dimension {
    id: string,
    faces: FaceNotation[],
}

const dimensions: Dimension[] = [
    {
        id: "x",
        faces: ["L", "R"],
    },
    {
        id: "y",
        faces: ["U", "D"],
    },
    {
        id: "z",
        faces: ["F", "B"],
    }
]

function randomElement<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getDirection(allowDoubleTurns: string, relativeDoubleMoveProbability: number): DirectionNotation {
    if (!allowDoubleTurns) {
        return randomElement(['', "'"]);
    }

    const directionsWithDoubleTurns: DirectionNotation[] = ['', "'", "2"];
    // get a random element of that array, but the last number has a probability factor of `relativeDoubleMoveProbability`
    const randomValue = Math.random() * (2 + relativeDoubleMoveProbability);
    const index = Math.min(Math.floor(randomValue), 2)
    return directionsWithDoubleTurns[index];
}

function generateFirstMove(allowDoubleTurns: string, relativeDoubleMoveProbability: number): { notation: Notation, dimension: Dimension } {
    let dimension = randomElement(dimensions);
    const faceNotation = randomElement(dimension.faces);
    const direction = getDirection(allowDoubleTurns, relativeDoubleMoveProbability);
    return {
        notation: `${faceNotation}${direction}`,
        dimension,
    }
}

function generateOtherMove(lastDimension: Dimension, allowDoubleTurns: string, relativeDoubleMoveProbability: number): { notation: Notation, dimension: Dimension } {
    let dimension = randomElement(dimensions.filter(dimension => dimension.id !== lastDimension.id));
    const faceNotation = randomElement(dimension.faces);
    const direction = getDirection(allowDoubleTurns, relativeDoubleMoveProbability);
    return {
        notation: `${faceNotation}${direction}`,
        dimension,
    }
}


export function generateScramble(turnCount: number, allowDoubleTurns: string, relativeDoubleMoveProbability: number = 1) {

    if (turnCount < 1) {
        throw new Error(`turnCount must be greater than 0, but was ${turnCount}`);
    }

    const turns: Notation[] = [];
    // first face is unrestricted

    let { notation, dimension } = generateFirstMove(allowDoubleTurns, relativeDoubleMoveProbability);

    turns.push(notation);
    for (let i = 1; i < turnCount; i++) {
        let {notation: newNotation, dimension: newDimension} = generateOtherMove(dimension, allowDoubleTurns, relativeDoubleMoveProbability);
        turns.push(newNotation);
        dimension = newDimension;
    }
    return turns;
}



