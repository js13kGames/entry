import { Sprite } from 'kontra';

const PI2 = Math.PI * 2;

export function createAsteroid(sprites) {
    let asteroid = Sprite({
        x: 100,
        y: 100,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        radius: 30,

        render() {
            this.context.strokeStyle = 'white';
            this.context.lineWidth = 2;
            this.context.beginPath();  // start drawing a shape
            this.context.arc(this.x, this.y, this.radius, 0, PI2);
            this.context.stroke();     // outline the circle
        }
    });

    sprites.push(asteroid);
}
