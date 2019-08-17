'use strict';

/* boiler plate canvas initialization */
const canvas = document.getElementById("screen");
const ctx = canvas.getContext('2d');

//ctx.height = 720;
//ctx.width = 1280;

//test example






var temp_level = `
##############################
#............................#
#............................#
#.....p.....e................#
#............................#
#.....#.....i................#
#............................#
##############################
`;
// 30 * 32 = 960 for widdth
//height = 8 * 32 = 256


/* Program-wide Variables & Constants */
const gridSize = 32; /* size of each 'block' of the game screen. */
var takeInput = true;/* Variable determines if we read the keyboard or not */


/* player controls */

const moveUp = 119;
const moveDown = 115;
const moveRight = 100;
const moveLeft = 97;

// use string array for drawing levels?

/* game object definitions */

/* enemy object */
let enemy = {
    width: gridSize,
    height: gridSize,
    color: "red"
};

/* innocent object */
let innocent = {
    width: gridSize,
    height: gridSize,
    color: "blue"
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

/* LEVEL PARSING FUNCTIONS */

/* converts template literal to array of strings for drawLevel */
function levelTemplateToArray(template) {
    let levelArray = template.split("\n");
    return levelArray;
};

function drawLevel(level_array) {
    ctx.lineWidth = 1;
    let y, x;
    for (y = 0; y < level_array.length; y++) {
        for (x = 0; x < level_array[y].length; x++) {
            switch (level_array[y][x]) {
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

/* GAME INPUT FUNCTIONS */

/* TODO: write collision checking function for a particular spot */
function checkCollision(){};
/* TODO: write function that moves player in a direction */
function movePlayer(direction){};

/* GETTING GAME INPUT */
document.addEventListener("keypress", function(event){
    if (takeInput){
        switch(event.keyCode){
            case keyUp:
                //call move function
                break;
            case keyDown:
                break;
            case keyLeft:
                break;
            case keyRight:
                break;
        }
    }
});


/* Game Init Loop */


/* main game event loop */
var gameRun = true;
while (gameRun) {
    //draw the game

    let this_level = levelTemplateToArray(temp_level);
    console.log(this_level);
    drawLevel(this_level);
    //player input but with timeout to update things
    gameRun = false;
}



