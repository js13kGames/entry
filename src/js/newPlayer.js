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
    if (controllerId.indexOf('Joy-Con (L)') > -1) {
        if (!players.some((p) => p.color === colors.blue)) {
            return colors.blue;
        }
        if (!players.some((p) => p.color === colors.green)) {
            return colors.green;
        }
    }
    if (controllerId.indexOf('Joy-Con (R)') > -1) {
        if (!players.some((p) => p.color === colors.red)) {
            return colors.red;
        }
        if (!players.some((p) => p.color === colors.pink)) {
            return colors.pink;
        }
    }
    return unusedRandomColor(players)
}

export function newPlayer(game, controls, controllerId) {
    var color = pickColor(game.players, controllerId);

    zzfx(.2,0,1020,.2,.03,.1,.1,0,.86); // ZzFX 42665

    game.players.push(new Player({
        color: color,
        shipType: Object.keys(ships)[0],
        controls: controls,
        gamepadId: controllerId,
        context: game.context,
        game: game
    }));
}
