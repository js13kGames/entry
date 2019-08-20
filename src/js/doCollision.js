import { createAsteroid } from './asteroid';
import * as util from './utility';
import * as vec from './vector';

/**
 * Handles updating the collision system, figuring out what collides,
 * and updateing sprites based on the collision results.
 * @param  {[type]} collisionSystem [description]
 * @param  {[type]} cResult [description]
 * @param  {[type]} ships           [description]
 * @return {[type]}                 [description]
 */
export function doCollision(collisionSystem, cResult, ships, asteroids, sprites) {

    // A reuseable list of sprites that might be colliding
    var potentials = {};

    // Update the collision system
    collisionSystem.update();

    // Every ship against...
    ships.forEach(ship => {
        // No collision-ing into things when you're rewinding
        if (ship.rewinding) {
            return;
        }
        potentials = ship.hitbox.potentials();
        for (const otherSprites of potentials) {
            if (ship.hitbox.collides(otherSprites, cResult)) {

                if (cResult.b.owner.type === 'shrapnel') {
                    cResult.b.owner.x += cResult.overlap * cResult.overlap_x;
                    cResult.b.owner.y += cResult.overlap * cResult.overlap_y;
                }

                if (cResult.b.owner.type === 'bullet') {
                    // If you're (or ya bullets) not colliding with yourself
                    if (cResult.b.owner.owner === ship) {
                        return;
                    }
                    // The ship might have already exploded due to a collision
                    if (ship.exploded) {
                        return;
                    }
                    ship.explode(sprites);
                }

                if (cResult.b.owner.type === 'ship') {
                    // Can't collide into other ships that are rewinding
                    if (cResult.b.owner.rewinding) {
                        return;
                    }
                    ship.x -= cResult.overlap * cResult.overlap_x;
                    ship.y -= cResult.overlap * cResult.overlap_y;
                }
            }
        }
    });

    alreadyCollided = [];

    // Every asteroid
    asteroids.forEach(asteroid => {
        // If asteroid has already been killed this cs update, do nothing
        if (!asteroid.ttl) {
            return;
        }

        potentials = asteroid.hitbox.potentials();

        for (const otherHitbox of potentials) {

            var otherSprite = otherHitbox.owner;

            // Again, if asteroid, or thing it might collide with is
            // already dead, don't do anything
            if (!asteroid.ttl || !otherSprite.ttl) {
                return;
            }

            if (asteroid.hitbox.collides(otherHitbox, cResult)) {

                // Circle bouncing based off:
                // https://github.com/fahadhaidari/pi2.js/blob/master/pi2.js

                if (otherSprite.type === 'asteroid' && !asteroid.bounced && !otherSprite.bounced) {
                    // Move them outside of each other
                    // Also means they're not colliding anymore!
                    //console.log("Two asteroids collided, result:");
                    //console.log(cResult);

                    console.log("Two asteroids collided");

                // Separate the two sprites so they're not inside each other
                asteroid.x -= (cResult.overlap * cResult.overlap_x) / 2;
                asteroid.y -= (cResult.overlap * cResult.overlap_y) / 2;
                otherSprite.x += (cResult.overlap * cResult.overlap_x) / 2;
                otherSprite.y += (cResult.overlap * cResult.overlap_y) / 2;

                var interSecVec = vec.normalize({x: cResult.overlap_x, y: cResult.overlap_y});

                // The vector of the tangent line intersection relative
                // to the intersection vector (???)
                var tanVec = { x: -interSecVec.y, y: interSecVec.x };

                // Dot product between velocity vector of asteroid
                // and the tangent vector
                var dpTan1 = vec.dotProduct(asteroid.velocity, tanVec);

                // Dot product between ... of otherSprite ...
                var dpTan2 = vec.dotProduct(otherSprite.velocity, tanVec);

                // Dot product between the velocity vector of the asteroid
                // and the intersection vector
                var dpNorm1 = vec.dotProduct(asteroid.velocity, interSecVec);

                var dpNorm2 = vec.dotProduct(otherSprite.velocity, interSecVec);

                // Conservation of momentum
                var m1 = (dpNorm1 * (asteroid.mass - otherSprite.mass) + 2 * otherSprite.mass * dpNorm2) / (asteroid.mass + otherSprite.mass);
                var m2 = (dpNorm2 * (otherSprite.mass - asteroid.mass) + 2 * asteroid.mass * dpNorm1) / (asteroid.mass + otherSprite.mass);

                // Update velocities
                asteroid.dx = tanVec.x * dpTan1 + interSecVec.x * m1;
                asteroid.dy = tanVec.y * dpTan1 + interSecVec.y * m1;
                otherSprite.dx = tanVec.x * dpTan2 + interSecVec.x * m2;
                otherSprite.dy = tanVec.y * dpTan2 + interSecVec.y * m2;

                    // At least move them outside each other
                    // otherSprite.x += cResult.overlap * cResult.overlap_x;
                    // otherSprite.y += cResult.overlap * cResult.overlap_y;

                    // let normal = {
                    //     x: cResult.overlap_x,
                    //     y: cResult.overlap_y
                    // };
                    // console.log(normal);
                    //
                    // // Relative relocity
                    // let rv = {
                    //     x: otherSprite.dx - asteroid.dx,
                    //     y: otherSprite.dy - asteroid.dy
                    // };
                    // console.log(rv);
                    //
                    // // Relative velocity in terms of normal direction
                    // let velAlongNormal = util.dot(rv, normal);
                    // console.log(velAlongNormal);
                    //
                    // // Impulse scalar
                    // let j = -velAlongNormal;
                    // j /= 1 / asteroid.mass + 1 / otherSprite.mass;
                    // console.log(j);
                    //
                    // // Apply impulse
                    // let impulse = {
                    //     x: j * normal.x,
                    //     y: j * normal.y
                    // };
                    // console.log(impulse);
                    // asteroid.velocity.x -= (1 / asteroid.mass) * impulse.x;
                    // asteroid.velocity.y -= (1 / asteroid.mass) * impulse.y;
                    // otherSprite.velocity.x -= (1 / otherSprite.mass) * impulse.x;
                    // otherSprite.velocity.y -= (1 / otherSprite.mass) * impulse.y;

                    //console.log(util.angleBetween(asteroid.velocity, otherSprite.velocity));

                    // Make the two asteroids bounce away from eachother
                    // let dx = asteroid.dx;
                    // let dy = asteroid.dy;
                    // asteroid.dx = otherSprite.dx;
                    // asteroid.dy = otherSprite.dy;
                    // otherSprite.dx = dx;
                    // otherSprite.dy = dy;

                    asteroid.bounced = otherSprite.bounced = true;
                }

                if (otherSprite.type === 'bullet') {
                    otherSprite.ttl = 0;

                    // Split the asteroid if it's large enough
                    if (asteroid.radius > 10) {
                        for (var i = 0; i < 3; i++) {
                            createAsteroid(
                                asteroid.x,
                                asteroid.y,
                                asteroid.radius / 2.5,
                                asteroids,
                                sprites,
                                collisionSystem
                            );
                        }
                    }
                }
                if (otherSprite.type === 'ship') {
                    // Can't collide into other ships that are rewinding
                    if (otherSprite.rewinding) {
                        return;
                    }
                    otherSprite.explode(sprites);
                }
                if (otherSprite.type === 'shrapnel') {
                    otherSprite.x += cResult.overlap * cResult.overlap_x;
                    otherSprite.y += cResult.overlap * cResult.overlap_y;
                }
            }
        }
    });

    asteroids.forEach(asteroid => {
        asteroid.bounced = false;
    });
}
