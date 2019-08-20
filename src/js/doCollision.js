import { createAsteroid } from './asteroid';

/**
 * Handles updating the collision system, figuring out what collides,
 * and updateing sprites based on the collision results.
 * @param  {[type]} collisionSystem [description]
 * @param  {[type]} collisionResult [description]
 * @param  {[type]} ships           [description]
 * @return {[type]}                 [description]
 */
export function doCollision(collisionSystem, collisionResult, ships, asteroids, sprites) {

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
            if (ship.hitbox.collides(otherSprites, collisionResult)) {

                if (collisionResult.b.owner.type === 'shrapnel') {
                    collisionResult.b.owner.x += collisionResult.overlap * collisionResult.overlap_x;
                    collisionResult.b.owner.y += collisionResult.overlap * collisionResult.overlap_y;
                }

                if (collisionResult.b.owner.type === 'bullet') {
                    // If you're (or ya bullets) not colliding with yourself
                    if (collisionResult.b.owner.owner === ship) {
                        return;
                    }
                    // The ship might have already exploded due to a collision
                    if (ship.exploded) {
                        return;
                    }
                    ship.explode(sprites);
                }

                if (collisionResult.b.owner.type === 'ship') {
                    // Can't collide into other ships that are rewinding
                    if (collisionResult.b.owner.rewinding) {
                        return;
                    }
                    ship.x -= collisionResult.overlap * collisionResult.overlap_x;
                    ship.y -= collisionResult.overlap * collisionResult.overlap_y;
                }
            }
        }
    });

    // Every asteroid
    asteroids.forEach(asteroid => {
        // If asteroid has already been killed this cs update, do nothing
        if (!asteroid.ttl) {
            return;
        }
        potentials = asteroid.hitbox.potentials();
        for (const others of potentials) {
            if (asteroid.hitbox.collides(others, collisionResult)) {
                if (collisionResult.b.owner.type === 'bullet') {
                    collisionResult.b.owner.ttl = 0;
                    asteroid.ttl = 0;

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
                if (collisionResult.b.owner.type === 'ship') {
                    // Can't collide into other ships that are rewinding
                    if (collisionResult.b.owner.rewinding) {
                        return;
                    }
                    collisionResult.b.owner.explode(sprites);
                }
                if (collisionResult.b.owner.type === 'shrapnel') {
                    collisionResult.b.owner.x += collisionResult.overlap * collisionResult.overlap_x;
                    collisionResult.b.owner.y += collisionResult.overlap * collisionResult.overlap_y;
                }
            }
        }
    });
}
