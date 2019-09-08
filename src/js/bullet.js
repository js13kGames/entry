//import { Sprite } from 'kontra';
import { Sprite } from './sprite';
import * as util from './utility';

export function createBullet(parent) {

    const cos = Math.cos(util.degToRad(parent.rotation));
    const sin = Math.sin(util.degToRad(parent.rotation));

    let bullet = Sprite({
        type: 'bullet',
        parent: parent,

        // Start at tip of the triangle
        // Todo understand: magic no. Fix to "weapon mount" of some sort
        x: parent.x + cos * parent.radius,
        y: parent.y + sin * parent.radius,

        // Move bullet 9 units/s faster than the ship
        dx: parent.dx + cos * 9,
        dy: parent.dy + sin * 9,

        // live 50 frames, just under 1s (1sh)
        ttl: 50,

        color: parent.color,
        hitbox: parent.game.cSystem.createPoint(parent.x, parent.y),

        update(dt) {
            this.velocity = this.velocity.add(this.acceleration, dt);
            this.position = this.position.add(this.velocity, dt);
            this.ttl--;
            this.hitbox.x = this.x;
            this.hitbox.y = this.y;
        },

        render(scale) {
            this.context.save();
            this.context.scale(scale, scale);
            this.context.translate(this.x, this.y);

            this.context.fillStyle = this.color;
            this.context.beginPath();
            this.context.arc(
                0,
                0,
                1,
                0,
                2 * Math.PI
            );
            this.context.fill();
            this.context.restore();
        }
    });

    bullet.hitbox.owner = bullet;
    bullet.owner = parent;

    parent.game.sprites.push(bullet);
}