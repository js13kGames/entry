
/**
 * Convert degrees to radians.
 * @param  {number} degrees rotation in degrees
 * @return {number}         rotation in radians
 */
export function degToRad(deg) {
    return deg * Math.PI / 180;
}

export function dot(v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y);
}

export function angleBetween(v1, v2) {
    console.log("Doing angleBetween vectors:");
    console.log(v1);
    console.log(v2);
    console.log(Math.atan2(v2.x, v2.y) - Math.atan2(v1.x, v1.y));
    return Math.atan2(v2.x, v2.y) - Math.atan2(v1.x, v1.y);
}
