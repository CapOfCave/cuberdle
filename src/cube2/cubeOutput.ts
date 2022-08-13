import { Direction, faceNames } from '../game/constants';
import './cuber'
import './cuber.css'
import './globalCube'
import { getCurrentGame } from '../game/game';

export function rotate(face: number, direction: Direction, _?) {
    const ernoFace = faceNames[face];
    let twist;
    console.log("rotate", direction)
    switch(direction) {
        case Direction.CLOCKWISE: twist = new globalThis.ERNO.Twist(ernoFace.toUpperCase(), undefined,  true); break;
        case Direction.ANTI_CLOCKWISE: twist = new globalThis.ERNO.Twist(ernoFace.toLowerCase(), undefined, true); break;
        case Direction.DOUBLE_MOVE: twist = new globalThis.ERNO.Twist(ernoFace, 180, true); break;
    }
    cube.twist(twist)
}

export function reset() {
    console.log("reset not working");
}


function getSteps(twist) {
    const degreesDirectionalized = twist.wise === "clockwise" ? twist.degrees : -twist.degrees
    const degreesNormalized = ((degreesDirectionalized % 360) + 360) % 360;
    const clockwiseSteps = Math.round(degreesNormalized / 90);

    return clockwiseSteps;

}

function getDirection(steps: number): Direction {
    switch (steps) {
        case 1: return Direction.CLOCKWISE;
        case 2: return Direction.DOUBLE_MOVE;
        case 3: return Direction.ANTI_CLOCKWISE;
        default: throw new Error(`Invalid Steps: ${steps}`);
    }
}

function onTwistComlete (e) {
    const twist = e.detail.twist;
    if (twist.programmatically) {
        console.log("programmatic twist:", twist);
        return;
    }

    const steps = getSteps(twist);
    if (steps == 0) {
        console.log("not a turn!");
        return;
    }
    const direction = getDirection(steps);
    const face = faceNames.indexOf(twist.command.toUpperCase());
    

    //mx(faceIndex, Number(anchorIndex) + 1 + 2 * clockwisePossible), clockwisePossible ? Direction.CLOCKWISE : Direction.ANTI_CLOCKWISE
    getCurrentGame()?.turned(face, direction);

}

export function init() {
    window.addEventListener("load", () => {
        globalThis.cube = new globalThis.ERNO.Cube({
            hideInvisibleFaces: true,
        });
    
        var container = document.getElementById( 'preview' );
        container!.appendChild( globalThis.cube.domElement );
        globalThis.cube.addEventListener("onTwistComplete", onTwistComlete);
    })
}