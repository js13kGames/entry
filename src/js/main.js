/**
 * Just figuring out WTF we want to do here ATM
 */

import { init, GameLoop, initKeys, keyPressed } from 'kontra';
import { initGamepads, pollGamepads, buttonPressed, axisValue } from './gamepad';
import { Player } from './player';
import { renderText, drawText } from './text';
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
 */


/**
 * [setSizing description]
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

// menu "game" loop

// UI debounce so buttons don't get spammed
// this needs to be per input method hmm
var debounce = 0;

var inputs = [
    // keyboard
    // 0+ controllers
];

var menu = {
    focus: 0, // Currently focused button
    buttons: [
        'play',
        'settings',
        'credits'
    ]
}

let player1 = new Player({
    color: '#ff0',
    //shipType: 'tri',
    controls: 'arrows',
    context: context,
    game: game
});
game.players.push(player1);

function changeScene(scene) {
    menuLoop.stop()
    if (scene === 'play') {
        startGame(game, canvas, context);
    }
}


let menuLoop = GameLoop({  // create the main game loop
    update() { // update the game state
        pollGamepads();

        debounce--;
        if (debounce > 0) {
            return;
        }

        game.players.forEach(player => {
            // Go up/down/left/right etc. in menus?
            if (player.keys.down()) {
                debounce = 10;
                menu.focus++;
                if (menu.focus > menu.buttons.length - 1) {
                    menu.focus = 0;
                }
            }

            if (player.keys.up()) {
                debounce = 10;
                menu.focus--;
                if (menu.focus < 0) {
                    menu.focus = menu.buttons.length - 1;
                }
            }

            if (player.keys.accept()) {
                // Do whatever da button says
                changeScene(menu.buttons[menu.focus]);
            }
        });
    },

    render() {
        menu.buttons.forEach((button, i) => {
            context.save();
            context.scale(game.scale, game.scale);
            context.translate(30, 30 + 30 * i);
            if (menu.focus === i) {
                context.strokeStyle = '#fff';
            } else {
                context.strokeStyle = '#aaa';
            }
            drawText({text: button.toUpperCase(), context: context});
            context.restore();
        });

    }
});

menuLoop.start();

// have some sort of render loop which can rotate the logo or something cool

// canvas.draw menu stuff:
// big logo/splash message

// menu buttons <ul> (but with canvas so not an <ul> I think)

// when keyPressed 'down' or 'up' highlight menu item with diff color or somethin

// when enter pressed, go to options scene, or ship-picking scene

// have some way of getting back to the main menu scene!
