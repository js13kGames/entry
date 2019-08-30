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
        this.context.strokeStyle = '#0ef';

        this.context.rect(
            this.scale * -1.5,
            this.scale * -1.5,
            this.scale * .5,
            this.scale * .5
        );

        this.context.rect(
            this.scale *  1,
            this.scale * -1.5,
            this.scale * .5,
            this.scale * .5
        );

        this.context.rect(
            this.scale * -1.5,
            this.scale *  1,
            this.scale * .5,
            this.scale * .5
        );

        this.context.rect(
            this.scale *  1,
            this.scale *  1,
            this.scale * .5,
            this.scale * .5
        );

        this.context.stroke();
        this.context.restore();

        // Render the circle around the edge
        //super(props);
        super.render();
    }

}
