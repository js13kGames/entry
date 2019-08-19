'use strict';

/* boiler plate canvas initialization */
const canvas = document.getElementById("screen");
const ctx = canvas.getContext('2d');

//ctx.height = 720;
//ctx.width = 1280;

//test example

/** Web monitization idea: different robot skins.
 * 
 * That would be really easy to implement
 */




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




var level_1 = `
#############
#.......i...#
#.p.........#
#.......e...#
#############
`
var level_2 = `
##############
#.......#....#
#.####..#.e..#
#....#..#....#
####.#..#.i..#
#p...#.......#
##############
`

var level_3 = `
###################
#.................#
#....#......#.....#
#....#..##..#.....#
#..#..........#...#
#...##########....#
#................p#
###################
`

var levels = [level_1, level_2, level_3];
var currentLevelIndex = 0;

// 30 * 32 = 960 for widdth
//height = 8 * 32 = 256


/* Program-wide Variables & Constants */
const gridSize = 32; /* size of each 'block' of the game screen. */
var takeInput = false;/* Variable determines if we read the keyboard or not */


/* Game Init Code */
var hasRun = 0;

//var this_level = temp_level.split("\n");
var this_level = levels[currentLevelIndex].split("\n");
takeInput = true;
hasRun++;

/* Player Sprite Loading */
var playerSprite = new Image();
playerSprite.src = "sprite_0.png";



//console.log("Run " + hasRun + " times");




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
    x:0,
    y:0,
    color: "green"
};

/* LEVEL PARSING FUNCTIONS */

// this changes which level we are current on.
function gotoNextLevel(){
    if (currentLevelIndex < levels.length){
        currentLevelIndex++;
        this_level = levels[currentLevelIndex].split("\n");
    }
}


function drawLevel(level_array) {

    //first clear canvas screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
                    //console.log("drawing player");
                    //ctx.fillStyle = player.color;
                    player.x = x;
                    player.y = y;
                    ctx.drawImage(playerSprite, player.x * gridSize, player.y * gridSize, player.width, player.height);
                    //ctx.fillRect(gridSize * x, gridSize * y, player.width, player.height);
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
function checkCollision(x, y){
    if ( this_level[y][x] == '#' ){ 
        //console.log(`wall at y:${y} and x: ${x}`);
        return false;
    }
    else {
        //console.log(`no wall at y:${y} and x:${x}`);
        return true;
    } 
};


// since strings are immutable I gotta completely change the array
function updatePlayerArray(dx, dy){
    let replace = this_level[player.y + dy][player.x + dx];

    // using voca.js for splice function as to limit my frustration with manipulating immutable strings
    this_level[player.y+dy] = splice(this_level[player.y+dy], player.x+dx, 1, 'p');
    this_level[player.y] = splice(this_level[player.y], player.x, 1, replace);

    player.y += dy;
    player.x += dx;
}





/* GETTING GAME INPUT */
document.addEventListener("keypress", function(event){
    if (takeInput){
        switch(event.keyCode){
            case moveUp:
                //call move function
                if (checkCollision(player.x, player.y-1)){
                    //alter the level array
                    updatePlayerArray(0, -1);
                }
                break;
            case moveDown:
                if (checkCollision(player.x, player.y+1)){
                    updatePlayerArray(0, 1);
                }
                break;
            case moveLeft:
                if(checkCollision(player.x-1, player.y)){
                    updatePlayerArray(-1, 0);
                }
                break;
            case moveRight:
                if(checkCollision(player.x+1, player.y)){
                    updatePlayerArray(1, 0);
                }
                break;
            //NEXT LEVEL
            case 110://n
                gotoNextLevel();
                break;
        }
    }
});




/* main game event loop */
//var gameRun = true;
function mainLoop() {
    //draw the game
    //console.log(this_level);
    drawLevel(this_level);
    //player input but with timeout to update things
}


setInterval(mainLoop, 100);
