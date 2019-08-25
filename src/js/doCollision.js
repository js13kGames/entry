import { createAsteroid } from './asteroid';
import { bounce } from './bounce';
import * as util from './utility';

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

                    if (ship.invuln) {
                        ship.x -= cResult.overlap * cResult.overlap_x;
                        ship.y -= cResult.overlap * cResult.overlap_y;
                        return;
                    }

                    ship.explode(sprites);

                    if (cResult.b.owner.owner.player) {
                        cResult.b.owner.owner.player.scoreInc();
                    }

                    if (ship.player) {
                        ship.player.scoreDec();
                    }
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

                if (otherSprite.type === 'asteroid' &&
                    !asteroid.bounced && !otherSprite.bounced) {
                        bounce(asteroid, otherSprite, cResult);
                }

                if (otherSprite.type === 'bullet') {
                    otherSprite.ttl = asteroid.ttl = 0;
                    // Medium asteroids split into smaller ones
                    if (asteroid.radius > 15) {

                        // Split the asteroid
                        for (var i = 0; i < 3; i++) {
                            createAsteroid(
                                asteroid.x,
                                asteroid.y,
                                asteroid.radius / 1.8,
                                asteroids,
                                sprites,
                                collisionSystem
                            );
                        }
                    } else {
                        asteroid.explode(sprites);

                        if (otherSprite.owner.player) {
                            otherSprite.owner.player.scoreInc();
                        }
                    }

                }

                if (otherSprite.type === 'ship') {
                    // Can't collide into ships that are rewinding
                    if (!otherSprite.rewinding) {

                        if (otherSprite.invuln) {
                            otherSprite.x += cResult.overlap * cResult.overlap_x;
                            otherSprite.y += cResult.overlap * cResult.overlap_y;
                            return;
                        }

                        otherSprite.explode(sprites);

                        if (otherSprite.player) {
                            otherSprite.player.scoreDec();
                        }
                    }
                }

                if (otherSprite.type === 'shrapnel') {
                    // Push the shrapnel out the way
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
