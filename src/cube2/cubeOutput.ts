import { Direction, faceNames } from '../game/constants';
import './cuber'
import './cuber.css'
import './globalCube'
import { getCurrentGame } from '../game/game';

export function rotate(face: number, direction: Direction, skipAnimation = false) {
    const ernoFace = faceNames[face];
    let twist;
    switch(direction) {
        case Direction.CLOCKWISE: twist = new globalThis.ERNO.Twist(ernoFace.toUpperCase(), undefined, true, skipAnimation); break;
        case Direction.ANTI_CLOCKWISE: twist = new globalThis.ERNO.Twist(ernoFace.toLowerCase(), undefined, true, skipAnimation); break;
        case Direction.DOUBLE_MOVE: twist = new globalThis.ERNO.Twist(ernoFace, 180, true, skipAnimation); break;
    }
    cube.twist(twist)
}

export function reset() {
    console.log("reset not working");
}


function getSteps(twist) {
    const degrees = twist.degrees ?? 90;
    const degreesDirectionalized = twist.wise === "clockwise" ? degrees : -degrees
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
        return;
    }

    const steps = getSteps(twist);
    if (steps == 0) {
        return;
    }
    const direction = getDirection(steps);
    const face = faceNames.indexOf(twist.command.toUpperCase());
    

    getCurrentGame()?.turned(face, direction);

}

export function init() {
    window.addEventListener("load", () => {
        globalThis.cube = new globalThis.ERNO.Cube({
            hideInvisibleFaces: true,
            paused: true
        });
    
        var container = document.getElementById( 'preview' );
        container!.appendChild( globalThis.cube.domElement );
        globalThis.cube.addEventListener("onTwistComplete", onTwistComlete);
    })
}

export function setPaused(paused) {
    cube.paused = paused;
}