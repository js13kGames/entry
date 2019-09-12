import dirs from './../directions.js';

let Spikes = function(g, side) {
    let x, y, w, h;
    let cw = g.canvas.width;
    let ch = g.canvas.height;
    let size = 36;
    let numRows = 1;
    let emoji = '⚔️';
    if (side === dirs.UP) {
        y = 0;
        x = 0;
        w = cw;
        h = size;
        emoji = Array(Math.floor(cw / size)).fill('⚔️').join('')
    } else if (side === dirs.D) {
        x = 0;
        y = ch - size;
        w = cw;
        h = size;
        emoji = Array(Math.floor(cw / size)).fill('⚔️').join('')
    } else if (side === dirs.L) {
        numRows = 20;
        x = 0;
        y = 0;
        w = size;
        h = ch;
    } else if (side === dirs.R) {
        numRows = 20;
        x = cw - size;
        y = 0;
        w = size;
        h = ch;
    }
    this.imgs = [];
    for (let i = 0; i < numRows; i++) {
        let txt = g.text(emoji, '36px Times', 'black', x - 8, y + 3 + (i * 36));
        txt.alpha = 0.2;
        this.imgs.push(txt);
    }
    
    this.sprite = g.rectangle(w, h, 'grey', 'grey', 1, x, y);
    this.sprite.visible = false;
    this.side = side;
}

export default Spikes;