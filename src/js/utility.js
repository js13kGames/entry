
/**
 * Convert degrees to radians.
 * @param  {number} degrees rotation in degrees
 * @return {number}         rotation in radians
 */
export function degToRad(deg) {
    return deg * Math.PI / 180;
}

/**
 * Find the difference between two numbers
 * @param  {[type]} num1 [description]
 * @param  {[type]} num2 [description]
 * @return {[type]}      [description]
 */
export function diff(num1, num2){
    return (num1 > num2) ? num1 - num2 : num2 - num1
}
