import { init, Sprite, GameLoop, initKeys, keyPressed } from 'kontra';
import { Ship } from './ship.js';
import { createAsteroid } from './asteroid';

let { canvas } = init();

initKeys();

canvas.style = 'width:100%;background:#000';
canvas.height = 450;
canvas.width = 800;

// Testing making canvas px match display px rather than scaling
// var width = window.getComputedStyle(canvas).getPropertyValue('width').replace('px', '');
// console.log(width);
// var height = width / 16 * 9;
// canvas.height = height;
// canvas.width = width;

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
    shipType: 'tri',
    controls: 'arrows',

    update() {
        this.shipUpdate(sprites); // Calls this.advance() itself
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
