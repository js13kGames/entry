import { Sprite } from 'kontra';

function createLines(radius) {
    // circumference would be 2 * Math.PI * radius, but... we want
    // 2x circumference asteroids to have lines that are 2x the size ???
    var lineLenth = 2 * Math.PI * radius;
    var pointNum = Math.round(lineLenth / 10);
    var lines = [];

    for (var i = 0; i <= pointNum; i++) {
        var x = Math.cos((2 * Math.PI * i) / pointNum) * radius;
        var y = Math.sin((2 * Math.PI * i) / pointNum) * radius;

        // If not the first point
        if (i) {
            // Put the new x, y coords in the 3rd and 4th items in prev line
            lines[lines.length - 1].push(x, y);
        }

        lines.push([ x, y ]);

        // Last point
        if (i === pointNum) {
            // Put the 1st x, y coords in the 3rd and 4th items of current line
            lines[lines.length - 1].push([lines[0][0], lines[0][1]]);
        }
    }
    return lines;
}

export function createAsteroid(x, y, radius, asteroids, sprites, cs) {
    let asteroid = Sprite({
        type: 'asteroid',
        x: x,
        y: y,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        radius: radius || 25,
        mass: Math.PI * (radius || 25) * (radius || 25),
        hitbox: cs.createCircle(x, y, radius),
        lines: createLines(radius),

        render() {
            this.context.save();
            this.context.translate(this.x, this.y);
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 2;
            this.context.beginPath();  // start drawing a shape
            //this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.lines.forEach(line => {
                this.context.moveTo(line[0], line[1]);
                this.context.lineTo(line[2], line[3]);
            });
            this.context.stroke();     // outline the circle
            this.context.restore();
        },

        update() {
            this.advance();
            this.hitbox.x = this.x;
            this.hitbox.y = this.y;
        }
    });

    asteroid.hitbox.owner = asteroid;

    sprites.push(asteroid);
    asteroids.push(asteroid);
}
