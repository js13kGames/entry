import { Pickup } from './pickup.js';
import * as util from '../utility';

export class AmmoPickup extends Pickup {

    constructor(props) {
        super(props);
    }

    update() {
        super.update();
    }

    applyTo(ship) {
        ship.ammoCurrent = ship.ammo * 2;
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
        this.context.strokeStyle = '#0ef';

        this.context.rect(
            -1.35,
            -1.35,
            .45,
            .45
        );

        this.context.rect(
            .9,
            -1.35,
            .45,
            .45
        );

        this.context.rect(
            -1.35,
            .9,
            .45,
            .45
        );

        this.context.rect(
            .9,
            .9,
            .45,
            .45
        );

        this.context.stroke();
        this.context.restore();

        // Render the circle around the edge
        super.render(scale);
    }
}
