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
function animateRotation(face, cw) {
    const currentTime =  Date.now();
    var k = .3 * (face % 2 * 2 - 1) * (2 * cw - 1),
        qubes = Array(9).fill(pieces[face]).map(function (value, index) {
            return index ? getPieceBy(face, index / 2, index % 2) : value;
        });
    (function rotatePieces() {
        var passed = Date.now() - currentTime,
            style = 'rotate' + getAxis(face) + '(' + k * passed * (passed < 300) + 'deg)';
        qubes.forEach(function (piece) {
            piece.style.transform = piece.style.transform.replace(/rotate.\(\S+\)/, style);
        });
        if (passed >= 300)
            return swapPieces(face, 3 - 2 * cw);
        requestAnimationFrame(rotatePieces);
    })();
}

export function rotate(face, direction) {
    switch (direction) {
        case Direction.CLOCKWISE:
            animateRotation(face, true);
            break;
        case Direction.ANTI_CLOCKWISE:
            animateRotation(face, false);
            break;
        case Direction.DOUBLE_MOVE:
            animateRotation(face, true);
            animateRotation(face, true);
            break;
        default:
            throw new Error(`Unknown direction: ${direction}`)
    }
}




export function init () {
    window.addEventListener('load', assembleCube);
}
