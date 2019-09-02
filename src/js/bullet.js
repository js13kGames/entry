import { Sprite } from 'kontra';
import * as util from './utility';

export function createBullet(parent) {

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

        // live 50 frames, just under 1s (1sh)
        ttl: 50,

        color: parent.color,
        hitbox: parent.game.cSystem.createPoint(parent.x, parent.y),

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

    parent.game.sprites.push(bullet);
}