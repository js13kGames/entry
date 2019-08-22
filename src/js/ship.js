import { Sprite, keyPressed } from 'kontra';
import * as util from './utility';
import ships from './ships/import';
import { createBullet } from './bullet';
import { createShrapnel } from './shrapnel';

export class Ship extends Sprite.class {

    constructor(props) {
        super(props);

        // Default properties for all ships
        this.type = 'ship';
        this.turnRate = 4;
        this.locationHistory = [];
        this.maxSpeed = 3;
        this.rewindSpeed = 5; // E.g. rewind time 5* faster than realtime
        this.rewinding = 0;
        this.fireDt = 0;
        this.rewindDt = 0;
        this.rof = .25; // Fire 4x a second
        this.ror = 5 // Rewind once every 5 seconds
        this.scale = 2;
        this.mass = 4;
        this.thrust = 4;
        this.cs = props.collisionSystem;

        // Assign props from the ship type file e.g. 'diamondback', AND
        // overwrite with any weird props that were passed into new Ship(...)
        Object.assign(this, ships[props.shipType || 'tri'], props);

        this.lines.random = [];
        this.lines.body = this.lines.body || [];
        this.lines.detail = this.lines.detail || [];
        this.lines.thrust = this.lines.thrust || [];

        // Scale all the lines (except ship as that would * scale * scale)
        Object.keys(this.lines).forEach(lineType => {
            this.lines[lineType].forEach((line, i) => {
                line.forEach((v, i) => { line[i] *= this.scale });
            });
        });

        // Merge body & detail into 'ship' line array for doing fun effects etc
        this.lines.ship = this.lines.body.concat(this.lines.detail);

        // If the ship doesn't have a collision box defined, use it's body
        // Assumes that the body is a consecutive set of lines
        // (e.g. line end coords match the following line start coords)
        if (!this.lines.hitbox) {
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

        // Modify mass & thrust values defined in ship specs to make less crazy
        this.mass += 11;
        this.thrust += 11;
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
        if (this.fireDt < this.rof) {
            return false;
        }

        if (this.rewinding) {
            return false;
        }

        const cos = Math.cos(util.degToRad(this.rotation));
        const sin = Math.sin(util.degToRad(this.rotation));

        this.fireDt = 0;

        // Knockback (hass less effect for ships with greater mass)
        this.dx -= cos / this.mass;
        this.dy -= sin / this.mass;

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

    shipUpdate(sprites) {

        if (this.rewindDt < this.ror) {
            this.rewindDt += 1 / 60;
        }

        this.fireDt += 1 / 60;

        if (this.rewinding > 0) {
            this.rewinding = this.rewinding - this.rewindSpeed;

            // If something borked (can't go back that far?) cancel rewind
            if (!this.locationHistory[this.rewinding]) {
                this.rewinding = 0;
                return;
            }

            // More x and y coordinates "back in time"
            if (this.rewinding < this.locationHistory.length) {
                this.x = this.locationHistory[this.rewinding].x;
                this.y = this.locationHistory[this.rewinding].y;
            }

            // Last rewind update, lose 20% velocity
            if (this.rewinding === 0) {
                this.dx *= .8;
                this.dy *= .8;
            }

            return; // Don't do any other ship updating this game update
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
    }

    explode(sprites) {
        this.exploded = true;

        // Create new line sprites where the ship lines were
        this.lines.ship.forEach(line => {
            createShrapnel(line, this, sprites);
        });
    }

    render() {
        this.context.save();

        // Rotate
        this.context.translate(this.x, this.y);

        // Draw rewinding cooldown bar
        if (!this.rewinding && this.rewindDt < this.ror) {
            this.context.beginPath();
            this.context.strokeStyle = '#0ef';
            this.context.lineWidth = 2;
            this.context.moveTo(
                - this.rewindDt * 3,
                this.radius * this.scale + 4
            );
            this.context.lineTo(
                //this.ror * 3,
                this.rewindDt * 3,
                this.radius * this.scale + 4
            )
            this.context.stroke();
            this.context.closePath();
        }

        this.context.rotate(util.degToRad(this.rotation));

        // Draw
        this.context.strokeStyle = this.color;
        this.context.lineWidth = 2;
        this.context.beginPath();

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
        }

        this.context.strokeStyle = this.color;
        this.context.stroke();
        this.context.restore();
    }
}
