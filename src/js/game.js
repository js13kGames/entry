import { init, Sprite, GameLoop, initKeys, keyPressed } from 'kontra';
import { Collisions } from 'collisions';
import { doCollision } from './doCollision';
import { Ship } from './ship.js';
import { Player } from './player.js';
import { createAsteroid } from './asteroid';
import { renderText } from './text';

// Kontra init canvas
let { canvas, context } = init();

// Create the collision system
const collisionSystem = new Collisions();

// Create a Result object for collecting information about the collisions
const collisionResult = collisionSystem.createResult();

// Kontra init keyboard stuff
initKeys();

canvas.style = 'width:100%;background:#000';
canvas.height = 350;
canvas.width = 800;

// Testing making canvas px match display px rather than scaling
// var width = window.getComputedStyle(canvas).getPropertyValue('width').replace('px', '');
// console.log(width);
// var height = width / 16 * 9;
// canvas.height = height;
// canvas.width = width;

let sprites = [];
let ships = [];
let asteroids = [];
let players = [];

for (var i = 0; i < 4; i++) {
    createAsteroid(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        36,
        asteroids,
        sprites,
        collisionSystem
    );
}

let player1 = new Player({
    color: 'yellow',
    shipType: 'tri',
    controls: 'arrows',
    sprites: sprites,
    cs: collisionSystem,
    context: context
});
players.push(player1);

let player2 = new Player({
    color: 'red',
    shipType: 'coback',
    controls: 'wasd',
    sprites: sprites,
    cs: collisionSystem,
    context: context
});
players.push(player2);

players.forEach(player => {
    player.spawn(ships, sprites);
});

let loop = GameLoop({  // create the main game loop
    update() { // update the game state
        players.forEach(player => {
            player.update(sprites);
        });

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

        doCollision(collisionSystem, collisionResult, ships, asteroids, sprites);

        // Remove dead & exploded sprite's hitboxes from the collision system
        sprites.forEach(sprite => {
            if (!sprite.isAlive() || sprite.exploded) {
                sprite.hitbox && sprite.hitbox.remove();
            }
        });

        // Remove dead sprites from the sprites list
        sprites = sprites.filter(sprite => sprite.isAlive());

        // Remove exploded ships from the both lists & the player
        sprites = sprites.filter(sprite => !sprite.exploded);
        ships = ships.filter(ship => !ship.exploded);
        players.forEach(player => {
            if (player.ship.exploded && player.ship.ttl) {
                player.ship = {};
                setTimeout(() => {
                    player.respawn(ships, sprites);
                }, 3000);
            }

            // Check if someone has won!
            // TODO: See if it's likely for 2 ships to get to 10 in same update
            if (player.score === 10) {
                // Pause the game and put win screen up?
            }
        });
    },
    render() {
        // Render all the sprites
        sprites.map(sprite => sprite.render());

        // Render the player scores
        players.map((player, i) => player.renderScore(i));

        // Render debug collision stuff
        // context.strokeStyle = '#0F0';
        // context.beginPath();
        // collisionSystem.draw(context);
        // context.stroke();
    }
});

loop.start();    // start the game
