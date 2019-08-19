import { Sprite } from 'kontra';
import * as util from './utility';

export function createBullet(parent, sprites) {

    const cos = Math.cos(util.degToRad(parent.rotation));
    const sin = Math.sin(util.degToRad(parent.rotation));

    let bullet = Sprite({
        name: 'bullet',
        type: 'bullet',
        parent: parent,

        // Start at tip of the triangle
        // Todo understand: magic no. Fix to "weapon mount" of some sort
        x: parent.x + cos * 16,
        y: parent.y + sin * 16,

        // Move bullet #x faster than the ship
        dx: parent.dx + cos * 12,
        dy: parent.dy + sin * 12,

        // live 60 frames (1s)
        ttl: 60,

        width: 24,
        height: 24,
        color: parent.color,
        hitbox: parent.cs.createPoint(parent.x, parent.y),

        update() {
            this.advance();
            this.hitbox.x = this.x;
            this.hitbox.y = this.y;
        },

        render() {
            this.context.fillStyle = this.color;
            this.context.beginPath();
            this.context.arc(this.x, this.y, 2, 0, 2 * Math.PI);
            this.context.fill();
        }
    });

    bullet.hitbox.owner = bullet;
    bullet.owner = parent;

    sprites.push(bullet);
}