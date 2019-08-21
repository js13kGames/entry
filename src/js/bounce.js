import { normalize, dotProduct } from './vector';

/**
 * Circle-circle physics collisions, taking into account
 * the two sprite's velocities and mass.
 * Modified the dx and dy properties of both circles.
 *
 * Based off pi2.js by Fahad Haidari
 * https://github.com/fahadhaidari/pi2.js/blob/master/pi2.js
 */
export function bounce(circle1, circle2, cResult) {

    // Separate the two sprites so they're not inside each other
    circle1.x -= (cResult.overlap * cResult.overlap_x) / 2;
    circle1.y -= (cResult.overlap * cResult.overlap_y) / 2;
    circle2.x += (cResult.overlap * cResult.overlap_x) / 2;
    circle2.y += (cResult.overlap * cResult.overlap_y) / 2;

    var interSecVec = normalize({x: cResult.overlap_x, y: cResult.overlap_y});

    // Vector of the tangent line intersection relative to intersection vec
    var tanVec = { x: -interSecVec.y, y: interSecVec.x };

    // Dot product between velocity vec of circles & the tangent vec
    var dpTan1 = dotProduct(circle1.velocity, tanVec);
    var dpTan2 = dotProduct(circle2.velocity, tanVec);

    // Dot product between the velocity vec of circles & the intersection vec
    var dpNorm1 = dotProduct(circle1.velocity, interSecVec);
    var dpNorm2 = dotProduct(circle2.velocity, interSecVec);

    // Conservation of momentum
    var m1 = (dpNorm1 * (circle1.mass - circle2.mass) + 2 * circle2.mass * dpNorm2) / (circle1.mass + circle2.mass);
    var m2 = (dpNorm2 * (circle2.mass - circle1.mass) + 2 * circle1.mass * dpNorm1) / (circle1.mass + circle2.mass);

    // Update velocities
    circle1.dx = tanVec.x * dpTan1 + interSecVec.x * m1;
    circle1.dy = tanVec.y * dpTan1 + interSecVec.y * m1;
    circle2.dx = tanVec.x * dpTan2 + interSecVec.x * m2;
    circle2.dy = tanVec.y * dpTan2 + interSecVec.y * m2;

    // Don't allow bounce again until after .bounceed is reset at end of update
    circle1.bounced = circle2.bounced = true;
}