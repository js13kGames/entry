import * as util from './utility';
import * as vec from './vector';

function getDist(ai, target) {
    return Math.abs(vec.magnitude({
        x: ai.ship.x - target.x,
        y: ai.ship.y - target.y,
    }));
}

function getAngle(ai, target, inverse) {
    let angle = util.degToRad(ai.ship.rotation) - vec.dir({
        x: ai.ship.x - target.x,
        y: ai.ship.y - target.y
    }) + Math.PI;

    angle = (angle % (Math.PI * 2)) - Math.PI;

    // Eh I got that backwards? So flip it around
    if (inverse) {
        if (angle > 0) {
            angle -= Math.PI;
        } else {
            angle += Math.PI;
        }
    }

    return angle;
}

function maybeRewind(ai) {
    var maybeRewind = 0; // A % chance the AI will use rewind this update

    // Don't rewind if already rewinding
    if (ai.ship.rewiding) {
        return false;
    }

    // Don't rewind if it's still on cooldown
    if (ai.ship.rewindDt <= ai.ship.ror) {
        return false
    }

    // Rewind to get ammo back (none to at least full if possible)
    if (ai.ship.ammoCurrent < 1 && ai.ship.history[0].ammo >= ai.ship.ammo) {
        maybeRewind += 8;
    }

    // Rewing is more likely the less time is left on rainbow-star powerup
    //  - that way the AI is more likely to "extend" it's duration with rewind
    // Only does it is at least half way through rainbow-ing
    if (ai.ship.rainbow && ai.ship.rainbow < 4) {
        maybeRewind += 6;
    }

    if (Math.random() * 100 < maybeRewind) {
        ai.ship.rewind();
        return true;
    }
}

export function update(ai) {

    // Currently the AI will only fight player 1 and look for pickup 1
    var player = game.players[0].ship;
    var pickup = game.pickups[0];
    var distToPlayer, distToPickup, target, angleToTarget;

    if (!ai.ship || !ai.ship.isAlive || ai.game.over) {
        return;
    }

    if (maybeRewind(ai)) {
        return;
    }

    var avoidingMeteor = false;

    game.meteors.forEach((meteor, i) => {
        if (getDist(ai, meteor) > meteor.radius + 40) {
            return;
        }

        var angleToMeteor = getAngle(ai, meteor)

        // Avoid the big meteor in the middle when rainbowy,
        // but don't slow or turn much
        if (ai.ship.rainbow > 1 && i === 0) {
            avoidingMeteor = true;

            ai.ship.engineOn();
            if (angleToMeteor < -2) {
                ai.ship.turnRight();
            } else if (angleToMeteor > 2) {
                ai.ship.turnLeft();
            }

        // Avoid all meteots when not rainbowy (or not rainbowy for > 1s)
        } else if (ai.ship.rainbow < 1) {
            avoidingMeteor = true;

            if (angleToMeteor < -1) {
                ai.ship.turnRight();
                ai.ship.engineOff();
            } else if (angleToMeteor > 1) {
                ai.ship.turnLeft();
                ai.ship.engineOff();
            } else {
                ai.ship.engineOn();
            }
        }
        // Otherwise avoidingMeteor is still false
    });

    if (avoidingMeteor) {
        return;
    }

    if (player && player.isAlive) {
        distToPlayer = getDist(ai, player);
    } else {
        distToPlayer = null;
    }

    if (pickup) {
        distToPickup = getDist(ai, pickup);
    } else {
        distToPickup = null;
    }

    if (distToPlayer !== null && distToPickup !== null) {
        target = distToPlayer < distToPickup ? player : pickup;
    } else if (player && player.isAlive) {
        target = player;
    } else if (pickup) {
        target = pickup;
    } else {
        target = null;
    }

    if (!target) {
        return;
    }

    // Get the angle to the target (player or pickup), but if the target
    // is rainbowy, get the angle away from. RUN AWAY!
    angleToTarget = getAngle(ai, target, !target.rainbow);

    if (angleToTarget < -.1) {
        ai.ship.turnRight();
    } else if (angleToTarget > .1) {
        ai.ship.turnLeft();
    } else {
        // If the target is rainbowy, just run away,
        // or if we are, go TOWARDS target
        if (target.rainbow || ai.ship.rainbow) {
            ai.ship.engineOn();
        // Otherwise...
        } else {
            // If target is nearby player, randomly-ish shoot and toggle engine
            if (target === player && distToPlayer < 100) {
                if (Math.random() < .1) { ai.ship.fire(); }
                if (Math.random() < .01) { ai.ship.engineOff(); }
                if (Math.random() < .01) { ai.ship.engineOn(); }
            // Else target is power up, just go towards it
            } else {
                ai.ship.engineOn();
            }
        }
    }
}
