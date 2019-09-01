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

        if (ship.shield) {
            potentials = ship.shieldHitbox.potentials();

            for (const otherHitbox of potentials) {
                var otherSprite = otherHitbox.owner;

                if (ship.shieldHitbox.collides(otherHitbox, cResult)) {

                    if (otherSprite.type === 'pickup') {
                        otherSprite.applyTo(ship);
                        otherSprite.ttl = 0;
                    }

                    if (otherSprite.type === 'shrapnel') {
                        otherSprite.x += cResult.overlap * cResult.overlap_x;
                        otherSprite.y += cResult.overlap * cResult.overlap_y;
                    }

                    if (otherSprite.type === 'ship') {
                        // Can't collide into other ships that are rewinding
                        if (!otherSprite.rewinding) {
                            otherSprite.x += cResult.overlap * cResult.overlap_x;
                            otherSprite.y += cResult.overlap * cResult.overlap_y;
                        }
                    }

                    if (otherSprite.type === 'bullet') {
                        otherSprite.ttl = 0;

                        // If you're (or ya bullets) not colliding with yourself
                        if (otherSprite.owner !== ship &&
                            !ship.invuln &&
                            !ship.shieldDegrading) {
                            ship.shieldDegrading = 60;
                        }
                    }
                }
            } // end for

        } else {
            potentials = ship.hitbox.potentials();

            for (const otherHitbox of potentials) {
                var otherSprite = otherHitbox.owner;

                if (ship.hitbox.collides(otherHitbox, cResult)) {

                    if (otherSprite.type === 'pickup') {
                        otherSprite.applyTo(ship);
                        otherSprite.ttl = 0;
                    }

                    if (otherSprite.type === 'shrapnel') {
                        otherSprite.x += cResult.overlap * cResult.overlap_x;
                        otherSprite.y += cResult.overlap * cResult.overlap_y;
                    }

                    if (otherSprite.type === 'ship') {
                        // Can't collide into other ships that are rewinding
                        if (!otherSprite.rewinding) {
                            otherSprite.x += cResult.overlap * cResult.overlap_x;
                            otherSprite.y += cResult.overlap * cResult.overlap_y;
                        }

                        if (ship.rainbow) {
                            otherSprite.explode(sprites);
                        }
                    }

                    if (otherSprite.type === 'bullet') {
                        otherSprite.ttl = 0;

                        // If you're (or ya bullets) not colliding with yourself
                        if (otherSprite.owner !== ship &&
                            !ship.invuln) {
                            ship.explode(sprites);

                            if (otherSprite.owner.player) {
                                otherSprite.owner.player.scoreInc();
                            }

                            if (ship.player) {
                                ship.player.scoreDec();
                            }
                        }
                    }
                }
            } // end for
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

                if ((otherSprite.type === 'asteroid' ||
                     otherSprite.type === 'pickup') &&
                    !asteroid.bounced && !otherSprite.bounced) {
                        bounce(asteroid, otherSprite, cResult);
                }

                if (otherSprite.type === 'bullet') {
                    otherSprite.ttl = 0;
                    // Medium asteroids split into smaller ones
                    if (60 > asteroid.radius && asteroid.radius > 15) {

                        // Split the asteroid
                        for (var i = 0; i < 3; i++) {
                            createAsteroid({
                                x: asteroid.x,
                                y: asteroid.y,
                                radius: asteroid.radius / 1.8,
                                asteroids: asteroids,
                                sprites: sprites,
                                cs: collisionSystem
                            });
                        }
                        asteroid.ttl = 0
                    } else if (asteroid.radius > 60) {
                        // Asteroid is too big, don't explode but do make some
                        // particles
                    } else {
                        asteroid.explode(sprites);
                    }

                }

                if (otherSprite.type === 'ship') {

                    // Can't collide into ships that are rewinding
                    if (otherSprite.rewinding) {
                        return;
                    }

                    if (otherSprite.shield) {
                        if (!otherSprite.shieldDegrading) {
                            otherSprite.shieldDegrading = 60;
                        }
                        otherSprite.x += cResult.overlap * cResult.overlap_x;
                        otherSprite.y += cResult.overlap * cResult.overlap_y;
                        return;
                    }

                    if (otherSprite.rainbow) {
                        // Medium asteroids split into smaller ones
                        if (60 > asteroid.radius && asteroid.radius > 15) {

                            // Split the asteroid
                            for (var i = 0; i < 3; i++) {
                                createAsteroid({
                                    x: asteroid.x,
                                    y: asteroid.y,
                                    radius: asteroid.radius / 1.8,
                                    asteroids: asteroids,
                                    sprites: sprites,
                                    cs: collisionSystem
                                });
                            }
                            asteroid.ttl = 0
                        } else if (asteroid.radius > 60) {
                            otherSprite.x += cResult.overlap * cResult.overlap_x;
                            otherSprite.y += cResult.overlap * cResult.overlap_y;
                        } else {
                            asteroid.explode(sprites);
                        }
                        return;
                    }

                    if (otherSprite.invuln) {
                        otherSprite.x += cResult.overlap * cResult.overlap_x;
                        otherSprite.y += cResult.overlap * cResult.overlap_y;
                        return;
                    }

                    // The ship and asteroid aren't going fast enough to collide
                    if (Math.abs(asteroid.dx - otherSprite.dx) < .2 ||
                        Math.abs(asteroid.dy - otherSprite.dy) < .2) {
                        otherSprite.x += cResult.overlap * cResult.overlap_x;
                        otherSprite.y += cResult.overlap * cResult.overlap_y;
                        return;
                    }

                    otherSprite.explode(sprites);

                    if (otherSprite.player) {
                        otherSprite.player.scoreDec();
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

    sprites.forEach(sprite => {
        sprite.bounced = false;
    });
}
