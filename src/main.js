// let mode = 'br';
// const MODES = ['Braille', 'Visual Morse', 'Morse']
// const UP = 'up';
// const DOWN = 'down';
// const RIGHT = 'right';
// const LEFT = 'left';
// const BACK = 'back';

import Menu from './states/menu.js';
import Player from './actors/player.js';
// import Maze from './states/maze.js';
import ga from './../lib/ga.js';
import '../lib/custom.js';
// import './../lib/plugins.js';

var g = ga(
    512, 512, setup,
);

//Start the Ga engine.
g.start();

function setup() {
    g.canvas.style.border = "1px black dashed";
    g.backgroundColor = "white";
    g.canvas.style.display = "block";
    g.canvas.style.margin = "auto";
    let player = new Player(g);
    player.sprite.layer = 5;
    g.globals = {
        player,
        GAME_TEMPO: 320,
    };
    g.state = new Menu(g);
    // g.state = new Maze(mode, player);
}