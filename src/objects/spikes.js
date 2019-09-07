import directions from './../directions.js';

let Spikes = function(g, side) {
    let x = 0;
    let y = 0;
    let size = 36;
    let width = 0;
    let height = 0;
    if (side === directions.UP) {
        y = 0;
        x = 0;
        width = g.canvas.width;
        height = size;
    } else if (side === directions.DOWN) {
        x = 0;
        y = g.canvas.height - size;
        width = g.canvas.width;
        height = size;
    } else if (side === directions.LEFT) {
        x = 0;
        y = 0;
        width = size;
        height = g.canvas.height;
    } else if (side === directions.RIGHT) {
        x = g.canvas.width - size;
        y = 0;
        width = size;
        height = g.canvas.height;
    }
    this.sprite = g.rectangle(width, height, 'grey', 'grey', 1, x, y);
    this.sprite.alpha = 0.5;
    this.side = side;
}

export default Spikes;