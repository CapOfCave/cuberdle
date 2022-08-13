import { Direction, faceNames } from '../game/constants';
import './others/cuber'
import './cuber.css'
import './globalCube'

export function rotate(face: number, direction: Direction, _?) {

    console.log("rotate programmaticaly")
    const ernoFace = faceNames[face];
    let twist;
    switch(direction) {
        case Direction.CLOCKWISE: twist = new globalThis.ERNO.Twist(ernoFace.toUpperCase())
        case Direction.ANTI_CLOCKWISE: twist = new globalThis.ERNO.Twist(ernoFace.toLowerCase())
        case Direction.DOUBLE_MOVE: twist = new globalThis.ERNO.Twist(ernoFace, 180)
    }
    cube.twist(twist)
}

export function reset() {
    console.log("reset not working");
}


export function init() {

    window.addEventListener('load', () => {
        console.log("trying to init...")
        globalThis.cube = new globalThis.ERNO.Cube({
            hideInvisibleFaces: true,
        });
    
        var container = document.getElementById( 'preview' );
        console.log("found container", container)
        container!.appendChild( globalThis.cube.domElement );
        console.log("init complete");
    });
    

}