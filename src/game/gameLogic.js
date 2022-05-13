import { EvaluationState } from "./constants";
import { getObjectFromNotation, mapDirectionToNumber, mapNumberToDirection } from "./utils";

/**
 * Evaluate a guess by returning it's evaluation array (which contains the strings 'correct', 'present', and 'absent')
 * 
 * Guess and solution must look like this: ["U", "F'", "D2"...]
 */
 export function evaluateGuess(guess, solution) {
    if (guess.length != solution.length) throw new Error("Guess length must be same as solution length");

    // create a map of move -> remaining occurences
    const remainingOccurencesOfMove = {};
    for (let element of solution) {
        if (element in remainingOccurencesOfMove) {
            remainingOccurencesOfMove[element]++;
        } else {
            remainingOccurencesOfMove[element] = 1;
        }
    }

    const result = new Array(solution.length).fill(EvaluationState.ABSENT);

    // Step 1: Get green values
    for (let i = 0; i < solution.length; i++) {
        if (guess[i] === solution[i]) {
            result[i] = EvaluationState.CORRECT
            remainingOccurencesOfMove[guess[i]]--;
        }
    }

    // Step 2: Get yellow values
    for (let i = 0; i < solution.length; i++) {
        if (result[i] !== EvaluationState.ABSENT) continue;

        const guessedMove = guess[i];
        if (remainingOccurencesOfMove[guessedMove] > 0) {
            result[i] = EvaluationState.PRESENT;
            remainingOccurencesOfMove[guess[i]]--;
        }
    }
    return result;
}

export function isNextMoveOverflowing(face, direction, lastMoves, gameConfig) {

    if (lastMoves.length === 0) {
        return false;
    }
    const last = getObjectFromNotation(lastMoves[lastMoves.length - 1])
    if (gameConfig.allowDoubleMoves && face === last.face) {
        // with double moves, all moves of the same face will combine
        return false;
    }

    if (!gameConfig.allowDoubleMoves && face === last.face && direction !== last.direction) {
        // without double moves, only moves in opposite directions will combine
        // since there are no double moves, all different moves will be opposite moves
        return false;
    }
    return lastMoves.length >= gameConfig.guessLength;

}

/**
 * Adds a new Move to the stack, possibly by combining it with the last one that existed
 * Does NOT check if the lastMoves array overflows! This should be checked elsewhere.
 * 
 * Return an array that indicates if the value was appended or the last element was modified/removed 
 * and the notation of the resulting move (if applicable)
 */
 export function addMoveToStack(notation, stack, allowDoubleMoves) {
    if (stack.length === 0) {
        stack.push(notation);
        return { status: "appended", notation };
    }

    const newMove = getObjectFromNotation(notation);
    const previousMoveNotation = stack[stack.length - 1];

    const previousMove = getObjectFromNotation(previousMoveNotation);
    if (previousMove.face !== newMove.face) {
        stack.push(notation);
        return { status: "appended", notation };
    }

    const directionValue = mapDirectionToNumber(newMove.direction) + mapDirectionToNumber(previousMove.direction);
    const resultingDirection = mapNumberToDirection(directionValue);

    if (resultingDirection === null) {
        stack.pop();
        return { status: "removed" };
    }

    if (allowDoubleMoves) {
        const resultingMove = getNotation(newMove.face, resultingDirection);
        stack.pop();
        stack.push(resultingMove);
        return { status: "modified", notation: resultingMove };
    } else {
        stack.push(notation);
        return { status: "appended", notation };
    }
}
