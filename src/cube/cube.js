import './cube.scss'

// this code was written by a wizard
// I am trying to make sense of it

const colors = ['blue', 'green', 'white', 'yellow', 'orange', 'red'];
const pieces = document.getElementsByClassName('piece');

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

/**
 * Transforms the faces in a very twisted way
 * 
 * Example: When looking at bottom...
 *  - ... in direction 0, there is right
 *  - ... in direction 1, there is front
 *  - ... in direction 2, there is left
 *  - ... in direction 3, there is back
 * 
 * The direction seem weird, but are consistent with the directional anchors of the cube rotations
 * 
 * 
 * When looking at the cube, the directional values increase counter-clockwise 
 */

// Original Comment:
// "Returns j-th adjacent face of i-th face"
// i is a face index
// j is a direction?!
// the result is a face index
// i think mx literally means "magics"
function mx(i, j) {
    /**
     * Note: x | 0 <=> Math.floor(x)
     * 
     * 1st Part: 
     * 2, 4, 3, 5 depending on j % 4
     * 
     * 2nd Part: [-1 taken from 3rd part]
     * if i is even: (j % 4) * 2 + 3
     * else -1 
     * 
     * 3rd Part: add i
     * 
     * All 3 Parts are added
     * and than modulo-d by 6
     * 
     * 
     * 
     * 
     */
    return ([2, 4, 3, 5][j % 4 | 0] + i % 2 * ((j | 0) % 4 * 2 + 3) + 2 * (i / 2 | 0)) % 6;
}



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

export function turn(face, clockwise) {
    animateRotation(face, clockwise, Date.now());
}

// Animates rotation of the face (by clockwise if cw), and then swaps stickers
function animateRotation(face, cw, currentTime) {
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

// Events
function mousedown(md_e) {
    const startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number);
    const face = md_e.target.closest('.face');
    function mousemove(mm_e) {
        if (face) {
            const piece = face.parentNode;
            const faceIndex = Array.prototype.indexOf.call(piece.children, face);
            console.log(faceIndex)

            // move
            const selectedAnchor = document.elementFromPoint(mm_e.pageX, mm_e.pageY)
            // the anchorIndex maps to the turnDirection (but the mapping has not been discovered yet)
            var anchorIndex = selectedAnchor.dataset.anchorIndex;
            // selectedAnchor will be the anchor element upon leaving the current sticker
            // gid being 0 is not a problem - it's still truthy because it's a string ("0")
            if (anchorIndex && selectedAnchor.classList.contains('anchor')) {
                mouseup();

                // piece.children is a HTMLCollection, not an array, so it's missing some useful methods - we borrow those of Array
                // faceIncex according the FACE INDEX MAPPING described above
                const faceIndex = Array.prototype.indexOf.call(piece.children, face);

                // check if a specific face has children (=> A Sticker)
                // anchorIndex + 3: + 3 in anticlockwise-direction or -1 in clockwise-direction
                // If the clockwise next value of the target direction is a stickered face, that means it is to the right
                // => So the layer is turned clockwise (trust me)
                var clockwise = piece.children[mx(faceIndex, Number(anchorIndex) + 3)].hasChildNodes();


                // Get the turned face (which is NOT the face that was touched!)
                // If the turning direction is clockwise, choose the next face in clockwise direction 
                // If the turning direction is anti-clockwise, choose the previous one instead
                // Note that only faces are ever turned, and not layers. So M turns are impossible.
                turn(mx(faceIndex, Number(anchorIndex) + 1 + 2 * clockwise), clockwise);
            }
        } else {
            // no face selected => cube rotation
            pivot.style.transform = 'rotateX(' + (startXY[0] - (mm_e.pageY - md_e.pageY) / 2) + 'deg)' +
                'rotateY(' + (startXY[1] + (mm_e.pageX - md_e.pageX) / 2) + 'deg)';
        }
    }
    /**
     * Cleanup drag listeners and add the guide back to the top level element
     */
    function mouseup() {
        preview.appendChild(guide);
        scene.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        scene.addEventListener('mousedown', mousedown);
    }

    (face || document.body).appendChild(guide);
    scene.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    scene.removeEventListener('mousedown', mousedown);
}

document.ondragstart = function () { return false; }
window.addEventListener('load', assembleCube);
scene.addEventListener('mousedown', mousedown);