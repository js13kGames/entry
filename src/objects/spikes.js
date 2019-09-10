import dirs from './../directions.js';

let Spikes = function(g, side) {
    let x, y, w, h;
    let cw = g.canvas.width;
    let ch = g.canvas.height;
    let size = 36;
    if (side === dirs.UP) {
        y = 0;
        x = 0;
        w = cw;
        h = size;
    } else if (side === dirs.D) {
        x = 0;
        y = ch - size;
        w = cw;
        h = size;
    } else if (side === dirs.L) {
        x = 0;
        y = 0;
        w = size;
        h = ch;
    } else if (side === dirs.R) {
        x = cw - size;
        y = 0;
        w = size;
        h = ch;
    }
    this.sprite = g.rectangle(w, h, 'grey', 'grey', 1, x, y);
    this.sprite.alpha = 0.5;
    this.side = side;
}

export default Spikes;