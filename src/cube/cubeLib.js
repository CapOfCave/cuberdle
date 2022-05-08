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
export function mx(i, j) {
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