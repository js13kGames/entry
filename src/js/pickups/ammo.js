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
        this.ctx.strokeStyle = '#0ef';

        this.ctx.rect(
            -1.35,
            -1.35,
            .45,
            .45
        );

        this.ctx.rect(
            .9,
            -1.35,
            .45,
            .45
        );

        this.ctx.rect(
            -1.35,
            .9,
            .45,
            .45
        );

        this.ctx.rect(
            .9,
            .9,
            .45,
            .45
        );

        this.ctx.stroke();
        this.ctx.restore();

        // Render the circle around the edge
        super.render(scale);
    }
}
