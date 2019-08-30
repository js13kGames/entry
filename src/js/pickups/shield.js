import { Pickup } from './pickup.js';
import * as util from '../utility';

export class ShieldPickup extends Pickup {

    constructor(props) {
        super(props);
    }

    update() {
        super.update();
    }

    applyTo(ship) {
        ship.shield = 1;
    }

    render() {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(util.degToRad(this.rotation));

        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#fff';

        this.context.rect(
            Math.sqrt(Math.pow(this.radius * this.scale, 2) * .5),
            Math.sqrt(Math.pow(this.radius * this.scale, 2) * .5),
            Math.sqrt(Math.pow(this.radius * this.scale, 2) * .5) * -2,
            Math.sqrt(Math.pow(this.radius * this.scale, 2) * .5) * -2,
        );
        this.context.stroke();

        this.context.beginPath();

        // Scale is 2, otherwise would be ((this.radius * scale) / 2) - 1
        this.context.arc(0, 0, this.radius - 1, 0, 2 * Math.PI);

        this.context.stroke();
        this.context.restore();

        // Render the circle around the edge
        //super(props);
        super.render();
    }
}
