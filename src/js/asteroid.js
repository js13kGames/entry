import { Sprite } from 'kontra';
import { createShrapnel } from './shrapnel';

function createLines(radius) {

    var pointNum =  Math.round(3 + Math.random() * 3 + Math.sqrt(radius));
    var lines = [];

    for (var i = 0; i <= pointNum; i++) {
        // Increase the (end) multiplier here for more wonky asteroids (inwards)
        // Decrease the (start) integer here for more-outside-ey hitboxes
        var rand = .99 + Math.random() * .1;
        var x = Math.cos((2 * Math.PI * i) / pointNum) * radius * rand;
        var y = Math.sin((2 * Math.PI * i) / pointNum) * radius * rand;

        // If not the first point
        if (i) {
            // Put the new x, y coords in the 3rd and 4th items in prev line
            lines[lines.length - 1].push(x, y);
        }

        lines.push([ x, y ]);

        // Last point
        if (i === pointNum) {
            // Put the 1st x, y coords in the 3rd and 4th items of current line
            lines[lines.length - 1].push(lines[0][0], lines[0][1]);
        }
    }
    return lines;
}

export function createAsteroid(x, y, radius, asteroids, sprites, cs) {
    let asteroid = Sprite({
        type: 'asteroid',
        x: x,
        y: y,
        dx: Math.random() * 3 - 1.5,
        dy: Math.random() * 3 - 1.5,
        radius: radius || 25,
        mass: Math.PI * (radius || 25) * (radius || 25),
        hitbox: cs.createCircle(x, y, radius),
        lines: createLines(radius),
        cs: cs,
        color: '#fff',

        render() {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.strokeStyle = '#fff';
            this.context.lineWidth = 2;
            this.context.beginPath();
            this.lines.forEach((line, i) => {
                if (!i) {
                    this.context.moveTo(line[2], line[3]);
                } else {
                    this.context.lineTo(line[0], line[1]);
                }
            });
            this.context.closePath();
            this.context.stroke();
            this.context.restore();
        },

        update() {
            this.advance();
            this.hitbox.x = this.x;
            this.hitbox.y = this.y;
        },

        explode(sprites) {
            this.exploded = true;

            // Create new line sprites where the ship lines were
            this.lines.forEach(line => {
                createShrapnel(line, this, sprites);
            });
        }
    });

    asteroid.hitbox.owner = asteroid;

    sprites.push(asteroid);
    asteroids.push(asteroid);
}
