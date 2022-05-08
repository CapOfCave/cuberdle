
import { turn } from '../game/game'
import { Direction } from '../game/constants';
import { mx } from './cubeLib'

// Events
function mousedown(md_e) {
    const startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number);
    const face = md_e.target.closest('.face');
    function mousemove(mm_e) {
        if (face) {
            const piece = face.parentNode;

            // move
            const selectedAnchor = document.elementFromPoint(mm_e.clientX, mm_e.clientY)
            // the anchorIndex maps to the turnDirection (but the mapping has not been discovered yet)
            var anchorIndex = selectedAnchor?.dataset?.anchorIndex;
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
                turn(mx(faceIndex, Number(anchorIndex) + 1 + 2 * clockwise), clockwise ? Direction.CLOCKWISE : Direction.ANTI_CLOCKWISE);
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

export function init () {
    document.ondragstart = function () { return false; }
    scene.addEventListener('mousedown', mousedown);
}