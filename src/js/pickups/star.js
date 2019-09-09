import { Pickup } from './pickup.js';
import * as util from '../utility';

export class StarPickup extends Pickup {

    constructor(props) {
        super(props);
    }

    update() {
        super.update();
    }

    applyTo(ship) {
        // Be all rainbowy & invincible for 8s
        ship.rainbow += 8;
        // Set max speed to be 1.5* while rainbow-y
        ship.maxSpeed = (ship.shipData.maxSpeed + 6) / 9;
    }

    render(scale) {
        this.context.save();
        this.context.scale(scale, scale);
        this.context.translate(this.x, this.y);
        this.context.rotate(util.degToRad(this.rotation));

        this.context.beginPath();
        this.context.strokeStyle = '#fff';

        // this.context.rect(
        //     Math.sqrt(Math.pow(this.radius * scale, 2) * .5),
        //     Math.sqrt(Math.pow(this.radius * scale, 2) * .5),
        //     Math.sqrt(Math.pow(this.radius * scale, 2) * .5) * -2,
        //     Math.sqrt(Math.pow(this.radius * scale, 2) * .5) * -2,
        // );
        // this.context.stroke();

        //this.context.beginPath();

        var rot = Math.PI / 2 * 3;
        var step = Math.PI / 5;

        this.context.moveTo(0, 0 - this.radius * .75);
        for (let i = 0; i < 5; i++) {
            this.context.lineTo(
                Math.cos(rot) * this.radius * .75,
                Math.sin(rot) * this.radius * .75
            );
            rot += step;

            this.context.lineTo(
                Math.cos(rot) * this.radius * .35,
                Math.sin(rot) * this.radius * .35
            );
            rot += step;
        }
        this.context.lineTo(0, 0 - this.radius * .75);

        this.context.closePath();
        this.context.stroke();
        this.context.restore();

        // Render the circle around the edge
        super.render(scale);
    }

}
