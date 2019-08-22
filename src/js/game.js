import { init, Sprite, GameLoop, initKeys, keyPressed } from 'kontra';
import { Collisions } from 'collisions';
import { doCollision } from './doCollision';
import { Ship } from './ship.js';
import { Player } from './player.js';
import { createAsteroid } from './asteroid';

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
    color: 'red',
    shipType: 'coback',
    controls: 'arrows',
    sprites: sprites,
    cs: collisionSystem
});

players.push(player1);
player1.spawn(ships, sprites);

let loop = GameLoop({  // create the main game loop
    update() { // update the game state
        players.forEach(player => {
            player.update();
        });

        console.log(sprites[sprites.length - 1].name);

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
            if (sprite.type === 'bullet') {
                console.log("there's a bullet");
            }
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
            if (player.ship.exploded) {
                player.ship = {};
            }
        });
    },
    render() {
        sprites.map(sprite => sprite.render());

        // Render debug collision stuff
        // context.strokeStyle = '#0F0';
        // context.beginPath();
        // collisionSystem.draw(context);
        // context.stroke();
    }
});

loop.start();    // start the game
