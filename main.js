/* JavaScript source code for backstabbers.  There were no game frameworks used mostly just relying on basic canvas manipulation*/
'use strict';

/* boiler plate canvas initialization */
const canvas = document.getElementById("screen");
const ctx = canvas.getContext('2d');

/* big thanks to Dan Dascalescu and Herohtar for their epic stackoverflow answer */
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

ctx.canvas.width = 608;
ctx.canvas.height = 360;

/* init tiny music code */
var ac = new AudioContext();
let tempo = 120;

// beep sound
let beepNote = new TinyMusic.Note('F3 0.0125');
let beepSnd = new TinyMusic.Sequence(ac, tempo);
beepSnd.gain.gain.value = 0.10;
beepSnd.push(beepNote);
beepSnd.loop = false;

// walk sound
let walkNote = new TinyMusic.Note('G2 s');
let walkSnd = new TinyMusic.Sequence(ac, tempo);
walkSnd.gain.gain.value = 0.25;
walkSnd.push(walkNote);
walkSnd.loop = false;

// kill sound
let killNote = new TinyMusic.Note('B2 s');
let killSnd = new TinyMusic.Sequence(ac, tempo/2);
killSnd.waveType = "sine";
killSnd.gain.gain.value = 0.12;
killSnd.staccato = 0;
killSnd.bass.gain.value = 30;
killSnd.treble.gain.value = 15;
killSnd.push(killNote);
killSnd.loop = false;

// success sound
let goodNote = new TinyMusic.Note('C5 s');
let goodSnd = new TinyMusic.Sequence(ac, tempo);
goodSnd.waveType = "sine";
goodSnd.gain.gain.value = 0.10;
goodSnd.push(goodNote);
goodSnd.loop = false;


/** Web monitization idea: different robot skins.
 * 
 * That would be really easy to implement he said without doing research
 */

/* 
    All levels are represented through template literals denoting the location of each game object.
    These templates are then split by new line characters into an array which many functions use to determine what the level looks like.
    This makes it easy for the main game event loop to draw each object and also makes collision checking a breeze.
    However, there are a few drawbacks:
        1. Not possible to implement incremental movement (i.e. moving pixel by pixel)
        2. Non-square based level designs are basically impossible. 
        3. String manipulation can be a hassle in JavaScript due to their immutablility.
    And a bunch more which I can't think of right now.
    This really only makes sense for a primitive or adventure like game; a category this game falls under!

*/


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



var level_1 = `
#############
#..s........#
#...........#
#.......i...#
#.p.........#
#.......e...#
#############
#############
#############
`;
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
`;

var level_3 = `
#############
######.....e#
######.....i#
######..##.##
#e......#...#
#i.e.#..#i.e#
######..#####
#p.........s#
#############
`;

var level_4 = `
#############
##...#...#.e#
##ei...#...i#
######.######
#s........e.#
###.##.######
###e##p######
######i######
#############
`;

var level_5 = `
#############
##e.i#.....##
###.##.###.##
#s.....###p##
######.######
###e.......##
#####i.e#ie##
#############
#############
`;

var level_6 = `
#############
#############
#############
#############
#############
#############
#############
#############
#############
`;

var levels = [level_1, level_2, level_3, level_4, level_5];
var paths = ["", "", "", "", ""];//These strings record the movement of the player so the shadowPlayer can follow their movements later
var secondTry = false;//signals if the player is on the second attempt of a level. 
var currentLevelIndex = 0;

// 30 * 32 = 960 for widdth
//height = 8 * 32 = 256


/* Program-wide Variables & Constants */
const gridSize = 32; /* size of each 'block' of the game screen. */
var takeInput = false;/* Variable determines if we read the keyboard or not */


/* Game Init Code */


var timer = 13; // Timer which when decrements every second and if time runs out player loses
var target = "e"; //which object to decrement the goal
var goal = 0; //this keeps track of how many more objects needs to be destroyed

var score = 0; //The Player's score!
var animationCounter = 0; //counter used for the level transition animation.
var transition = false; //tells the game if a level transition is happening
var this_level = levels[currentLevelIndex].split("\n");//turns the level template literal into a array
setupGoal(target);//counts number of targets in the level
takeInput = true;

var RFD;//0=time 1=wrong target 2=shadowPlayer

// init generator function for the shadow player movement
var moveShadowCounter = 0;
var shadowPlayerInterval = 290;



/* Player Sprite Loading */
var playerSprite = new Image();
playerSprite.src = "sprites/sprite_0.png";

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
shadowPlayerSprite.src = "sprites/sprite_shadowPlayer.png";

/* wall sprite */
var wallSprite = new Image();
wallSprite.src = "sprites/wall_2.png";


/* game object definitions */

/* enemy object */
let enemy = {
    width: gridSize,
    height: gridSize,
    color: "red"
};

/* hazard object */
let hazard = {
    width: gridSize,
    height: gridSize,
    color: "orange"
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
    x: 0,
    y: 0,
    key: 'p',
    color: "green"
};


/* shadowplayer */

let shadowPlayer = {
    width: gridSize,
    height: gridSize,
    x: 0,
    y: 0,
    key: 'p',
    color: "yellow"
};

/* LEVEL PARSING FUNCTIONS */

// this changes which level we are current on.
function gotoNextLevel() {
    
    if (secondTry == false){
        secondTry = true;
        this_level = levels[currentLevelIndex].split("\n");
        target = 'i';
        setupGoal(target);
        moveShadowCounter = 0;
        //
        player.key = 's';
    } else {
        secondTry = false;
        player.key = 'p';
        if (currentLevelIndex < levels.length-1){
            currentLevelIndex++;
            this_level = levels[currentLevelIndex].split("\n");
            target = 'e';
            setupGoal(target);
        } else {
            // game ending sequence
            clearInterval(main);
            gameWin();
            console.log("end of game");
        }
    }

}

/* calculates how many objects need to be destroyed before the player progresses */
function setupGoal(target) {
    let y;
    let x;
    goal = 0;
    for (y = 0; y < this_level.length; y++) {
        for (x = 0; x < this_level[1].length; x++) {
            if (this_level[y][x] == target) {
                goal++;
            }
        }
    }
}

var oldScore = 0;
function levelTransition(timeout) {

    // stop the timer
    clearTimeout(timerHandler);
    clearTimeout(shadowPlayerMoving)

    if(oldScore == 0){
        oldScore = timer;
        score += timer;
    }
    timerRunning = true;
    //add remaining time to the player's score
    
    timer = 13;

    ctx.fillStyle = "black";
    let levelHeight = (this_level.length - 2) * gridSize;
    if (animationCounter < levelHeight) {
        animationCounter++;
        setTimeout(function(){
            timeout = timeout/4
            levelTransition(timeout);
        }, timeout);
    } else {
        gotoNextLevel();
        levelTransitionEnd(100)
    }
}

function levelTransitionEnd(timeout) {
    if (animationCounter > 0) {
        animationCounter--;
        setTimeout(levelTransitionEnd, timeout / 2);
    } else {
        oldScore = 0;

        //allow the game to start "moving" again
        takeInput = true;
        transition = false;
        //timer restart
        timer = 13;
        timerRunning = false;
        clearTimeout(shadowPlayerMoving)
        if (secondTry == true) shadowPlayerMoving = setTimeout(moveShadowPlayer, shadowPlayerInterval);
    }
}




/* CANVAS DRAWING FUNCTIONS */

/* A function which writes out text 1 char at a time */
var slowTextCounter = 0;
var queueCounter = 0;
var slowTextHandler;
async function drawPixelTextSlow(message, x, y, size, delay, color="white"){

    if (queueCounter < message.length){
        if (slowTextCounter < message[queueCounter].length){
            if (message[queueCounter] === "narrator"){
                drawPixelText(message[queueCounter][slowTextCounter], x, y, size, false, "magenta");
                beepSnd.play();//make sound effect
            } else if (message[queueCounter] === '\n') {
                queueCounter++;
                slowTextCounter = -1;
                y += gridSize
                x = -8;
            } else if (message[queueCounter] === "stabbing robot 3000"){
                drawPixelText(message[queueCounter][slowTextCounter], x, y, size, false, "red");
                beepSnd.play();//make sound effect
            } else if (message[queueCounter] === "b"){
                //draw rectangles over previous message
                ctx.fillStyle = "black";
                let rectWidth = message[queueCounter-1].length * (size + 10);
                let rectX = x-(rectWidth+size+10);
                let rectHeight = size;
                ctx.fillRect(rectX, y, rectWidth, size*5);
                //now let's draw the next thing
                x = rectX;
            } else if (message[queueCounter] === 'c'){
                await sleep(1000);
                ctx.fillStyle = "black";
                ctx.fillRect(0, 32, 19 * gridSize, (this_level.length-2) * gridSize);
                if(score === 0){
                    drawPixelText("press space to skip", 200, (this_level.length-2) * gridSize, 1.50, false, "orange");
                }
                x = -20;
                y = 48;
            } else if ((message[queueCounter] === "hardware") || (message[queueCounter] === "limitations")) {
                drawPixelText(message[queueCounter][slowTextCounter], x, y, size, false, "rgb(249, 152, 240)");
                beepSnd.play();//make sound effect
            } else if(message[queueCounter] === "Good."){
                drawPixelText(message[queueCounter][slowTextCounter], x, y, size, false, "rgb(152, 249, 188)");
                beepSnd.play();//make sound effect
            } else if ( (message[queueCounter] === "Just remember WASD to move the robot") || (message[queueCounter] == "and to stab targets just move into them.") ) {
                drawPixelText(message[queueCounter][slowTextCounter], x, y, size, false, "rgb(249, 96, 19)");
                beepSnd.play();//make sound effect
            } else if (message[queueCounter] === "d"){
                await sleep(400);
            } else if (message[queueCounter] === "            STABBING NOISES"){
                drawPixelText(message[queueCounter][slowTextCounter], x, y, size, false, "red");
                //beepSnd.play();//make sound effect
            } else if (message[queueCounter] === "x"){
                let i;
                let sidebarX = (this_level.length + 2)
                for (i=0; i < 23; i++){
                    ctx.fillStyle = "black";
                    ctx.fillRect((sidebarX + 1) * gridSize - 20, 160, 180, 20);
                    drawnScore++;
                    goodSnd.play();
                    drawPixelText("score " + drawnScore.toString(), (sidebarX + 1) * gridSize - 20, 160, 3, true);
                    await sleep(25);
                }
                //queueCounter++;

            } else if (message[queueCounter] === "v") { 
                Mousetrap.unbind('space');
                main = setInterval(mainLoop, 25);
            } else {
                drawPixelText(message[queueCounter][slowTextCounter], x, y, size, false, color);
                beepSnd.play();//make sound effect
            }

            
            slowTextCounter++;
            slowTextHandler = setTimeout(function(){
                drawPixelTextSlow(message, x+size+10, y, size, delay, color);
            }, delay);

        } else {
            slowTextCounter = 0;
            queueCounter++;
            drawPixelTextSlow(message, x+size+10, y, size, delay, color);
        }
    } else{
        slowTextCounter = 0;
        queueCounter = 0;
    }
}

/* A function for drawing pixel font */
function drawPixelText(message, x, y, size, italics=false, color="white") {
    let i;
    let pixelX = x;
    let pixelY = y;

    ctx.fillStyle = color;
    message = message.toUpperCase();
    for (i = 0; i < message.length; i++) {
        let j;
        let drawY = pixelY;
        
        let drawX = pixelX;
        if (letters[message[i]] != undefined) {
            for (j = 0; j < letters[message[i]].length; j++) {
                let k;
                if(italics) pixelX += 1;        
                for (k = 0; k < letters[message[i]][j].length; k++) {
                    if (letters[message[i]][j][k] == 1) {
                        ctx.fillRect(drawX, drawY, size, size);
                    }
                    drawX += size;
                }
                drawY += size;
                drawX = pixelX;
            }
            pixelX += (letters[message[i]].length) * size;
        }
    }
}



var drawnScore = 0;
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
                    ctx.drawImage(wallSprite, x * gridSize, y * gridSize, wall.width, wall.height);
                    //ctx.fillRect(gridSize * x, gridSize * y, wall.width, wall.height);
                    break;
                case 'p':
                    /* placeholder graphics */
                    //console.log("drawing player");
                    //ctx.fillStyle = player.color;
                    if (secondTry == false) {
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
                    if (secondTry == true) {
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
    //console.log(this_level.length + 8);
    /** DRAW SIDE BAR  */
    ctx.fillStyle = "black";
    let sidebarX = (this_level.length + 2)
    ctx.fillRect(sidebarX * gridSize, 32, 6 * gridSize, (y - 2) * gridSize);
    /* draw score */
    if(drawnScore < score){ 
        drawnScore++;
        goodSnd.play();
    }
    drawPixelText("score " + drawnScore.toString(), (sidebarX + 1) * gridSize - 20, 160, 3, true);
    /* draw timer */
    drawPixelText("time: " + timer.toString(), (sidebarX + 1) * gridSize - 20, 210, 3, true);

    /* target draw */
    drawPixelText("target ", (sidebarX + 1) * gridSize - 20, 110, 3, true);
    if (target == 'i'){
        ctx.drawImage(innocentSprite, (sidebarX + 1) * gridSize + 100, 100, innocent.width, innocent.height);
    } else if (target == 'e'){
        ctx.drawImage(enemySprite, (sidebarX + 1) * gridSize + 100, 100, enemy.width, enemy.height);
    }


    if (transition == true) {
        ctx.fillStyle = "black";
        let levelWidth = (this_level[1].length) * gridSize;
        ctx.fillRect(0, 32, levelWidth, animationCounter);
    }

}

/* GAME INPUT FUNCTIONS */

function checkCollision(x, y) {
    switch (this_level[y][x]) {
        case '#':
            return false;

        
        case "E":
            return false;

        case "I":
            return false;
        case 's':
        case 'p':
            if (secondTry == true){
                RFD = 2;
                gameOver();
                return false;
            } else {
                return true;
            }

        
        case target:
            // change out the target
            // goodSnd.play();
            this_level[y] = splice(this_level[y], x, 1, target.toUpperCase());
            goal--;
            score += 10;
            if (goal <= 0) {
                transition = true;
                takeInput = false;
                animationCounter = 0;
                levelTransition(100);
            }
            return false;

        case 'i':
            if ('i' != target){
                this_level[y] = splice(this_level[y], x, 1, 'I');
                RFD = 1;
                gameOver();
            }
            return false;
        case 'e':
            if ('e' != target){
                this_level[y] = splice(this_level[y], x, y, "E");
                RFD = 1;
                gameOver();
            }
            return false;
        
        default:
            return true;
    }
};


// since strings are immutable I gotta completely change the array
function updatePlayerArray(dx, dy, object) {
    let replace = this_level[object.y + dy][object.x + dx];

    // using voca.js for splice function as to limit my frustration with manipulating immutable strings
    this_level[object.y + dy] = splice(this_level[object.y + dy], object.x + dx, 1, object.key);
    this_level[object.y] = splice(this_level[object.y], object.x, 1, replace);

    object.y += dy;
    object.x += dx;
}




/* GETTING GAME INPUT */

var inputDelay = 75;
var stopInput = false;

function resumeInput() {
    stopInput = false;
}

function movePlayer(dx, dy, direction){
    if ((takeInput) && (!stopInput)){
        if (checkCollision(player.x+dx, player.y+dy)){
            updatePlayerArray(dx, dy, player);
            //walkSnd.play();
            if(secondTry === false) { 
                paths[currentLevelIndex] = paths[currentLevelIndex] + direction;
            }
        }
        stopInput = true;
        setTimeout(resumeInput, inputDelay);
    }
}

Mousetrap.bind('w', function(){movePlayer(0, -1, 'n')}, 'keypress');
Mousetrap.bind('s', function(){movePlayer(0, 1, 's')}, 'keypress');
Mousetrap.bind('a', function(){movePlayer(-1, 0, 'w')}, 'keypress');
Mousetrap.bind('d', function(){movePlayer(1, 0, 'e')}, 'keypress');
Mousetrap.bind('n', function(){
    transition = true;
    takeInput = false;
    animationCounter = 0;
    levelTransition(100);
});


/**/


/* MOVING SHADOW PLAYER */
var shadowPlayerMoving;

function moveShadowPlayer() {

    if (moveShadowCounter < paths[currentLevelIndex].length) {
        switch (paths[currentLevelIndex][moveShadowCounter]) {
            case 'n':
                if (checkCollision(shadowPlayer.x, shadowPlayer.y - 1)) updatePlayerArray(0, -1, shadowPlayer);
                break;
            case 's':
                if (checkCollision(shadowPlayer.x, shadowPlayer.y + 1)) updatePlayerArray(0, 1, shadowPlayer);
                break;
            case 'e':
                if (checkCollision(shadowPlayer.x + 1, shadowPlayer.y)) updatePlayerArray(1, 0, shadowPlayer);
                break;
            case 'w':
                if (checkCollision(shadowPlayer.x - 1, shadowPlayer.y)) updatePlayerArray(-1, 0, shadowPlayer);
                break;
        }
        moveShadowCounter++;
    }
    
    //console.log(paths[currentLevelIndex][moveShadowCounter]);

    /* Kill Target Code */

    if (this_level[shadowPlayer.y-1][shadowPlayer.x] == 'e'){
        this_level[shadowPlayer.y-1] = splice(this_level[shadowPlayer.y-1], shadowPlayer.x, 1, "E");
    } else if (this_level[shadowPlayer.y+1][shadowPlayer.x] == 'e'){
        this_level[shadowPlayer.y+1] = splice(this_level[shadowPlayer.y+1], shadowPlayer.x, 1, "E");
    } else if (this_level[shadowPlayer.y][shadowPlayer.x+1] == 'e'){
        this_level[shadowPlayer.y] = splice(this_level[shadowPlayer.y], shadowPlayer.x+1, 1, "E");
    } else if (this_level[shadowPlayer.y][shadowPlayer.x-1] == 'e') {
        this_level[shadowPlayer.y] = splice(this_level[shadowPlayer.y], shadowPlayer.x-1, 1, "E");
    }

    shadowPlayerMoving = setTimeout(moveShadowPlayer, shadowPlayerInterval);
}

/* GAME OVER CODE */

var gameOverCounter = 0;
function gameOver(){
    takeInput = false; //stop player from moving
    killSnd.play(); //play sound

    /* Clear any loops */
    clearTimeout(shadowPlayerMoving);
    clearInterval(main);
    //clearTimeout(timerHandler);
 
    //ANIMATION
    gameOverCounter = 0;
    drawGameOver(0.025);


}
var gameoverHandler;
function drawGameOver(timeout){
    ctx.fillStyle = "red";
    let levelWidth = (this_level[1].length + 6) * gridSize;
    ctx.fillRect(0, 32, levelWidth, gameOverCounter);
    let levelHeight = (this_level.length - 2) * gridSize;
    if (gameOverCounter < levelHeight){
        gameOverCounter++;
        gameoverHandler = setTimeout(drawGameOver, timeout);
    } else {
        // include score?
        drawPixelText("G A M E O V E R", levelWidth/4, levelHeight/2, 4);

        switch(RFD){
            case 0:
                drawPixelText("TIME RAN OUT", levelWidth/4, levelHeight/1.5, 2);
                break;
            case 1:
                drawPixelText("YOU KILLED THE INCORRECT TARGET", levelWidth/4, levelHeight/1.5, 2);
                break;
            case 2:
                drawPixelText("YOU GOT KILLED BY YOUR PAST SELF", levelWidth/4, levelHeight/1.5, 2);
                break;
        }

        drawPixelText("PRESS R TO RESTART", levelWidth/4, levelHeight/1.2, 2);
        Mousetrap.bind("r", function(){
            Mousetrap.unbind("r");
            //reset level

            clearTimeout(gameoverHandler);

            timer = 13;
            
            clearTimeout(shadowPlayerMoving);
            moveShadowCounter = 0;
            if(secondTry == false){
                target = 'e';
            } else{
                target = 'i';
                shadowPlayerMoving = setTimeout(moveShadowPlayer, 200);
            }
            score = 0;
            drawnScore = 0;
            animationCounter = 0;
            transition = false;
            this_level = levels[currentLevelIndex].split("\n");
            goal = 0;
            setupGoal(target);
            takeInput = true;
            
            main = setInterval(mainLoop, 25);
            
        });
        
    }
}


/*Main game event loop */

var timerRunning = false;
var timerHandler;
function updateTimer(){
    if (timer > 0){
        timer--;
    } else {
        RFD = 0;
        gameOver();
    }
    timerRunning = false; //set to false so another timeout can start 
}


function mainLoop() {
    //draw the game
    //console.log('running....');
    if (timerRunning == false){
        timerRunning = true;
        timerHandler = setTimeout(updateTimer, 1000);
    }
    drawLevel(this_level);

}


// title screen
let titleContents = [
    "Hello dear player.  It is I the",
    "narrator",
    "!",
    "d",
    "\n",
    "And you are the",
    "stabbing robot 3000",
    "\n",
    "your task is to stab",
    "m y political opponents",
    "b",
    "very bad people.",
    "\n",
    "d",
    "This would be a simple task but due to",
    "hardware",
    "\n",
    "limitations",
    "you will have to kill half the targets",
    "\n",
    "within two 13 second chunks. ",
    "\n",
    "The side bar will inform you of your target",
    "\c",
    "If you stab the wrong target you will recieve",
    "\n",
    "a gameover. Also when you kill the second half",
    "\n",
    "of targets you'll have to avoid yourself killing",
    "\n",
    "the first half of targets.",
    "\n",
    "Confusing?",
    "d",
    "d",
    "d",
    "Good.",
    "\n",
    "Just remember WASD to move the robot",
    "\n",
    "and to stab targets just move into them.",
    "d","d","d","d","d",
    "v"
];





var main;
function titleScreen(){
    let gameX = 5;
    let gameY = 48;
    let fontSize = 2;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 32, 19 * gridSize, (this_level.length-2) * gridSize);
    drawPixelTextSlow(titleContents, gameX, gameY, fontSize, 65);
    
    drawPixelText("press space to skip", 200, (this_level.length-2) * gridSize, 1.50, false, "orange");
    Mousetrap.bind('space', function(){
        clearTimeout(slowTextHandler);
        Mousetrap.unbind('space');
        slowTextCounter = 0;
        queueCounter = 0;
        main = setInterval(mainLoop, 25);
    });
}

//first screen player sees
function splashScreen(){
    let alignX = 60;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 32, 19 * gridSize, (this_level.length-2) * gridSize);
    drawPixelText("BACKSTABBERS", alignX, 48, 7, true, "red");
    drawPixelText("BACKSTABBERS", alignX+3, 50, 7, true, "lime");

    drawPixelText("A GAME ABOUT STABBING", alignX+20, 90, 3, true, "lime");

    drawPixelText("PRESS ENTER TO START GAME", 90, 180, 2, false, "red");
    drawPixelText("PRESS ENTER TO START GAME", 91, 180, 2, false, "lime");
    

    drawPixelText("PRESS S TO BUY SKINS", 90, 240, 2, false, "red");
    drawPixelText("PRESS S TO BUY SKINS", 91, 240, 2, false, "lime");

    //drawPixelText("JavaScript ");

    Mousetrap.bind("enter", function(){
        Mousetrap.unbind("enter");
        titleScreen();
    });
}


function gameWin(){

    let endscreenText = [
        "GOOD JOB!",
        "\n",
        "You have taken down all the targets.",
        "\n",
        "You even netted a total of " + score + " points!",
        "\n",
        "HOWEVER, this is not the end of our journey,",
        "\n",
        "stabbing robot 3000",
        "there will inevitably be",
        "\n",
        "more targets to be stabbed during my",
        "\n",
        "illegal seizure of power               ",
        "b",
        'LEGITIMATE CAMPAIGN.',
        "\c",
        "so uhh.. great  job hero!",
        "d",
        "\n",
        "err..",
        "d",
        "power off?",
        "d",
        "d",
        "d",
        "\n",
        "wait what are you doing with that knife?",
        "\n",
        "d",
        "d",
        "TURN OFF  ROBOT!   STOP!",
        "\n",
        "d","d",
        "I DEMAND YOU STOP ROBOT",
        "d",
        "\n",
        "ROBOT TURN OF F",
        "\n",
        "            STABBING NOISES",
        "d","d","d", "d","d","d","d",
        "x",//pointgag
        "\c",
        "d","d","d","d","d","d","d","d","d",
        "\n",
        "you win.",
        "d","d","d","d","d","d","d","d","d",
        "\n",
        "\c",
        "Here's some trivia:",
        "\n",
        "Backstabbers was remorsefully developed by",
        "\n",
        "Milan Donhowe",
        "for the 2019 13kb JS GameJam",
        "\n",
        "Libraries used include:",
        '\n',
        "Voca.js",
        "Mousetrap",
        "PixelFont",
        "And TinyMusic."
    ];

    //let gameX = 0;
    //let gameY = 54;
    let fontSize = 2;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 32, 19 * gridSize, (this_level.length-2) * gridSize);
    drawPixelTextSlow(endscreenText, 5, 54, fontSize, 50);


}


function endGame(bool){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 32, 19 * gridSize, (this_level.length-2) * gridSize);
    if(bool){
        //kill narrator
        console.log('z pressed');
    } else {
        // end game credit
        let endingText = [
            "\c",
            "SHUTTING DOWN PROCESSES",
            "d",
            "d",
            "d",
            "COMPLETE.",
        ];
        drawPixelTextSlow(endingText, 0, 32, 2, 50);
    }
    let endingText = [
        "\c",
        "Wait,",
        "stabbing robot 3000",
        "what are yo-",
        "\n",
        "d",
        "STABBING SOUNDS",
        "d",
        "d",
        "d",
        "d",
        "d",
        "scorejoke"
    ];
    drawPixelTextSlow(endingText, 0, 32, 2, 50);

}


splashScreen();
