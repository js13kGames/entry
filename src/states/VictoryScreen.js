let GameOver = function(g) {
    let txt = 'You have died!';
    let size = 48;
    this.msg = g.text(txt, `${size}px monospace`, 'black',
        g.stage.halfWidth - ((txt.length / 2) * ((size + size * 0.1) / 2)),
        g.stage.halfHeight);
    return () => {};
};

export default GameOver;