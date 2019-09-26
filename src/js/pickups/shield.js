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
        this.ctx.save();
        this.ctx.scale(scale, scale);
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(util.degToRad(this.rotation));

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#fff';

        this.ctx.rect(
            Math.sqrt(Math.pow(this.radius, 2) * .4),
            Math.sqrt(Math.pow(this.radius, 2) * .4),
            Math.sqrt(Math.pow(this.radius, 2) * .4) * -2,
            Math.sqrt(Math.pow(this.radius, 2) * .4) * -2,
        );
        this.ctx.stroke();

        this.ctx.beginPath();

        this.ctx.arc(
            0,
            0,
            this.radius / 2 - 1,
            0,
            2 * Math.PI
        );

        this.ctx.stroke();
        this.ctx.restore();

        // Render the circle around the edge
        super.render(scale);
    }
}
