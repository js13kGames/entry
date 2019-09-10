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
    //var otherPlayers = ai.game.players.filter(p => p !== ai);

    // Currently the AI will only fight player 1 and look for pickup 1
    var player = game.players[0];
    var pickup = game.pickups[0];

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

    if (player.ship && player.ship.isAlive) {
        ai.distToPlayer = getDist(ai, player.ship);
    } else {
        ai.distToPlayer = null;
    }

    if (pickup) {
        ai.distToPickup = getDist(ai, pickup);
    } else {
        ai.distToPickup = null;
    }

    if (ai.distToPlayer !== null && ai.distToPickup !== null) {
        ai.target = ai.distToPlayer < ai.distToPickup ? player.ship : pickup;
    } else if (player.ship && player.ship.isAlive) {
        ai.target = player.ship;
    } else if (pickup) {
        ai.target = pickup;
    } else {
        ai.target = null;
    }

    if (!ai.target) {
        return;
    }

    // Get the angle to the target (player or pickup), but if the target
    // is rainbowy, get the angle away from. RUN AWAY!
    ai.angleToTarget = getAngle(ai, ai.target, !ai.target.rainbow);

    if (ai.angleToTarget < -.1) {
        ai.ship.turnRight();
    } else if (ai.angleToTarget > .1) {
        ai.ship.turnLeft();
    } else {
        // If the target is rainbowy, just run away,
        // or if we are, go TOWARDS target
        if (ai.target.rainbow || ai.ship.rainbow) {
            ai.ship.engineOn();
        // Otherwise...
        } else {
            // If target is nearby player, randomly-ish shoot and toggle engine
            if (ai.target === player.ship && ai.distToPlayer < 100) {
                if (Math.random() < .1) { ai.ship.fire(); }
                if (Math.random() < .01) { ai.ship.engineOff(); }
                if (Math.random() < .01) { ai.ship.engineOn(); }
            // Else target is power up, just go towards it
            } else {
                ai.ship.engineOn();
            }
        }
    }


    // if (Math.abs(ai.angleToTarget % (Math.PI * 2) - Math.PI ) < .01) {
    //     ai.ship.fire();
    // }

    // var playerDistances = otherPlayers.map((player) => {
    //     if (!player.ship.isAlive) {
    //         return null;
    //     }
    //     return Math.abs(vec.dotProduct(
    //         { x: ai.ship.x, y: ai.ship.y },
    //         { x: player.ship.x, y: player.ship.y }
    //     ));
    // });
    //
    // console.log(playerDistances);
}
