import { Sprite, keyPressed } from 'kontra';
import * as util from './utility';
import * as shipStandard from './ships/standard.js'

var tack = {};

console.log(shipStandard);

export class Ship extends Sprite.class {

    constructor(props) {
        super(props);

        switch (props.shipType) {
            case 'tack'    :
                Object.assign(this, tack);
                break;
            case 'standard':
            default:
                Object.assign(this, shipStandard);
        }

        console.log(this.turnRate);

        this.locationHistory = [];
        this.rewindSpeed = 5; // E.g. rewind time 5* faster than realtime
        this.rewinding = 0;
        this.fireDt = 0;
        this.maxSpeed = props.maxSpeed || 3,
        this.rof = props.rof || .25, // 4x a second
        this.controls = props.controls || {
            'thrust': 'up',
            'fire': 'space',
            'left': 'left',
            'right': 'right',
            'rewind': 'down'
        }
    }

    fire(sprites) {

        // Can't shoot if rewinding
        if (this.rewinding) {
            return false;
        }

        const cos = Math.cos(util.degToRad(this.rotation));
        const sin = Math.sin(util.degToRad(this.rotation));

        this.fireDt = 0;
        this.dx -= cos * .7;
        this.dy -= sin * .7;

        let bullet = Sprite({
            type: 'bullet',

            // Start at tip of the triangle (To understand: magic no.)
            x: this.x + cos * 12,
            y: this.y + sin * 12,

            // Move bullet #x faster than the ship
            dx: this.dx + cos * 12,
            dy: this.dy + sin * 12,

            // live 60 frames (1s)
            ttl: 60,

            width: 3,
            height: 3,
            color: this.color
        });

        sprites.push(bullet);
    }

    render() {
        this.context.save();

        // Rotate
        this.context.translate(this.x, this.y);
        this.context.rotate(util.degToRad(this.rotation));

        // Draw
        this.context.strokeStyle = this.color;
        this.context.lineWidth = this.rewinding ? 1 : 2;
        this.context.beginPath();
        this.context.moveTo(-3, -5);
        this.context.lineTo(12, 0);
        this.context.lineTo(-3, 5);
        this.context.closePath();
        this.context.stroke();

        this.context.restore();
    }

    shipUpdate(sprites) {

        // Go back in time
        if (!this.rewinding && keyPressed(this.controls.rewind)) {
            this.rewinding = this.locationHistory.length;
        }

        this.fireDt += 1 / 60;

        if (keyPressed(this.controls.left)) {
            this.rotation -= 5;
        }
        if (keyPressed(this.controls.right)) {
            this.rotation += 5;
        }

        this.advance(); // Call the original update func

        if (this.rewinding > 0) {
            this.rewinding = this.rewinding - this.rewindSpeed;
            if (this.rewinding < this.locationHistory.length) {
                this.x = this.locationHistory[this.rewinding].x;
                this.y = this.locationHistory[this.rewinding].y;
            }

            // Last rewind update, lose 20% velocity
            if (this.rewinding === 0) {
                this.dx *= .8;
                this.dy *= .8;
            }

            return; // Don't do any other updating
        }

        const cos = Math.cos(util.degToRad(this.rotation));
        const sin = Math.sin(util.degToRad(this.rotation));

        // Moving forward
        if (keyPressed(this.controls.thrust)) {
            this.ddx = cos * .1;
            this.ddy = sin * .1;
        } else {
            this.ddx = this.ddy = 0;
        }

        // Record current location into locations history
        this.locationHistory.push({ x: this.x, y: this.y});
        // Remove last update location from location history
        if (this.locationHistory.length > 90) {
            this.locationHistory.shift();
        }

        // Cap speed
        const magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        if (magnitude > this.maxSpeed) {
            this.dx *= .95;
            this.dy *= .95;
        } else {
            if (Math.abs(this.dx) > .01) {
                this.dx *= .99;
            }
            if (Math.abs(this.dy) > .01) {
                this.dy *= .99;
            }
        }

        if (keyPressed(this.controls.fire) && this.fireDt > this.rof) {
            this.fire(sprites);
        }
    }
}
