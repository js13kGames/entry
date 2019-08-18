/**
 * Handles updating the collision system, figuring out what collides,
 * and updateing sprites based on the collision results.
 * @param  {[type]} collisionSystem [description]
 * @param  {[type]} collisionResult [description]
 * @param  {[type]} ships           [description]
 * @return {[type]}                 [description]
 */
export function doCollision(collisionSystem, collisionResult, ships) {

    // Update the collision system
    collisionSystem.update();

    // Every ship against...
    var potentials = {};
    ships.forEach(ship => {
        // No collision-ing into things when you're rewinding
        if (ship.rewinding) {
            return;
        }
        potentials = ship.hitbox.potentials();
        for (const otherSprites of potentials) {
            if (ship.hitbox.collides(otherSprites, collisionResult)) {

                if (collisionResult.b.owner.type === 'bullet') {
                    // If you're (or ya bullets) not colliding with yourself
                    if (collisionResult.b.owner.owner === ship) {
                        return;
                    }
                    console.log(ship.name + " got shot by " +collisionResult.b.owner.name + " that belonged to " + collisionResult.b.owner.owner.name);
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
}
