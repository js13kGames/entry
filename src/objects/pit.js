import directions from './../directions.js';
let Pit = function(g, dir) {
    let x = 0;
    let y = 0;
    let size = 36;
    if (dir === directions.UP) {
        x = g.canvas.width / 2 - size / 2;
        y = 0;
    } else if (dir === directions.DOWN) {
        x = g.canvas.width / 2 - size / 2;
        y = g.canvas.height - size;
    } else if (dir === directions.LEFT) {
        x = 0;
        y = g.canvas.height / 2 - size / 2;
    } else if (dir === directions.RIGHT) {
        x = g.canvas.width - size;
        y = g.canvas.height / 2 - size / 2;
    }
    this.sprite = g.rectangle(size, size, 'black', 'black', 1, x, y);
    this.dir = dir;
}

export default Pit;