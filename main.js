'use strict';

/* boiler plate canvas initialization */
const canvas = document.getElementById("screen");
const ctx = canvas.getContext('2d');

ctx.height = 720;
ctx.width = 1280;

//test example




/*
Example level template literal
##############################
#............................#
#............................#
#.....p.....e................#
#............................#
#.....#.....i................#
#............................#
##############################

*/

/* Program-wide Variables & Constants */
const gridSize = 32;
var t_level = [" p e # i #", "### # #"]; //test level string array


// use string array for drawing levels?

/* game object definitions */

/* enemy object */
let enemy = {
    width: gridSize,
    height: gridSize,
    color:"red"
};

/* innocent object */
let innocent = {
    width: gridSize,
    height: gridSize,
    color:"blue"
};


/* object for game walls */
let wall = {
    width: gridSize,
    height: gridSize,
    color: "black"
};

/* Player Object */
let player = {
    width: gridSize,
    height: gridSize,
    color: "green"
};

/* level parsing */
let testString = ["abc", "def"];

/* TODO: function to convert template literal to array of strings for drawLevel */
function levelTemplateToArray(){};


function drawLevel(level_array){
    ctx.lineWidth = 1;
    let y, x;
    for(y=0; y < level_array.length; y++){
        for(x=0; x < level_array[y].length; x++){
            switch(level_array[y][x]){
                case '#':
                    //draw wall
                    ctx.fillStyle = wall.color;
                    ctx.fillRect(gridSize * x, gridSize * y, wall.width, wall.height);
                    break;
                case 'p':
                    /* placeholder graphics */
                    console.log("drawing player");
                    ctx.fillStyle = player.color;
                    ctx.fillRect(gridSize * x, gridSize * y, player.width, player.height);
                    //draw player
                    break;
                case 'e':
                    ctx.fillStyle = enemy.color;
                    ctx.fillRect(gridSize * x, gridSize * y, enemy.width, enemy.height);
                    //draw enemy object
                    break;
                case 'i':
                    ctx.fillStyle = innocent.color;
                    ctx.fillRect(gridSize * x, gridSize * y, innocent.width, innocent.height);
                    //draw innocent object
                    break;
                default:
                    //debug log
                    //console.log(`empty space at y: ${y} x: ${x}`);
            }
        }
    }
}



/* main game event loop */
var gameRun = true;
while(gameRun){
    //draw the game
    drawLevel(t_level);
    //player input but with timeout to update things
    gameRun = false;
}



