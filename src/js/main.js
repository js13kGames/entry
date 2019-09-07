/**
 * Just figuring out WTF we want to do here ATM
 */

import { init, GameLoop, initKeys, keyPressed } from 'kontra';
import { initGamepads, pollGamepads, buttonPressed, axisValue } from './gamepad';
import { schemeNames } from './controls';
import { colors, colorNames } from './colors';
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

canvas.style = 'width:100%;background:#000';

const game = {
    // meteors: [],
    // pickups: [],
    players: []
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
    shipType: 'tri',
    controls: 'wasd',
    context: context,
    game: game
}));

function changeScene(scene) {
    console.log(scene);
    mainMenuLoop.stop()
    if (scene === 'PLAY') {
        shipMenuLoop.start();
        //startGame(game, canvas, context);
    }
}

let mainMenuLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads();

        mainMenu.update();

        game.players.forEach(player => {

            if (player.keys.down()) {
                mainMenu.next();
            }

            if (player.keys.up()) {
                mainMenu.prev();
            }

            if (player.keys.accept()) {
                // Do whatever da button says
                changeScene(mainMenu.items[mainMenu.focus].text);
            }
        });
    },

    render() {
        mainMenu.render(game.scale);
    }
});

mainMenuLoop.start();

playerMenus = [];

playerMenus.push(new Menu({
    context: context,
    x: 30,
    y: 30,
    color: game.players[0].color,
    items: [
        {
            text: 'controls',
            options: schemeNames()
        },
        {
            text: 'color',
            options: colorNames(),
            default: game.players[0].color
        },
        {
            text: 'ship',
            options: Object.keys(ships)
        }
    ]
}));

playerMenus.push(new Menu({
    context: context,
    x: 30 + game.width / 2,
    y: 30,
    color: game.players[1].color,
    items: [
        {
            text: 'controls',
            options: schemeNames()
        },
        {
            text: 'color',
            options: colorNames()
        },
        {
            text: 'ship',
            options: Object.keys(ships)
        }
    ]
}));

let shipMenuLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads();

        game.players.forEach((player, i) => {
            player.menuUpdate();

            if (player.keys.up() && player.debounce.up <= 0) {
                game.players[i].color = util.objectPrev(colors, player.color);
                player.debounce.up = 10;
            }

            if (player.keys.down() && player.debounce.down <= 0) {
                game.players[i].color = util.objectNext(colors, player.color);
                player.debounce.down = 10;
            }

            if (player.keys.left() && player.debounce.left <= 0) {
                player.shipType = util.objectNext(ships, player.shipType);
                player.debounce.left = 10;
            }

            if (player.keys.right() && player.debounce.right <= 0) {
                player.shipType = util.objectPrev(ships, player.shipType);
                player.debounce.right = 10;
            }

            if (player.keys.accept() && player.debounce.accept <= 0) {
                player.ready = true;
                player.debounce.accept = 10;
            }
        });
    },

    render() {
        game.players.forEach((player, i) => {
            var x = y = 0;

            if (i === 1 || i == 3) {
                x = game.width / 2;
            }
            if (i === 2 || i === 3) {
                y = game.height / 2;
            }
            renderText({
                text: 'player ' + (i + 1),
                color: player.color,
                size: .8,
                x: 20 + x,
                y: 20 + y,
                scale: game.scale,
                context: context
            })
        });
    }
});
