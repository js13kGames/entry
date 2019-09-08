/**
 * Just figuring out WTF we want to do here ATM
 */

import { init, GameLoop, initKeys, keyPressed } from 'kontra';
import { initGamepads, pollGamepads, buttonPressed, axisValue } from './gamepad';
import { colors } from './colors';
import ships from './ships/import';
import { Player } from './player';
import { Menu } from './menu';
import { renderText } from './text';
import * as util from './utility';
import startGame from './game';

// Setup canvas stuff (probably w/Kontra)

// Kontra init canvas
let { canvas, context } = init();

// Kontra init keyboard stuff
initKeys();

// Init gamepad event listeners n stuff
initGamepads();

// window.addEventListener('gamepadconnected', function(e) {
//     console.log(`!Gamepad connected at index ${pad.index}: ${pad.id}. ${pad.buttons.length} buttons, ${pad.axes.length} axes.`);
// })

canvas.style = 'width:100%;background:#000';

const game = {
    // meteors: [],
    // pickups: [],
    players: [],
    sprites: [],
    // sprites: [],
    // The following get added by setSizing()
    // scale: 1.0,
    // supersampling: 1.0,
    // width: 360,
    // height: 202.5
};

/**
 * Sets the canvas size, and the game options variables for scaling the game.
 *
 * All the game's positioning & calculations are done on a 360 x ### grid, but
 * then scaled up to fit on a variable size canvas. That way if a ship hitbox
 * is e.g. 10x10, it'll be the correct size for calcs no matter the scale.
 * Most numbers used in calcs are floats, so we don't lose much precision
 * by using a small "game board" like this.
 * @param {[type]} ss supersampling multiplier
 */
function setSizing(ss) {
    game.supersample = ss;
    game.width = 720;
    game.scale = (window.innerWidth * ss) / game.width;
    game.height = (window.innerHeight * ss) / game.scale;
    canvas.width = window.innerWidth * ss;
    canvas.height = window.innerHeight * ss;
    // TODO: Rescale the game map like the big asteroid
}

setSizing(1);

window.onresize = () => {
    setSizing(game.supersample);
}

var mainMenu = new Menu({
    context: context,
    x: 30,
    y: 30,
    color: '#fff',
    items: [
        { text: 'play' },
        { text: 'settings' },
        { text: 'credits' }
    ]
});

game.players.push(new Player({
    color: colors.yellow,
    shipType: 'tri',
    controls: 'arrows',
    context: context,
    game: game
}));

game.players.push(new Player({
    color: colors.red,
    shipType: 'coback',
    controls: 'wasd',
    context: context,
    game: game
}));
//
// game.players.push(new Player({
//     color: colors.blue,
//     shipType: 'striker',
//     controls: 'gamepad',
//     gamepadIndex: 0,
//     context: context,
//     game: game
// }));

let mainMenuLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads();

        game.players.forEach(player => {

            if (player.keys.up()) {
                if (player.debounce.up > 0) {
                    player.debounce.up--;
                    return;
                }
                mainMenu.prev();
                player.debounce.up = 15;
            } else {
                player.debounce.up = 0;
            }

            if (player.keys.down()) {
                player.debounce.down--;
                if (player.debounce.down <= 0) {
                    mainMenu.next();
                    player.debounce.down = 15;
                }
            } else {
                player.debounce.down = 0;
            }

            if (player.keys.accept()) {
                mainMenuLoop.stop()
                if (mainMenu.items[mainMenu.focus].text === 'play') {
                    game.players.forEach(player => {
                        player.pseudoSpawn();
                    });
                    shipMenuLoop.start();
                    //startGame(game, canvas, context);
                }
            }
        });
    },

    render() {
        mainMenu.render(game.scale);
    }
});

mainMenuLoop.start();

playerMenus = [];

let shipMenuLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads();

        game.players.forEach((player, i) => {

            if (player.keys.accept()) {
                player.debounce.accept--;
                if (player.debounce.accept <= 0) {
                    player.ready = !player.ready;
                    player.debounce.accept = 15;
                }
            } else {
                player.debounce.accept = 0;
            }

            if (player.ready) {
                return;
            }

            player.ship.rotation += player.ship.dr;

            if (player.keys.up()) {
                if (player.debounce.up > 0) {
                    player.debounce.up--;
                    return;
                }

                player.color = util.objValPrev(colors, player.color);

                while (util.otherPlayerHasSameColor(game.players, player)) {
                    player.color = util.objValPrev(colors, player.color);
                }

                game.players[i].ship.color = player.color;
                player.debounce.up = 15;
            } else {
                player.debounce.up = 0;
            }

            if (player.keys.down()) {
                if (player.debounce.down > 0) {
                    player.debounce.down--;
                    return;
                }

                player.color = util.objValNext(colors, player.color);

                while (util.otherPlayerHasSameColor(game.players, player)) {
                    player.color = util.objValNext(colors, player.color);
                }

                game.players[i].ship.color = player.color;
                player.debounce.down = 15;
            } else {
                player.debounce.down = 0;
            }

            if (player.keys.left()) {
                if (player.debounce.left > 0) {
                    player.debounce.left--;
                    return;
                }
                player.shipType = util.objKeyPrev(ships, player.shipType);
                player.pseudoSpawn();
                player.debounce.left = 15;
            } else {
                player.debounce.left = 0;
            }

            if (player.keys.right()) {
                if (player.debounce.right > 0) {
                    player.debounce.right--;
                    return;
                }
                player.shipType = util.objKeyNext(ships, player.shipType);
                player.pseudoSpawn();
                player.debounce.right = 15;
            } else {
                player.debounce.right = 0;
            }

        });

        if (game.players.every(player => player.ready)) {
            shipMenuLoop.stop();
            startGame(game, canvas, context);
        }
    },

    render() {
        game.players.forEach((player, i) => {
            var x = y = 0;

            if (i === 1 || i == 3) {
                x = 4 + game.width / 2;
            } else {
                x = 8;
            }
            if (i === 2 || i === 3) {
                y = 4 + game.height / 2;
            } else {
                y = 8;
            }

            context.save();
            context.scale(game.scale, game.scale);
            context.clearRect(
                x,
                y,
                game.width / 2 - 12,
                game.height / 2 - 12,
            );
            context.strokeStyle = player.color;
            context.strokeRect(
                x,
                y,
                game.width / 2 - 12,
                game.height / 2 - 12,
            )
            context.restore();

            renderText({
                text: 'player ' + (i + 1),
                color: player.color,
                size: .8,
                x: x + 12,
                y: y + 12,
                scale: game.scale,
                context: context
            });

            renderText({
                alignRight: true,
                alignBottom: true,
                text: player.ready ? 'ready!' : 'selecting',
                color: player.color,
                size: .8,
                x: x + game.width / 2 - 22,
                y: y + game.height / 2 - 20,
                scale: game.scale,
                context: context
            });

            player.ship.pseudoRender(
                game.scale,
                x + game.width / 2 - 80,
                y + (game.height / 2 - 12) / 2
            );
        });
    }
});
