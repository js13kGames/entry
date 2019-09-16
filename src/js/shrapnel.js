import { Sprite } from './sprite';
import * as util from './utility';

export function createShrapnel(line, parent, sprites) {

    const cos = Math.cos(util.degToRad(parent.rotation));
    const sin = Math.sin(util.degToRad(parent.rotation));

    let center = {
        x: (line[0] + line[2]) / 2,
        y: (line[1] + line[3]) / 2
    };

    let lineSprite = Sprite({
        type: 'shrapnel',
        x: parent.x + (center.x * cos - center.y * sin),
        y: parent.y + (center.y * cos + center.x * sin),
        rotation: parent.rotation,
        color: parent.color,
        p1: {
            x: line[0] - center.x,
            y: line[1] - center.y
        },
        p2: {
            x: line[2] - center.x,
            y: line[3] - center.y
        },

        hitbox: parent.game.cSystem.createPolygon(
            parent.x + (center.x * cos - center.y * sin),
            parent.y + (center.y * cos + center.x * sin),
            [
                [line[0] - center.x, line[1] - center.y],
                [line[2] - center.x, line[3] - center.y],
            ]
        ),

        // Modify these for more crazy "explosions"
        dx: parent.dx + Math.random() - .5,
        dy: parent.dy + Math.random() - .5,
        ttl: parent.type === 'ship' ? 120 + Math.random() * 60 // 2-3s
                                    : Math.random() * 60,
        dr: Math.random() * 20 - 10,

        update(dt) {
            this.dx *= .999;
            this.dy *= .999;
            this.rotation += this.dr;
            this.position = this.position.add(this.velocity, dt);
            this.ttl--;
            this.hitbox.x = this.x;
            this.hitbox.y = this.y;
            this.hitbox.angle = util.degToRad(this.rotation);
        },

        render(scale) {
            this.ctx.save();
            this.ctx.scale(scale, scale);
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(util.degToRad(this.rotation));

            this.ctx.beginPath();

            // Draw
            this.ctx.strokeStyle = this.color;
            this.ctx.moveTo(this.p1.x, this.p1.y);
            this.ctx.lineTo(this.p2.x, this.p2.y);

            this.ctx.stroke();
            this.ctx.restore();
        }
    });

    lineSprite.hitbox.owner = lineSprite;

    sprites.push(lineSprite);
}
