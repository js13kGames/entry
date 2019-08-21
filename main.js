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

/*
LEGEND for char object symbols
p = player
e = enemy
i = innocent
E = dead enemy
I = dead innocent
# = wall
s = player second location
*/

//twenty second timelimit per level
var level_1 = `
#############
#..s........#
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
#p..s#......#
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
#p.........s#
#############
`

var levels = [level_1, level_2, level_3];
var paths = ["","",""];
var secondTry = false;
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

/* Target Sprites Alive */
var enemySprite = new Image();
enemySprite.src = "sprites/target0.png";

var innocentSprite = new Image();
innocentSprite.src = "sprites/target2.png";

/* Target Sprites Dead */

var deadEnemySprite = new Image();
deadEnemySprite.src = "sprites/target1.png";

var deadInnocentSprite = new Image();
deadInnocentSprite.src = "sprites/target3.png";

/* Shadow Player sprite */
var shadowPlayerSprite = new Image();
shadowPlayerSprite.src = "sprite_3.png";


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
    key:'p',
    color: "green"
};


/* shadowplayer */

let shadowPlayer = {
    width: gridSize,
    height: gridSize,
    x:0,
    y:0,
    key:'p',
    color: "yellow"
};

/* LEVEL PARSING FUNCTIONS */

// this changes which level we are current on.
function gotoNextLevel(){
    if (currentLevelIndex < levels.length-1){
        currentLevelIndex++;
        this_level = levels[currentLevelIndex].split("\n");
        setupGoal(target);
    } else if (secondTry == false){
        /* SETUP GAME FOR SECOND GOTHRU */
        secondTry = true;
        //target = "i";
        player.key = 's'
        currentLevelIndex = 0;
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
                    if (secondTry == false){
                        player.x = x;
                        player.y = y;
                        ctx.drawImage(playerSprite, player.x * gridSize, player.y * gridSize, player.width, player.height);
                    } else {
                        shadowPlayer.x = x;
                        shadowPlayer.y = y;
                        ctx.drawImage(shadowPlayerSprite, shadowPlayer.x * gridSize, shadowPlayer.y * gridSize, shadowPlayer.width, shadowPlayer.height);
                    }
                    break;

                case 's':
                    if (secondTry == true){
                        player.x = x;
                        player.y = y;
                        ctx.drawImage(playerSprite, player.x * gridSize, player.y * gridSize, player.width, player.height);
                    }
                    break;

                case 'e':
                    ctx.fillStyle = enemy.color;
                    ctx.drawImage(enemySprite, x * gridSize, y * gridSize, enemy.width, enemy.height);
                    //draw enemy object
                    break;
                case "E":
                    ctx.drawImage(deadEnemySprite, x * gridSize, y * gridSize, gridSize, gridSize);
                    break;
                case "I":
                        ctx.drawImage(deadInnocentSprite, x * gridSize, y * gridSize, gridSize, gridSize);
                    break;
                case 'i':
                    ctx.fillStyle = innocent.color;
                    ctx.drawImage(innocentSprite, x * gridSize, y * gridSize, innocent.width, innocent.height);
                    //draw innocent object
                    break;
                default:
                    break;
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
        
        /*
        case "E":
            return true;

        case "I":
            return true;
        */
        case target:
            // change out the target
            this_level[y] = splice(this_level[y], x, 1, target.toUpperCase());
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
function updatePlayerArray(dx, dy, object){
    let replace = this_level[object.y + dy][object.x + dx];

    // using voca.js for splice function as to limit my frustration with manipulating immutable strings
    this_level[object.y+dy] = splice(this_level[object.y+dy], object.x+dx, 1, object.key);
    this_level[object.y] = splice(this_level[object.y], object.x, 1, replace);

    object.y += dy;
    object.x += dx;
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
                    updatePlayerArray(0, -1, player);
                    //update array
                    if (secondTry == false) paths[currentLevelIndex] = paths[currentLevelIndex] + "n";
                }
                stopInput = true;
                setTimeout(resumeInput, inputDelay);
                break;
            case moveDown:
                if (checkCollision(player.x, player.y+1)){
                    updatePlayerArray(0, 1, player);
                    if (secondTry == false) paths[currentLevelIndex] = paths[currentLevelIndex] + "s";
                }
                stopInput = true;
                setTimeout(resumeInput, inputDelay);
                break;
            case moveLeft:
                if(checkCollision(player.x-1, player.y)){
                    updatePlayerArray(-1, 0, player);
                    if (secondTry == false) paths[currentLevelIndex] = paths[currentLevelIndex] + "w";
                }
                stopInput = true;
                setTimeout(resumeInput, inputDelay);
                break;
            case moveRight:
                if(checkCollision(player.x+1, player.y)){
                    updatePlayerArray(1, 0, player);
                    if (secondTry == false) paths[currentLevelIndex] = paths[currentLevelIndex] + "e";
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


function* moveShadowPlayer(){
    let i = 0;
    for(i; i < paths[currentLevelIndex].length; i++){
        switch(paths[currentLevelIndex][i]){
            case 'n':
                if(checkCollision(shadowPlayer.x, shadowPlayer.y-1)) updatePlayerArray(0, -1, shadowPlayer);
                break;
            case 's':
                if (checkCollision(shadowPlayer.x, shadowPlayer.y+1)) updatePlayerArray(0, 1, shadowPlayer);
                break;
            case 'e':
                if (checkCollision(shadowPlayer.x+1, shadowPlayer.y)) updatePlayerArray(1, 0, shadowPlayer);
                break;
            case 'w':
                if (checkCollision(shadowPlayer.x-1, shadowPlayer.y)) updatePlayerArray(-1, 0, shadowPlayer);
                break;
        }
        yield i;//exit function as generator so state is saved
    }
}

/* main game event loop */
//var gameRun = true;
function mainLoop() {
    //draw the game
    //console.log(this_level);
    if (secondTry == true){
        moveShadowPlayer();
    }
    
    drawLevel(this_level);
    //player input but with timeout to update things
}


setInterval(mainLoop, 25);
