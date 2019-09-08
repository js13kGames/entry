import { init, initKeys } from 'kontra';
import { initGamepads } from './gamepad';

// Import all the scenes because we're somehow going to handle changing
// between them here... to stop circular dependencies getting in the way

import { startMainMenu } from './scenes/main';
import { startShipSelect } from './scenes/select';
import { startGame } from './scenes/game';

// Setup canvas stuff (probably w/Kontra)

// Kontra init canvas
let { canvas, context } = init();

// Kontra init keyboard stuff
initKeys();

// Init gamepad event listeners n stuff
initGamepads();

const scenes = {
    startMainMenu: startMainMenu,
    startShipSelect: startShipSelect,
    startGame: startGame
};

// window.addEventListener('gamepadconnected', function(e) {
//     console.log(`!Gamepad connected at index ${pad.index}: ${pad.id}. ${pad.buttons.length} buttons, ${pad.axes.length} axes.`);
// })

canvas.style = 'width:100%;background:#000';

const game = {
    canvas: canvas,
    context: context,
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

startMainMenu(game, scenes);
