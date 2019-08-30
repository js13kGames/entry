import { Sprite, keyPressed } from 'kontra';
import * as util from './utility';
import ships from './ships/import';
import { createBullet } from './bullet';
import { createShrapnel } from './shrapnel';

export class Ship extends Sprite.class {

    /**
     * Rotation, width, x, y, color, are all set automagically by Sprite
     * @param {[type]} props [description]
     */
    constructor(props) {
        super(props);

        // The stats & info for the ship loaded from /ships/*.js
        var shipData = JSON.parse(JSON.stringify(ships[props.shipType]));

        // Default properties for all ships
        this.ammoCurrent = shipData.ammo;
        this.fireDt = 0;
        this.lines = {};
        this.lines.random = [];
        this.locationHistory = [];
        this.rewindDt = 0;
        this.rewinding = 0;
        this.rewindSpeed = 5; // E.g. rewind time 5* faster than realtime
        this.scale = 2;
        this.type = 'ship';

        // Properties that could be overwritten when calling new Ship()
        this.maxSpeed = props.maxSpeed || shipData.maxSpeed;
        this.rof = props.rof || shipData.rof;
        this.ror = props.ror || shipData.ror;

        // Modify these values defined in shipData specs to make less crazy
        this.ammo = shipData.ammo;
        this.mass = shipData.mass + 11;
        this.radius = (shipData.radius + 1) * this.scale;
        this.rof = 1 / this.rof;
        this.thrust = shipData.thrust + 11;
        this.turnRate = (shipData.turnRate + 6) * .75;

        // Useful stuff to have references to
        this.cs = props.collisionSystem;
        this.player = props.player;

        // Ship "model" information
        this.lines.body = shipData.lines.body || [];
        this.lines.detail = shipData.lines.detail || [];
        this.lines.thrust = shipData.lines.thrust || [];
        this.lines.hitbox = shipData.lines.hitbox || [];

        // Scale all the lines of this ship. It'd be better to do this by
        // looping through with Object.keys, but that takes more bytes!
        // Note that this scales the shipData.lines as well!

        this.lines.body.forEach((line, i) => {
            line.forEach((v, i) => { line[i] *= this.scale });
        });

        this.lines.detail.forEach((line, i) => {
            line.forEach((v, i) => { line[i] *= this.scale });
        });

        this.lines.thrust.forEach((line, i) => {
            line.forEach((v, i) => { line[i] *= this.scale });
        });

        this.lines.hitbox.forEach((line, i) => {
            line.forEach((v, i) => { line[i] *= this.scale });
        });

        // Merge body & detail into 'ship' line array for doing fun effects etc
        this.lines.ship = this.lines.body.concat(this.lines.detail);

        // Hitbox related properties
        // If the ship doesn't have a collision box defined, use it's body
        // Assumes that the body is a consecutive set of lines
        // (e.g. line end coords match the following line start coords)
        if (!this.lines.hitbox.length) {
            this.lines.hitbox = [];
            this.lines.body.forEach(line => {
                this.lines.hitbox.push([line[0], line[1]]);
            });
        }
        this.hitbox = props.collisionSystem.createPolygon(
            this.x,
            this.y,
            this.lines.hitbox
        );
        this.hitbox.scale = this.scale;
        this.hitbox.owner = this;
    }

    addShield() {
        this.shield = Math.floor(this.shield + 1) || 1;
        this.shieldHitbox = this.cs.createCircle(
            this.x,
            this.y,
            this.radius + 4 * this.shield
        );
        this.shieldHitbox.owner = this;
    }

    removeShield() {
        this.shield = 0;
        this.shieldHitbox.remove();
    }

    /**
     * Pew pew a bullet out.
     *
     * Can't do it if:
     *  - Fired recently
     *  - Rewinding
     * @param  {[type]} sprites [description]
     * @return {[type]}         [description]
     */
    fire(sprites) {
        if (this.fireDt < this.rof ||
            this.ammoCurrent < 1 ||
            this.rewinding) {
            return false;
        }

        const cos = Math.cos(util.degToRad(this.rotation));
        const sin = Math.sin(util.degToRad(this.rotation));

        this.fireDt = 0;
        this.ammoCurrent--;

        // Knockback (hass less effect for ships with greater mass)
        this.dx -= cos / (this.mass / 4);
        this.dy -= sin / (this.mass / 4);

        createBullet(this, sprites);
    }

    turnLeft() {
        this.rotation -= this.turnRate;
    }

    turnRight() {
        this.rotation += this.turnRate;
    }

    /**
     * Push the ship forward. Takes into account the ships thrust & mass.
     *
     * Can't do it if:
     *  - Rewinding
     * TODO: Rocket engine noises
     * @return {[type]} [description]
     */
    engineOn() {
        if (this.rewinding) {
            return false;
        }

        const cos = Math.cos(util.degToRad(this.rotation));
        const sin = Math.sin(util.degToRad(this.rotation));

        // a = F / m (Newton's 2nd law of motion)
        this.ddx = cos * .1 * this.thrust / this.mass;
        this.ddy = sin * .1 * this.thrust / this.mass;
    }

    /**
     * Remove acceleration if the ship isn't thrusting this update
     * @return {[type]} [description]
     */
    engineOff() {
        this.ddx = this.ddy = 0;
    }

    /**
     * (Start going) back in time
     *
     * Can't be done if the ship already did it recently.
     * @return {[type]} [description]
     */
    rewind() {
        if (this.rewindDt <= this.ror) {
            return false;
        }

        this.rewindDt = 0;
        this.rewinding = this.locationHistory.length;
    }

    shipUpdate() {

        if (this.shieldDegrading) {
            this.shieldDegrading--;
            if (this.shieldDegrading === 0) {
                this.removeShield();
            }
        }

        if (this.rewindDt < this.ror) {
            this.rewindDt += 1 / 60;
        }

        this.fireDt += 1 / 60;

        if (this.invuln > 0) {
            this.invuln -= 1 / 60;
        } else {
            this.invuln = 0;
        }

        if (this.rewinding > 0) {
            this.rewinding = this.rewinding - this.rewindSpeed;

            // If something borked (can't go back that far?) cancel rewind
            if (!this.locationHistory[this.rewinding]) {
                this.rewinding = 0;
                return false;
            }

            // More x and y coordinates "back in time"
            if (this.rewinding < this.locationHistory.length) {
                this.x = this.locationHistory[this.rewinding].x;
                this.y = this.locationHistory[this.rewinding].y;
            }

            // Last rewind update, lose 20% velocity and be invulnerable .2s
            // (which is just long enough not to do the flashy flashy)
            //  - and get ammo back!
            if (this.rewinding === 0) {
                this.dx *= .8;
                this.dy *= .8;
                this.invuln = .2;
                this.ammoCurrent = this.ammo;
            }

            return true; // Don't do any other ship updating this game update
        }

        if (this.ammoCurrent < this.ammo) {
            this.ammoCurrent += (1 / 60) * .5;
        }

        this.velocity = this.velocity.add(this.acceleration);

        // Apply max speed cap & "drag" (pretend the ship is thrusting back)
        util.slow(this.velocity, this.mass, this.maxSpeed);

        this.position = this.position.add(this.velocity);

        // Record current location into locations history
        this.locationHistory.push({ x: this.x, y: this.y});
        // Remove last update location from location history
        if (this.locationHistory.length > 90) {
            this.locationHistory.shift();
        }

        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        this.hitbox.angle = util.degToRad(this.rotation);

        if (this.shieldHitbox) {
            this.shieldHitbox.x = this.x;
            this.shieldHitbox.y = this.y;
        }
    }

    explode(sprites) {
        this.exploded = true;

        // Create new line sprites where the ship lines were
        this.lines.ship.forEach(line => {
            createShrapnel(line, this, sprites);
        });
    }

    renderUI() {
        this.context.strokeStyle = '#0ef';
        this.context.lineWidth = 2;

        // Draw ammo
        var ammoAngle = .2 * Math.PI * 1 / this.ammo;
        var gap = .05; // Gap between segments in radians
        for (let i = 0; i < Math.floor(this.ammoCurrent); i++) {
            this.context.beginPath();
            this.context.arc(
                0,
                0,
                this.radius + 8,
                Math.PI - (.2 * Math.PI * 1) + ammoAngle * i * 2,
                Math.PI + (ammoAngle * 2 - gap) - (.2 * Math.PI * 1) + ammoAngle * i * 2
            );
            this.context.stroke();
        }

        // Draw rewind recharge
        this.context.beginPath();
        this.context.arc(
            0,
            0,
            this.radius + 8,
            -.2 * Math.PI * 1 / this.ror * this.rewindDt,
            +.2 * Math.PI * 1 / this.ror * this.rewindDt
        );

        this.context.stroke();
    }

    render() {
        this.context.save();

        // Rotate
        this.context.translate(this.x, this.y);

        // Draw rewinding cooldown bar and ammo
        this.renderUI();

        this.context.rotate(util.degToRad(this.rotation));

        // Draw
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 2;
        this.context.beginPath();

        if (this.invuln) {
            this.flashing = this.flashing || 0;
            this.flashing++;
            if (this.flashing > 15 && 30 > this.flashing) {
                this.context.lineWidth = 1;
            } else if (this.flashing > 30) {
                this.flashing = 0;
            }
        }

        // Draw circle around ship for debugging
        // this.context.beginPath();  // start drawing a shape
        // this.context.arc(0, 0, this.radius * this.scale + 3, 0, Math.PI * 2);
        // this.context.stroke();

        if (this.rewinding) {
            this.rewindFrame = this.rewindFrame || 1;
            if (this.rewindFrame === 1) {
                this.lines.random = [];
                this.lines.ship.forEach(line => {
                    this.lines.random.push([
                        line[0] * Math.random(),
                        line[1] * Math.random(),
                        line[2] * Math.random(),
                        line[3] * Math.random()
                    ]);
                });
            }
            this.rewindFrame = this.rewindFrame < 4 ? this.rewindFrame + 1 : 1;

            this.lines.random.forEach(line => {
                this.context.moveTo(line[0], line[1]);
                this.context.lineTo(line[2], line[3]);
            });

            this.context.stroke();

        } else {

            this.context.moveTo(
                this.lines.body[0][0],
                this.lines.body[0][1]
            );
            for (var i = 0; i < this.lines.body.length - 1; i++) {
                this.context.lineTo(
                    this.lines.body[i][2],
                    this.lines.body[i][3]
                );
            }
            this.context.closePath();

            this.lines.detail.forEach(line => {
                this.context.moveTo(line[0], line[1]);
                this.context.lineTo(line[2], line[3]);
            });

            if (this.ddx || this.ddy) {
                this.lines.thrust.forEach((line, i) => {
                    // If x,y of 1st point of new line match 2nd point of prev
                    if (i > 0 &&
                        this.lines.thrust[i - 1][2] === line[0] &&
                        this.lines.thrust[i - 1][3] === line[1]) {
                        // Draw line connected to previous
                        this.context.lineTo(line[2], line[3]);
                    } else {
                        // Draw line NOT connect to previous
                        this.context.moveTo(line[0], line[1]);
                        this.context.lineTo(line[2], line[3]);
                    }
                });
            }

            this.context.strokeStyle = this.color;
            this.context.stroke();

            if (this.shield === 1) {
                this.context.beginPath();
                this.context.arc(
                    0,
                    0,
                    this.radius + 4 * this.shield,
                    0,
                    2 * Math.PI
                );

                if (this.shieldDegrading) {
                    //console.log(this.shieldDegrading);
                    //console.log(Math.floor(this.shieldDegrading / 15) % 2);
                    if (Math.floor(this.shieldDegrading / 15) % 2) {
                        this.context.lineWidth = 1;
                    } else {
                        this.context.lineWidth = 2;
                    }
                }

                this.context.strokeStyle = '#fff';
                this.context.stroke();
            }
        }

        this.context.restore();
    }
}
