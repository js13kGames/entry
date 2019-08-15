import { init, Sprite, GameLoop, initKeys, keyPressed } from 'kontra';
import { Ship } from './ship.js';
import { createAsteroid } from './asteroid';

let { canvas } = init();

initKeys();

canvas.style = 'width:100%;background:#000';
canvas.height = 450;
canvas.width = 800;

const PI2 = Math.PI * 2;

let sprites = [];

for (var i = 0; i < 3; i++) {
    createAsteroid(sprites);
}

// helper function to convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

let ship = new Ship({
    x: 30,
    y: 30,
    width: 6,
    rotation: 0,
    dt: 0, // For time tracking
    color: 'yellow',

    update() {

        // Rotation
        if (keyPressed('left')) {
            this.rotation += -5;
        } else if (keyPressed('right')) {
            this.rotation += 5;
        }
        const cos = Math.cos(degreesToRadians(this.rotation));
        const sin = Math.sin(degreesToRadians(this.rotation));

        // Moving forward
        if (keyPressed('up')) {
            this.ddx = cos * .1;
            this.ddy = sin * .1;
        } else {
            this.ddx = this.ddy = 0;
        }

        this.shipUpdate(); // Calls this.advance() itself

        // Fire Bullets
        this.dt += 1/60;
        if (keyPressed('space') && this.dt > .25) {
            this.fire(sprites);
        }

        // Go back in time
        if (this.rewinding === 0 && keyPressed('down')) {
            this.rewinding = this.locationHistory.length;
        }
    }
})

sprites.push(ship);

let loop = GameLoop({  // create the main game loop
    update() { // update the game state
        sprites.map(sprite => {
            sprite.update();

            if (sprite.x > canvas.width) {
                sprite.x = 0;
            } else if (sprite.x < 0) {
                sprite.x = canvas.width;
            }
            if (sprite.y > canvas.height) {
                sprite.y = 0;
            } else if (sprite.y < 0) {
                sprite.y = canvas.height;
            }
        });

        sprites = sprites.filter(sprite => sprite.isAlive());
    },
    render() { // render the game state
        sprites.map(sprite => sprite.render());
    }
});

loop.start();    // start the game
