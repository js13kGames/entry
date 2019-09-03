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
        this.context.translate(this.x * scale, this.y * scale);
        this.context.rotate(util.degToRad(this.rotation));

        this.context.beginPath();
        this.context.lineWidth = scale;
        this.context.strokeStyle = '#fff';

        this.context.rect(
            Math.sqrt(Math.pow(this.radius * scale, 2) * .4),
            Math.sqrt(Math.pow(this.radius * scale, 2) * .4),
            Math.sqrt(Math.pow(this.radius * scale, 2) * .4) * -2,
            Math.sqrt(Math.pow(this.radius * scale, 2) * .4) * -2,
        );
        this.context.stroke();

        this.context.beginPath();
        this.context.strokeStyle = '#0ef';

        this.context.rect(
            scale * -1.35,
            scale * -1.35,
            scale * .45,
            scale * .45
        );

        this.context.rect(
            scale * .9,
            scale * -1.35,
            scale * .45,
            scale * .45
        );

        this.context.rect(
            scale * -1.35,
            scale * .9,
            scale * .45,
            scale * .45
        );

        this.context.rect(
            scale * .9,
            scale * .9,
            scale * .45,
            scale * .45
        );

        this.context.stroke();
        this.context.restore();

        // Render the circle around the edge
        super.render(scale);
    }
}
