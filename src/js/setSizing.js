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
export function setSizing(game, ss, size) {
    // "SuperSample" variable for rending the game e.g. 2x display size
    game.ss = game.ss || 1;
    game.size = game.size || 1;
    game.width = 720 * game.size;
    game.scale = (window.innerWidth * game.ss) / game.width;
    game.height = (window.innerHeight * game.ss) / game.scale;
    game.canvas.width = window.innerWidth * game.ss;
    game.canvas.height = window.innerHeight * game.ss;
    // TODO: Rescale the game map like the big asteroid
}
