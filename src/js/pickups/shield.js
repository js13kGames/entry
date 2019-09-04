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
        ship.addShield();
    }

    render(scale) {
        this.context.save();
        this.context.scale(scale, scale);
        this.context.translate(this.x, this.y);
        this.context.rotate(util.degToRad(this.rotation));

        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.strokeStyle = '#fff';

        this.context.rect(
            Math.sqrt(Math.pow(this.radius, 2) * .4),
            Math.sqrt(Math.pow(this.radius, 2) * .4),
            Math.sqrt(Math.pow(this.radius, 2) * .4) * -2,
            Math.sqrt(Math.pow(this.radius, 2) * .4) * -2,
        );
        this.context.stroke();

        this.context.beginPath();

        this.context.arc(
            0,
            0,
            this.radius / 2 - 1,
            0,
            2 * Math.PI
        );

        this.context.stroke();
        this.context.restore();

        // Render the circle around the edge
        super.render(scale);
    }
}
