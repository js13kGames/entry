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



//twenty second timelimit per level
var level_1 = `
#############
#...........#
#...........#
#.......i...#
#.p.........#
#.......e...#
#...........#
#...........#
#############
`
var level_2 = `
#############
#...####....#
#.#.####e.i.#
#.#....#....#
#.####.#.####
#....#.#....#
####.#.####.#
#p...#......#
#############
`

var level_3 = `
#############
#e..........#
#..........i#
######..##.##
#e......#...#
#ie..#..#i.e#
######..#####
#p..........#
#############
`

var levels = [level_1, level_2, level_3];
var currentLevelIndex = 0;

// 30 * 32 = 960 for widdth
//height = 8 * 32 = 256


/* Program-wide Variables & Constants */
const gridSize = 32; /* size of each 'block' of the game screen. */
var takeInput = false;/* Variable determines if we read the keyboard or not */


/* Game Init Code */



var target = "e"; //which object to decrement the goal
var goal = 0; //this keeps track of how many more objects needs to be destroyed

var hasRun = 0;
var animationCounter = 0; //counter used for the level transition animation.
var transition = false;
var this_level = levels[currentLevelIndex].split("\n");
setupGoal(target);
takeInput = true;
hasRun++;

/* Player Sprite Loading */
var playerSprite = new Image();
playerSprite.src = "sprite_0.png";

var enemySprite = new Image();
enemySprite.src = "sprites/target0.png";

var innocentSprite = new Image();
innocentSprite.src = "sprites/target2.png";

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

/* hazard object */
let hazard = {
    width:gridSize,
    height: gridSize,
    color:"orange"
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
        setupGoal(target);
    }
}

/* calculates how many objects need to be destroyed before the player progresses */
function setupGoal(target){
    let y;
    let x;
    for(y=0; y < this_level.length; y++){
        for (x=0; x < this_level[1].length; x++){
            if (this_level[y][x] == target) {
                goal++;
            }
        }
    }
}


function levelTransition(timeout){
    ctx.fillStyle = "black";
    let levelHeight = (this_level.length-2) * gridSize;
    if (animationCounter < levelHeight){
        animationCounter++;
        setTimeout(levelTransition, timeout/2);
    } else {
        gotoNextLevel();
        levelTransitionEnd(100)
    }
}

function levelTransitionEnd(timeout){
    if(animationCounter > 0){
        animationCounter--;
        setTimeout(levelTransitionEnd, timeout/2);
    } else {
        takeInput = true;
        transition = false;
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
                    ctx.drawImage(enemySprite, x * gridSize, y * gridSize, enemy.width, enemy.height);
                    //draw enemy object
                    break;
                case 'i':
                    ctx.fillStyle = innocent.color;
                    ctx.drawImage(innocentSprite, x * gridSize, y * gridSize, innocent.width, innocent.height);
                    //draw innocent object
                    break;
                default:
                //debug log
                //console.log(`empty space at y: ${y} x: ${x}`);
            }
        }
    }

    if (transition == true){
        ctx.fillStyle = "black";
        let levelWidth = this_level[1].length * gridSize;
        ctx.fillRect(0, 32, levelWidth, animationCounter);
    }

}

/* GAME INPUT FUNCTIONS */

/* TODO: write collision checking function for a particular spot */
function checkCollision(x, y){
    switch(this_level[y][x]){
        case '#':
            return false;
        case target:
            // remove the target
            this_level[y] = splice(this_level[y], x, 1, '.');
            goal--;
            if (goal <= 0){
                transition = true;
                takeInput = false;
                animationCounter = 0;
                levelTransition(100);
            }
            return false;

        default:
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



var inputDelay = 50;
var stopInput = false;

function resumeInput(){
    stopInput = false;
}

/* GETTING GAME INPUT */
document.addEventListener("keypress", function(event){
    if ((takeInput) && (!stopInput)){
        switch(event.keyCode){
            case moveUp:
                //call move function
                if (checkCollision(player.x, player.y-1)){
                    //alter the level array
                    updatePlayerArray(0, -1);
                }
                stopInput = true;
                setTimeout(resumeInput, inputDelay);
                break;
            case moveDown:
                if (checkCollision(player.x, player.y+1)){
                    updatePlayerArray(0, 1);
                }
                stopInput = true;
                setTimeout(resumeInput, inputDelay);
                break;
            case moveLeft:
                if(checkCollision(player.x-1, player.y)){
                    updatePlayerArray(-1, 0);
                }
                stopInput = true;
                setTimeout(resumeInput, inputDelay);
                break;
            case moveRight:
                if(checkCollision(player.x+1, player.y)){
                    updatePlayerArray(1, 0);
                }
                stopInput = true;
                setTimeout(resumeInput, inputDelay);
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


setInterval(mainLoop, 50);
