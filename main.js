//Canvas related variables
let canvas;
let width = document.documentElement.clientWidth - 35;
let height = document.documentElement.clientHeight - 30;
let ctx;
//Class instances
let player;
let robot;
let light;
let monsters = [];
//Proprieties of the game; Change for different behaviours;
let angle = 0;
let lightRadius = 45;
let velocity = 10;
let monstersVelocity = 0.5;
let score = 0;
let maxMonsters = 3;
let purpleProb = 0.05;
//Proprieties that should not be changed;
let canShoot = true;
let gameStarted = false;
let animating = false;
let gameOverState = false;
let startConfigFlag = true;
let fastMonster = false;
let tankMonster = false;
let monsterSpawnInterval;
let timeInterval;
let time = {
  seconds:0,
  minutes:0
};
//Storing data variables
let shoots = [];
let mousePos = {};
let deathMarks = [];
let monsterSize = 40;

function startConfig(){
  //Creating the canvas and instantiating the classes;
  createCanvas(width, height);
  player = new Player(40,25,'orange',width/2,height/2);
  robot = new Robot(15,'red',width,height, lightRadius);
  light = new Light('#F9E4B7',canvas.width,canvas.height);
  //Adding event listeners to navigate on menu and game over screen
  window.addEventListener('keypress', function(){
    if(!animating && !gameStarted){
      animating = true;
      animation();
    }
    //Restart the proprieties after game over
    if(gameOverState){
      monsters = [];
      angle = 0;
      shoots = [];
      score = 0;
      canShoot = true;
      maxMonsters = 3;
      time = {
        seconds:0,
        minutes:0
      };
      gameStarted = false;
      animating = false;
      gameOverState = false;
      startConfigFlag = true;
      fastMonster = false;
      tankMonster = false;
      monstersVelocity = 0.5;
      clearInterval(timeInterval);
      clearInterval(monsterSpawnInterval);
      menu();
    }
  });
  menu();
}

function menu(){
  draw();
  ctx.beginPath();
  ctx.fillStyle = 'rgba(0, 0, 0,0.5)';
  ctx.fillRect(0,0,width,height);
  ctx.closePath();

  ctx.font = "60px Verdana";
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = 'white';
  ctx.textAlign = "center";
  ctx.fillText("Watch Your Back!",width/2,height/3);
  ctx.strokeText("Watch Your Back!",width/2,height/3);

  ctx.font = "30px Verdana";
  ctx.fillStyle = "red";
  ctx.strokeStyle = 'white';
  ctx.textAlign = "center";
  ctx.fillText("You control the red circle (Robot) and the orange triangle (Player).",width/2,height/2);
  ctx.strokeText("You control the red circle (Robot) and the orange triangle (Player).",width/2,height/2);
  ctx.fillText("The robot will aim its flashlight to your mouse position and the player will shoot",width/2,height/2+50);
  ctx.strokeText("The robot will aim its flashlight to your mouse position and the player will shoot",width/2,height/2+50);
  ctx.fillText("at the opposite way as you left click with the mouse.",width/2,height/2+100);
  ctx.strokeText("at the opposite way as you left click with the mouse.",width/2,height/2+100);
  ctx.fillText("Be careful with the green squares! (monsters!)",width/2,height/2+150);
  ctx.strokeText("Be careful with the green squares! (monsters!)",width/2,height/2+150);
  ctx.fillText("Press any key to start!",width/2,height/2+250);
  ctx.strokeText("Press any key to start!",width/2,height/2+250);
}

function animation(){
  let pAngle = 0;
  let rAngle = 0;
  let animationInterval = setInterval(function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(width/2,height/2,lightRadius,0,2*Math.PI);
    ctx.strokeStyle = 'grey';
    ctx.stroke();
    ctx.fillStyle = '#F9E4B7';
    ctx.fill();
    ctx.closePath();
    player.setAngle(pAngle);
    player.draw(ctx,false);
    robot.setAngle(rAngle);
    robot.draw(ctx);
    pAngle+=0.02;
    rAngle-=0.04;
    if(pAngle >= 6.28){
      clearInterval(animationInterval);
      let flashlight = true;
      let counter = 0;
      let flashlightInterval = setInterval(function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        flashlight = !flashlight;
        ctx.beginPath();
        ctx.arc(width/2,height/2,lightRadius,0,2*Math.PI);
        ctx.strokeStyle = 'grey';
        ctx.stroke();
        ctx.fillStyle = '#F9E4B7';
        ctx.fill();
        ctx.closePath();
        if(flashlight){
          light.setAngle(0);
          light.draw(ctx);
        }
        player.draw(ctx,flashlight);
        robot.draw(ctx);
        counter++;
        if(counter >= 5){
          clearInterval(flashlightInterval);
          animating = false;
          gameStarted = true;
          startGame();
        }
      },100);
    }
  },1);
}

function gameOver(){
  let animUp = 0;
  let gameOverInterval = setInterval(function(){
    ctx.save();
    ctx.translate(0,height-animUp);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(128,128,128,0.5)';
    ctx.fillRect(0,0,width,height);
    ctx.closePath();

    ctx.font = "30px Verdana";
    ctx.fillStyle = "red";
    ctx.strokeStyle = 'white';
    ctx.textAlign = "center";
    ctx.fillText("Game Over!",width/2,height/2);
    ctx.strokeText("Game Over!",width/2,height/2);
    let formatedMin = ("0" + time.minutes).slice(-2);
    let formatedSec = ("0" + time.seconds).slice(-2);
    ctx.fillText("Final Score: " + score,width/2,height/2+50);
    ctx.strokeText("Final Score: " + score,width/2,height/2+50);
    ctx.fillText("Final Time: " + formatedMin + ":" + formatedSec,width/2,height/2+100);
    ctx.strokeText("Final Time: " + formatedMin + ":" + formatedSec,width/2,height/2+100);
    ctx.fillText("Press any key to go back to the menu",width/2,height/2+150);
    ctx.strokeText("Press any key to go back to the menu",width/2,height/2+150);
    

    ctx.restore();
    if(animUp >= height){
      clearInterval(gameOverInterval);
      gameOverState = true;
    }
    animUp += 10;
  },20);
}

function startGame(){
  //Adding event listener for robot move and player shoot
  if(startConfigFlag){
    canvas.addEventListener('mousemove', function(e){
      getMousePos(e);
      let targetX = mousePos.x - (width/2);
      let targetY = mousePos.y - (height/2);
      angle = Math.atan2(targetY,targetX)-(90*Math.PI/180);
    });
    canvas.addEventListener('click',function(){
      if(canShoot && gameStarted){
        let vx = velocity*Math.cos(angle-(90*Math.PI/180));
        let vy = velocity*Math.sin(angle-(90*Math.PI/180));
        shoots.push(new Bullet(width/2,height/2,vx,vy));
        canShoot = false;
        setTimeout(function(){
          canShoot = true;
        },500);
      }
    });
    startConfigFlag = false;
  }
  //Starting the timers for the Frame update, clock and monster spawn frequency
  interval = setInterval(draw, 20);
  monsterSpawnInterval = setInterval(function(){
    maxMonsters++;
    purpleProb+=0.02;
    if(maxMonsters >= 5)
      fastMonster = true;
    if(maxMonsters >= 8)
      clearInterval(monsterSpawnInterval);
  },30000);
  timeInterval = setInterval(function(){
    time.seconds++;
    if(time.seconds == 60){
      time.seconds=0;
      time.minutes++;
    }
  },1000);
}

function createCanvas(width, height){
  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  document.body.insertBefore(canvas,document.body.firstChild);
  ctx = canvas.getContext("2d");
}

function draw(){
  //Instantiating monsters randomly offscreen and randomly type (green = normal, purple = fast)
  if(monsters.length < maxMonsters){
    let monsterType = Math.random();
    let random = Math.random();
    let monsterX, monsterY;
    if(random >= 0 && random < 0.25){
      monsterX = Math.random() * width;
      monsterY = -50;
    }
    else if(random >= 0.25 && random < 0.5){
      monsterX = width+50;
      monsterY = Math.random()*height;
    }
    else if(random >= 0.5 && random < 0.75){
      monsterX = Math.random() * width;
      monsterY = height + 50;
    }
    else{
      monsterX = -50;
      monsterY = Math.random()*height;
    }
    let vel = monstersVelocity;
    if(monsterType <= purpleProb && fastMonster)
      vel+=1;
    let targetX = (width/2) - monsterX;
    let targetY = (height/2) - monsterY;
    let v = Math.atan2(targetY,targetX);
    let vx = vel*Math.cos(v);
    let vy = vel*Math.sin(v);
    if(monsterType <= purpleProb && fastMonster)
      monsters.push(new Monster(monsterSize,'purple',monsterX,monsterY,vx,vy));
    else
      monsters.push(new Monster(monsterSize,'green',monsterX,monsterY,vx,vy));
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Light under the player
  ctx.beginPath();
  ctx.arc(width/2,height/2,lightRadius,0,2*Math.PI);
  ctx.strokeStyle = 'grey';
  ctx.stroke();
  ctx.fillStyle = '#F9E4B7';
  ctx.fill();
  ctx.closePath();

  //Robot's flashlight
  if(gameStarted){
    light.setAngle(angle);
    light.draw(ctx);
  }

  //Bullets shot by the player
  shoots.forEach((bullet,index) => {
    bullet.draw(ctx);
    if((bullet.x >= width+50) || (bullet.x <= -50) || (bullet.y >= height+50) || (bullet.y <= -50)){
      shoots.splice(index,1);
      delete bullet;
    }
    //Checking if any bullet hit any monster
    monsters.forEach((monster,monsterIndex) =>{
      hitMonster(monsterIndex,index);
    })
  });

  //Drawing player
  robot.setAngle(angle);
  robot.draw(ctx, width, height);

  /*Changing the next drawings to only appear on screen if they are on contact with any other
  element (creating the darkness and flashlight effect for the monsters)*/
  ctx.globalCompositeOperation='source-atop';

  //Drawing all the monsters spawned
  monsters.forEach(monster => {
    monster.draw(ctx);
    hitPlayer(monster);
  });

  //Setting drawing layer back to normal (last drawed appears on top)
  ctx.globalCompositeOperation='source-over';

  //When a monster is hit, place a red cross where it died for a few seconds
  deathMarks.forEach(mark => {
    ctx.save();

    ctx.translate(mark.x,mark.y);

    ctx.beginPath();
    ctx.moveTo(-(monsterSize/4),-(monsterSize/4));
    ctx.lineTo(monsterSize/4,(-monsterSize/4));
    ctx.strokeStyle='red';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0,-(monsterSize/2));
    ctx.lineTo(0,monsterSize/2);
    ctx.strokeStyle='red';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  })

  //Drawing player
  player.setAngle(angle);
  player.draw(ctx,gameStarted);

  //Score and clock
  if(gameStarted){
    ctx.textAlign="left";
    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.strokeStyle = 'white';
    ctx.fillText("Score: "+score,10,35);
    ctx.strokeText("Score: "+score,10,35);

    let formatedMin = ("0" + time.minutes).slice(-2);
    let formatedSec = ("0" + time.seconds).slice(-2);
    ctx.font = "30px Verdana";
    ctx.fillStyle = "black";
    ctx.strokeStyle = 'white';
    ctx.fillText("Time: " + formatedMin + ":"+ formatedSec,width-200,35);
    ctx.strokeText("Time: " + formatedMin + ":"+ formatedSec,width-200,35);
  }
}

//Collision detection from bullet with monster (point collision with square)
function hitMonster(monsterIdx, bulletIdx){
  if(shoots[bulletIdx] != undefined){
    for(let i = 0; i < monsters[monsterIdx].size; i++){
      for(let j = 0; j < monsters[monsterIdx].size; j++){
        if(shoots[bulletIdx].x >= (monsters[monsterIdx].x-(monsters[monsterIdx].size/2)) &&
        shoots[bulletIdx].x <= (monsters[monsterIdx].x+(monsters[monsterIdx].size/2)) &&
        shoots[bulletIdx].y >= (monsters[monsterIdx].y-(monsters[monsterIdx].size/2)) &&
        shoots[bulletIdx].y <= (monsters[monsterIdx].y+(monsters[monsterIdx].size/2))){
          //Adding a death mark to the array to be drawn where the monster died
          deathMarks.push({x:monsters[monsterIdx].x,y:monsters[monsterIdx].y});
          setTimeout(function(){
            deathMarks.shift();
          },2000);
          //Removing monster and bullets from its' arrays and adding score
          monsters.splice(monsterIdx,1);
          shoots.splice(bulletIdx,1);
          score+=10;
          if(monsters[monsterIdx].color == 'purple')
            score+=10;
          return;
        }
      }
    }
  }
}

//Collision detection with monster and player (circle collision detection)
function hitPlayer(monster){
  var circle1 = {radius:monster.size/2, x:monster.x, y:monster.y};
  var circle2 = {radius:15, x:player.x, y:player.y};
  var dx = circle1.x - circle2.x;
  var dy = circle1.y - circle2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  //if there is colligion, game is over
  if (distance < circle1.radius + circle2.radius) {
      clearInterval(interval);
      gameOver();
  }
}

function getMousePos(e){
  let rect = canvas.getBoundingClientRect();
  mousePos = {
    x:e.clientX-rect.left,
    y:e.clientY-rect.top
  }
}