import { Direction } from '../game/constants';
import './cube.scss'
import { mx } from './cubeLib'

// this code was written by a wizard
// I am trying to make sense of it

/**
 * FACE INDEX MAPPING
 *  0: left
 *  1: right
 *  2: top
 *  3: bottom
 *  4: back
 *  5: front
 * 
 *  note that the default view shows orange, which is on the backside 
*/

const colors = ['orange', 'red', 'white', 'yellow', 'blue', 'green' ];
const pieces = document.getElementsByClassName('piece');

function getAxis(face) {
    return String.fromCharCode('X'.charCodeAt(0) + face / 2); // X, Y or Z
}

// Moves each of 26 pieces to their places, assigns IDs and attaches stickers
function assembleCube() {
    function moveto(face) {
        id = id + (1 << face);
        pieces[i].children[face].appendChild(document.createElement('div'))
            .setAttribute('class', 'sticker ' + colors[face]);
        return 'translate' + getAxis(face) + '(' + (face % 2 * 4 - 2) + 'em)';
    }
    for (var id, x, i = 0; id = 0, i < 26; i++) {
        x = mx(i, i % 18);
        pieces[i].style.transform = 'rotateX(0deg)' + moveto(i % 6) +
            (i > 5 ? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : '') : '');
        pieces[i].setAttribute('id', 'piece' + id);
    }
}

function getPieceBy(face, index, corner) {
    return document.getElementById('piece' +
        ((1 << face) + (1 << mx(face, index)) + (1 << mx(face, index + 1)) * corner));
}

// Swaps stickers of the face (by clockwise) stated times, thereby rotates the face
function swapPieces(face, times) {
    for (var i = 0; i < 6 * times; i++) {
        var piece1 = getPieceBy(face, i / 2, i % 2),
            piece2 = getPieceBy(face, i / 2 + 1, i % 2);
        for (var j = 0; j < 5; j++) {
            var sticker1 = piece1.children[j < 4 ? mx(face, j) : face].firstChild,
                sticker2 = piece2.children[j < 4 ? mx(face, j + 1) : face].firstChild,
                className = sticker1 ? sticker1.className : '';
            if (className)
                sticker1.className = sticker2.className,
                    sticker2.className = className;
        }
    }
}

// Animates rotation of the face (by clockwise if cw), and then swaps stickers
function animateRotation(face, cw, duration = 300) {
    const currentTime =  Date.now();

    // reach 90 degrees after DURATION milliseconds
    const animationSpeed = 90 / duration
    
    // negative if face is even xor direction is counter-clockwise
    const animationSign = (face % 2 * 2 - 1) * (2 * cw - 1)

    // get all relevant cubes that will be affected by this transformation
    const qubes = Array(9).fill(pieces[face]).map((value, index) => {
        return index ? getPieceBy(face, index / 2, index % 2) : value;
    });

    return new Promise((resolve, _reject) => {
        (function rotatePieces() {
            const passed = Date.now() - currentTime
            const style = 'rotate' + getAxis(face) + '(' + animationSign * animationSpeed * passed * (passed < duration) + 'deg)';
    
            qubes.forEach(function (piece) {
                piece.style.transform = piece.style.transform.replace(/rotate.\(\S+\)/, style);
            });
    
            if (passed >= duration) {
                swapPieces(face, 3 - 2 * cw);
                resolve();
                // ... and stop animation
                return;
            }
                
            requestAnimationFrame(rotatePieces);
        })();
    })

    
}

export function rotate(face, direction, skipAnimation = false) {
    switch (direction) {
        case Direction.CLOCKWISE:
            animateRotation(face, true, skipAnimation ? 1 : undefined);
            break;
        case Direction.ANTI_CLOCKWISE:
            animateRotation(face, false, skipAnimation ? 1 : undefined);
            break;
        case Direction.DOUBLE_MOVE:
            if (skipAnimation) {
                animateRotation(face, true, 1)
                animateRotation(face, true, 1)
            } else {
                animateRotation(face, true, 200)
                    .then(() => animateRotation(face, true, 200));
            }
           
            break;
        default:
            throw new Error(`Unknown direction: ${direction}`)
    }
}




export function init () {
    window.addEventListener('load', assembleCube);
}
