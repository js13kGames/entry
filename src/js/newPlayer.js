import { Player } from './player';
import { colors } from './colors';
import ships from './ships/import/';
import zzfx from './zzfx';

/**
 * Pick random not-currently-used color. Based on:
 * https://stackoverflow.com/a/15106541
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function unusedRandomColor(players) {
    var values = Object.values(colors);
    var chosen;

    // Do whiles are scary, but this "should" always return an unused color.
    do {
        chosen = values[values.length * Math.random() << 0];
    } while (game.players.some((p) => p.color === chosen));

    return chosen;
};

function pickColor(players, controllerId) {
    if (!controllerId) {
        return unusedRandomColor(players)
    }
    // Make left Joy-Cons blue, or if there's already a blue player, green
    if (controllerId.includes('(L)')) {
        if (!players.some((p) => p.color === colors.blue)) {
            return colors.blue;
        }
        if (!players.some((p) => p.color === colors.green)) {
            return colors.green;
        }
    }
    // Make right Joy-Cons red, or if there's already a red player, pink
    if (controllerId.includes('(R)')) {
        if (!players.some((p) => p.color === colors.red)) {
            return colors.red;
        }
        if (!players.some((p) => p.color === colors.pink)) {
            return colors.pink;
        }
    }
    // Make Xbox controllers green if there's not already a green
    if (controllerId.includes('Xbox')) {
        if (!players.some((p) => p.color === colors.green)) {
            return colors.green;
        }
    }
    return unusedRandomColor(players)
}

export function newPlayer(game, controls, controllerId) {

    if (game.players.length === 4) {
        //Console.warn('Game does not support more than 4 players yet');
        return;
    }

    zzfx(.2,0,1000,.2,.03,.1,.1,0,.86); // ZzFX 42665

    game.players.push(new Player({
        color: pickColor(game.players, controllerId),
        shipType: Math.floor(Math.random() * 4),
        controls: controls,
        gamepadId: controllerId,
        ctx: game.ctx,
        game: game
    }));
}
