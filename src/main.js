import Menu from './states/menu.js';
import Player from './actors/player.js';
import ga from './../lib/ga.js';
import '../lib/custom.js';

var g = ga(
    512, 512, setup,
);

//Start the Ga engine.
g.start();

function setup() {
    let gc = g.canvas.style;
    gc.border = "1px black dashed";
    g.backgroundColor = "white";
    gc.display = "block";
    gc.margin = "auto";
    let player = new Player(g);
    player.sprite.layer = 5;
    g.player = player;
    g.tempo = 440;
    g.state = new Menu(g);
}