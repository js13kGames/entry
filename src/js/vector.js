
export function dir(vec) {
    return Math.atan2(vec.y, vec.x);
}

export function magnitude(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export function normalize(vec) {
    const mag = magnitude(vec);
    return { x: vec.x / mag, y: vec.y / mag };
}

export function multiply(vec, val) {
    return { x: vec *= val, y: vec *= val };
}

export function dotProduct(vec1, vec2) {
    return vec1.x * vec2.x + vec1.y * vec2.y;
}
