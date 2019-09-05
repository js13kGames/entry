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


const gameLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads();

        game.players.forEach(player => {
            player.update();
        });

        game.sprites.map(sprite => {
            sprite.update();

            if (sprite.type !== 'bullet') {
                if (sprite.x > game.width) {
                    sprite.x = 0;
                } else if (sprite.x < 0) {
                    sprite.x = game.width;
                }
                if (sprite.y > game.height) {
                    sprite.y = 0;
                } else if (sprite.y < 0) {
                    sprite.y = game.height;
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

        if (game.meteors.length < 5 && Math.random() < .005) {
            createMeteor({
                x: Math.random() * game.width,
                y: Math.random() * game.height,
                radius: 20,
                game: game
            });
        }

        if (game.pickups.length < 1) {
            let rand = Math.random();
            let pickup = null;
            if (.000 < rand && rand < .001) {
                pickup = new AmmoPickup({
                    x: Math.random() * game.width,
                    y: Math.random() * game.height,
                    game: game
                });
            }
            if (.001 < rand && rand < .002) {
                pickup = new ShieldPickup({
                    x: Math.random() * game.width,
                    y: Math.random() * game.height,
                    game: game
                });
            }
            if (.002 < rand && rand < .003) {
                pickup = new StarPickup({
                    x: Math.random() * game.width,
                    y: Math.random() * game.height,
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
        game.sprites.map(sprite => sprite.render(game.scale));

        // Render the player scores
        game.players.map((player, i) => player.renderScore(i));

        // Render debug collision stuff
        // context.save();
        // context.scale(game.scale, game.scale);
        // context.strokeStyle = '#0F0';
        // context.beginPath();
        // game.cSystem.draw(context);
        // context.stroke();
        // context.restore();
    }
});

var game;

export default function startGame(newGame, canvas, context) {

    game = newGame;

    console.log("beep");

    game.meteors = [];
    game.pickups = [];
    game.sprites = [];

    // Create new collision system & collision result object
    game.cSystem = new Collisions();
    game.cResult = game.cSystem.createResult();

    // Big asteroid in the middle (dioretsa)
    createMeteor({
        x: game.width / 2,
        y: game.height / 2,
        radius: Math.min(game.width / 5, game.height / 5),
        mass: 100000,
        dx: 0,
        dy: 0,
        dr: .1,
        game: game
    });

    game.players[0].shipType = 'tri';

    // let player1 = new Player({
    //     color: '#ff0',
    //     shipType: 'tri',
    //     controls: 'arrows',
    //     context: context,
    //     game: game
    // });
    // game.players.push(player1);
    //
    // let player2 = new Player({
    //     color: '#f11',
    //     shipType: 'coback',
    //     controls: 'gamepad',
    //     context: context,
    //     game: game
    // });
    // game.players.push(player2);

    game.players.forEach(player => {
        player.spawn();
    });

    gameLoop.start();
}
