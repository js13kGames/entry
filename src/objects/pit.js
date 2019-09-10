import dirs from './../directions.js';
let Pit = function(g, dir) {
    let x = 0;
    let y = 0;
    let cw = g.canvas.width;
    let ch = g.canvas.height;
    let size = 36;
    if (dir === dirs.UP) {
        x = cw / 2 - size / 2;
        y = 0;
    } else if (dir === dirs.D) {
        x = cw / 2 - size / 2;
        y = ch - size;
    } else if (dir === dirs.L) {
        x = 0;
        y = ch / 2 - size / 2;
    } else if (dir === dirs.R) {
        x = cw - size;
        y = ch / 2 - size / 2;
    }
    this.sprite = g.rectangle(size, size, 'black', 'black', 1, x, y);
    this.dir = dir;
}

export default Pit;