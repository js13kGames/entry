import { Sprite } from 'kontra';
import * as util from './utility';

export class Ship extends Sprite.class {

    constructor(props) {
        super(props);
        this.locationHistory = [];
        this.rewindSpeed = 5; // E.g. rewind time 5* faster than realtime
        this.rewinding = 0;
    }

    fire(sprites) {
        const cos = Math.cos(util.degToRad(this.rotation));
        const sin = Math.sin(util.degToRad(this.rotation));

        this.dt = 0;
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

            // live 60 frames
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

    shipUpdate() {

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

        // Record current location into locations history
        this.locationHistory.push({ x: this.x, y: this.y});
        // Remove last update location from location history
        if (this.locationHistory.length > 90) {
            this.locationHistory.shift();
        }

        this.advance();

        // Max speed
        const magnitude = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        if (magnitude > 3) {
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
    }
}
