
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

export function normalise(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export function applyMaxSpeed(velocity, maxSpeed) {
    const magnitude = normalise(velocity);
    var [ dx, dy ] = [ velocity.x, velocity.y ];

    if (magnitude > maxSpeed) {
        dx = dx / magnitude * maxSpeed;
        dy = dy / magnitude * maxSpeed;
    }

    [ velocity.x, velocity.y ] = [ dx, dy ];
}

/**
 * Slows a ship (or whatever sprite) velocity down, with
 * heavier ships taking longer to slow. If the ships velocity
 * is above the maximum, it fixes it to that maximum value.
 *
 * Just modifies the velocity it's given rather than
 * returning anything, as that somehow saved me 7 bytes.
 * @param  {vector} velocity     [description]
 * @param  {Number} [mass=10]    [description]
 * @param  {Number} [maxSpeed=3] [description]
 */
export function slow(velocity, mass = 10, maxSpeed = 3) {
    const magnitude = normalise(velocity);
    const minSpeed = .01;
    var [ dx, dy ] = [ velocity.x, velocity.y ];

    if (magnitude > maxSpeed) {
        dx = dx / magnitude * maxSpeed;
        dy = dy / magnitude * maxSpeed;
    } else {
        dx = Math.abs(dx) > minSpeed ? dx * Math.min(.99, .83 + mass / 99) : 0;
        dy = Math.abs(dy) > minSpeed ? dy * Math.min(.99, .83 + mass / 99) : 0;
    }

    [ velocity.x, velocity.y ] = [ dx, dy ];
}

export function objValPrev(obj, current) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    let i = values.indexOf(current);

    if (--i < 0) {
        return obj[keys[keys.length - 1]];
    } else {
        return obj[keys[i]];
    }
}

export function objValNext(obj, current) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    let i = values.indexOf(current);

    if (i++ === keys.length - 1) {
        return obj[keys[0]];
    } else {
        return obj[keys[i]];
    }
}

export function objKeyPrev(obj, current) {
    let values = Object.values(obj);
    let keys = Object.keys(obj);
    let i = keys.indexOf(current);

    if (--i < 0) {
        return keys[keys.length - 1];
    } else {
        return keys[i];
    }
}

export function objKeyNext(obj, current) {
    let values = Object.values(obj);
    let keys = Object.keys(obj);
    let i = keys.indexOf(current);

    if (i++ === keys.length - 1) {
        return keys[0];
    } else {
        return keys[i];
    }
}

export function otherPlayerHasSameColor(players, player) {
    return players.some(p => p !== player && p.color === player.color);
}
