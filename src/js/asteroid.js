import { Sprite } from 'kontra';

export function createAsteroid(x, y, radius, asteroids, sprites, cs) {
    let asteroid = Sprite({
        type: 'asteroid',
        x: x,
        y: y,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        radius: radius || 25,
        hitbox: cs.createCircle(x, y, radius),

        render() {
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 2;
            this.context.beginPath();  // start drawing a shape
            this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.context.stroke();     // outline the circle
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
