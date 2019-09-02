import { init, Sprite, GameLoop, initKeys, keyPressed } from 'kontra';
import { Collisions } from 'collisions';
import { doCollisions } from './doCollisions';
import { initGamepads, pollGamepads, buttonPressed, axisValue } from './gamepad';
import { Ship } from './ship.js';
import { AmmoPickup } from './pickups/ammo.js';
import { ShieldPickup } from './pickups/shield.js';
import { StarPickup } from './pickups/star.js';
import { Player } from './player.js';
import { createMeteor } from './meteor';
import { renderText } from './text';


// Kontra init canvas
let { canvas, context } = init();

// Kontra init keyboard stuff
initKeys();

// Init gamepad event listeners n stuff
initGamepads();

canvas.style = 'width:100%;background:#000';
canvas.height = 720;
canvas.width = 1281; // Fixes scrollbars on my laptop when fullscreen sigh

// Testing making canvas px match display px rather than scaling
// var width = window.getComputedStyle(canvas).getPropertyValue('width').replace('px', '');
// console.log(width);
// var height = width / 16 * 9;
// canvas.height = height;
// canvas.width = width;

const game = {
    meteors: [],
    pickups: [],
    players: [],
    sprites: []
};

// Create new collision system & collision result object
game.cSystem = new Collisions();
game.cResult = game.cSystem.createResult();

// Big asteroid in the middle (dioretsa)
createMeteor({
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: Math.min(canvas.width / 4, canvas.height / 4),
    mass: 100000,
    dx: 0,
    dy: 0,
    dr: .1,
    game: game
});

for (var i = 0; i < 1; i++) {
    createMeteor({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 36,
        game: game
    });
}

// let pickup1 = new AmmoPickup({
//     x: Math.random() * canvas.width,
//     y: Math.random() * canvas.height,
//     game: game
// });
// game.sprites.push(pickup1);
// game.pickups.push(pickup1);
//
// let pickup2 = new ShieldPickup({
//     x: Math.random() * canvas.width,
//     y: Math.random() * canvas.height,
//     game: game
// });
// game.sprites.push(pickup2);

// let pickup3 = new StarPickup({
//     x: Math.random() * canvas.width,
//     y: Math.random() * canvas.height,
//     game: game
// });
// game.sprites.push(pickup3);

let player1 = new Player({
    color: 'yellow',
    shipType: 'tri',
    controls: 'arrows',
    context: context,
    game: game
});
game.players.push(player1);

let player2 = new Player({
    color: '#f11',
    shipType: 'coback',
    controls: 'gamepad',
    context: context,
    game: game
});
game.players.push(player2);

game.players.forEach(player => {
    player.spawn();
});

let loop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads();

        game.players.forEach(player => {
            player.update();
        });

        game.sprites.map(sprite => {
            sprite.update();

            if (sprite.type !== 'bullet') {
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
            }
        });

        doCollisions(game);

        // Remove dead & exploded sprite's hitboxes from the collision system
        game.sprites.forEach(sprite => {
            if (!sprite.isAlive() || sprite.exploded) {
                sprite.hitbox && sprite.hitbox.remove();
            }
        });

        // Remove dead sprites from the sprites list
        game.sprites = game.sprites.filter(sprite => sprite.isAlive());

        game.meteors = game.meteors.filter(sprite => sprite.isAlive());
        game.pickups = game.pickups.filter(sprite => sprite.isAlive());

        // Remove exploded ships from the both lists & the player
        game.sprites = game.sprites.filter(sprite => !sprite.exploded);
        game.players.forEach(player => {
            if (player.ship.exploded && player.ship.ttl) {
                player.ship = {};
                setTimeout(() => {
                    player.respawn();
                }, 3000);
            }

            // Check if someone has won!
            // TODO: See if it's likely for 2 ships to get to 10 in same update
            if (player.score === 10) {
                // Pause the game and put win screen up?
            }
        });

        if (game.meteors.length < 4 && Math.random() < .001) {
            createMeteor({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: 36,
                game: game
            });
        }

        if (game.pickups.length < 1) {
            let rand = Math.random();
            let pickup = null;
            if (.000 < rand && rand < .001) {
                pickup = new AmmoPickup({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    game: game
                });
            }
            if (.001 < rand && rand < .002) {
                pickup = new ShieldPickup({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    game: game
                });
            }
            if (.002 < rand && rand < .003) {
                pickup = new StarPickup({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    game: game
                });
            }
            if (pickup) {
                game.sprites.push(pickup);
                game.pickups.push(pickup);
            }
        }

    },
    render() {
        // Render all the sprites
        game.sprites.map(sprite => sprite.render());

        // Render the player scores
        game.players.map((player, i) => player.renderScore(i));

        // Render debug collision stuff
        // context.strokeStyle = '#0F0';
        // context.beginPath();
        // collisionSystem.draw(context);
        // context.stroke();
    }
});

loop.start();    // start the game
