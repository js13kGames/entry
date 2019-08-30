import { Sprite } from 'kontra';
import * as util from '../utility';

export class Pickup extends Sprite.class {

    /**
     * Rotation, width, x, y, color, are all set automagically by Sprite
     * @param {[type]} props [description]
     */
    constructor(props) {
        super(props);
        this.color = props.color || '#fff';
        this.type = 'pickup';
        this.scale = 2;
        this.radius = 5;
        this.mass = 200;
        this.x = props.x;
        this.y = props.y;
        this.dx = props.dx !== undefined ? props.dx : Math.random() - .5;
        this.dy = props.dy !== undefined ? props.dy : Math.random() - .5;
        this.dr = Math.random() < .5 ? -1 : 1;
        this.hitbox = props.cs.createCircle(props.x, props.y, this.radius * this.scale);
        this.hitbox.owner = this;
        this.colorCounter = 0;
    }

    update() {
        this.rotation += this.dr;
        this.advance();
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        // Every 10 frames change to a random color
        if (this.colorCounter % 10) {
            this.color = 'hsl(' + this.colorCounter + ', 100%, 60%)';
        }
        this.colorCounter++;
    }

    render() {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(util.degToRad(this.rotation));

        // Draw
        this.context.strokeStyle = this.color;

        this.context.lineWidth = 2;
        this.context.beginPath();

        this.context.arc(0, 0, this.radius * this.scale, 0, 2 * Math.PI);
        this.context.stroke();

        this.context.restore();
    }

}
