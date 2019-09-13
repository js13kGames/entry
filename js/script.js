var frameRate=30;
// level length
let sunDownFrame = frameRate*200;

// canvas size
let canvasH = 570;
let canvasW = window.innerWidth;

// sun starting position
let sunStart=canvasH*0.5;
let sunPos = {x:canvasW/4,y:sunStart};

var context;
var player;
var bgm;
let ground = [];
let babies = [];
let baddies = [];
let alphabet = [];
let particles = [];
let gameLoop;
let clouds = [];
// ground friction
let stopSpeed = 0.4;

// image cascade in effect
let trace =0; // counter reset
let traceSpeed = 0.1;

// level stuff
let currentLevel = {};
let phase;
let currentPhase=0;

var yShift =0;
var frame=0;
let babiesReturned = 0;
let introSeq =0;
let level =0;
let naps =0;
let thankYouText = "";
let timeLeft =0;
let levelRange=0;

// click box
let clickA={x:0,y:0,w:200,h:50};
let clickB={x:0,y:0,w:200,h:50};
// screen to display
let currentScreen = "start";
let currentText = introTxt;

let startPos;
let inputLeft = false;
let inputRight = false;
let chirping = false;
let gameOver = false;

// canvas object from w3 school
// https://www.w3schools.com/tags/ref_canvas.asp

var canvas = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = canvasW;
    this.canvas.height = canvasH;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// preload()
//
// called on load:
// preload images and start canvas.
// display an intro screen prompting user to click, which will enable sound
// and start the game.

function preload(){

  // preload images
  unpackAll();

  // start canvas
  canvas.start();

  // place click boxes
  clickA.x = canvasW/2-clickA.w;
  clickA.y = canvasH/2+100;
  clickB.x = canvasW/2+40;
  clickB.y = clickA.y;

  runStartScreen();
}

function runStartScreen(){
  // run start screen animation
  gameLoop = setInterval(function(){

    // display text
    displayStartScreen();

    trace+=traceSpeed;
    frame++;
  },1000/frameRate);
}

// displaystartscreen()
//
// display title and click box

function displayStartScreen(){

  // update title color
  let c1 = 2.5*(frame%100);
  let c2 = 165+Math.sin(frame/100)*60;
  // display title
  displayText("ape naps",canvasW/2-150, canvasH/2-50, 0, "rgb("+c1+","+c2+","+50+")", 35,true);
  let posY = clickA.y+17;
  // display click box text
  displayText("time trial",clickA.x+17, posY, 0, "black", 12,false);
  displayText("practice",clickB.x+30, posY, 0, "black", 12,false);

  // display click box
  ctx.beginPath();
  ctx.strokeStyle ="black";
  ctx.rect( clickA.x,clickA.y,clickA.w,clickA.h );
  ctx.rect( clickB.x,clickB.y,clickB.w,clickB.h );
  ctx.stroke();
  ctx.closePath();

}

//

// startGame()
// called when click box is clicked.
// finish game setup, load intro screen

function startGame() {

  // start game loop
  clearInterval(gameLoop)
  gameLoop = setInterval(updateGameArea, 1000/frameRate);
  currentScreen="introscreen" // or currentScreen="nada"
  frame =0;
  trace =0;

  // load level 1
  currentLevel = level1;
  setupLevel(currentLevel);

  // display intro text in a sequence
  shootTextSequence();

  // "wakeplayer" enables starting the round on click
  setTimeout(function(){ currentScreen="wakeplayer"; }, (currentText.length-1)*1000)
}


// shootTextSequence()
//
// display intro text array in a sequence

function shootTextSequence(){
  for (let i=0; i<currentText.length; i++){
    setTimeout(function(){ if(introSeq<currentText.length) introSeq ++; },i*1000);
  }
}

// updateGameArea():
//
// main game loop

function updateGameArea() {

  canvas.clear();

  if(!player.sleeping &&!gameOver){

    // IF GAME RUNNING
    currentScreen = "game";

    // calculate time left
    timeLeft = Math.floor((sunDownFrame - frame)/frameRate);

    // call this before any bird chirps so that two dont chirp at the
    // same time and break your years
    chirping = false;

    player.updateMotion();
    player.newPos();
    displayBackground(); // update and display background
    updateAll(clouds);
    updateAll(particles); // display any particles
    displayGround(); // display ground 0
    displayAll(ground); // display platforms
    displayReturnPoint(); // display "home" point

    player.display(); // display player
    updateAll(baddies); // update and display tigers and birds
    updateAll(babies); // update and display babies

    // display time, naps taken and babies returned
    if(timedRun) displayText("sundown in "+timeLeft.toString(), 20,25,0,"white",25,false);
    else displayText("press m to quit", 20,25,0,"white",25,false);
    displayText("naps "+naps, canvasW-160,19,0,"white",19,false);
    displayText("babies returned "+babiesReturned, canvasW-425,45,0,"white",19,false);

    // check for round or level complete
    continueLevel();

  }
  else if(gameOver){

    // IF CURRENTLY ON GAME OVER SCREEN

    // if you completed the game, my thank yous!
    displayText(thankYouText, canvasW/4, canvasH/2,0,"black",canvasW/150,true)
    // display game over text and prompt starting over
    displayText("game over. click to start again ", canvasW/4, canvasH/2+50,0,"black",canvasW/150,true)
  }
  else {

    // IF CURRENTLY ON NAPPING SCREEN

    // trigger particles constantly
    triggerParticles(
      flRand(player.x,player.x+160),
      flRand(player.y-200,player.y-0),
      [
        {r:225,g:200,b:10},
        {r:225,g:20,b:10},
        {r:25,g:200,b:10},
        {r:25,g:20,b:210}
      ]
    );

    // show click to skip text
    if(introSeq<currentText.length)
    displayText("click to skip", canvasW-160,canvasH-30,0,"black",5,false);

    // update sky color and display background
    if(currentScreen==="introscreen")
    bgImage.c[0] = "rgb("+skyShades[6].r+","+skyShades[6].g+","+skyShades[6].b+")";
    drawBG();

    // display particles
    updateAll(particles);

    // draw some trees
    displayTree(trees[0],canvasW/2+100,150,8);
    displayTree(trees[1],canvasW/2-120,150,8);
    displayTree(trees[2],canvasW/2-280,100,8);

    // display player
    player.update();

    // display intro text sequence
    for(let i=0; i<introSeq; i++){
      displayText(currentText[i],48,48+i*20,400,"black",10,true);
      displayText(currentText[i],50,50+i*20,400,"gold",10,true);
    }
  }

  // run background music
  runBGM();
  
  // increment image tracing and game frame values
  trace+=traceSpeed;
  frame++;
}

function resetGame(){
  currentLevel = level1;
  level = 0;
  naps =0;
  currentPhase =0;
  gameOver = false;

  // reset text
  currentText = introTxt;
  currentScreen  ="start"
  introSeq =0;
  player.sleeping = false;
  trace=0;
  canvas.clear();
  clearInterval(gameLoop)
  runStartScreen();
}

// displayreturnpoint()
//
// displays the ape home

function displayReturnPoint(){

  let posX = canvasW/2 - (player.x-startPos.x);
  let posY = startPos.y-yShift-80;

  displayImage(homeImg.a,homeImg.c, posX,posY,25,4,1);
  displayText(" vv return point vv ", posX-55,posY-20,0,c[23],8,true);
  displayText("press a, d and space to move.", posX-105,posY-40,0,c[23],8,true);

}
