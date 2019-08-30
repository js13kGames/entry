import { Sprite } from 'kontra';
import * as util from './utility';
import { createShrapnel } from './shrapnel';

function createLines(radius) {

    var pointNum =  Math.round(3 + Math.random() * 3 + Math.sqrt(radius));
    var lines = [];

    for (var i = 1; i <= pointNum; i++) {
        // Increase the (end) multiplier here for more wonky asteroids (inwards)
        // Decrease the (start) integer here for more-outside-ey hitboxes
        var rand = .99 + Math.random() * .1;
        var x = Math.cos((2 * Math.PI * i) / pointNum) * radius * rand;
        var y = Math.sin((2 * Math.PI * i) / pointNum) * radius * rand;

        // If not the first point
        if (i > 1) {
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

export function createAsteroid(props) {
    let asteroid = Sprite({
        type: 'asteroid',
        x: props.x,
        y: props.y,
        dx: props.dx !== undefined ? props.dx : Math.random() * 3 - 1.5,
        dy: props.dy !== undefined ? props.dy : Math.random() * 3 - 1.5,
        radius: props.radius,
        mass: props.mass || (Math.PI * props.radius * props.radius),
        lines: createLines(props.radius),
        cs: props.cs,
        color: '#fff',
        dr: props.dr || 0,

        render() {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.rotate(util.degToRad(this.rotation));
            this.context.strokeStyle = '#fff';
            this.context.lineWidth = 2;
            this.context.beginPath();
            this.lines.forEach((line, i) => {
                if (!i) {
                    // For the first line, start at it's start x,y
                    this.context.moveTo(line[0], line[1]);
                }
                // For every line, draw a line to it's end x,y
                this.context.lineTo(line[2], line[3]);
            });
            this.context.closePath();
            this.context.stroke();
            this.context.restore();
        },

        update() {
            this.rotation += this.dr;
            this.advance();
            this.hitbox.x = this.x;
            this.hitbox.y = this.y;
            this.hitbox.angle = util.degToRad(this.rotation);
        },

        explode(sprites) {
            this.exploded = true;

            // Create new line sprites where the ship lines were
            this.lines.forEach(line => {
                createShrapnel(line, this, sprites);
            });
        }
    });

    if (asteroid.radius > 50) {
        asteroid.hitboxLines = [];
        asteroid.lines.forEach((line, i) => {
            asteroid.hitboxLines.push([line[0], line[1]]);
        });
        asteroid.hitbox = props.cs.createPolygon(
            asteroid.x,
            asteroid.y,
            asteroid.hitboxLines
        );
    } else {
        asteroid.hitbox = props.cs.createCircle(props.x, props.y, props.radius);
    }

    asteroid.hitbox.owner = asteroid;

    props.sprites.push(asteroid);
    props.asteroids.push(asteroid);
}
