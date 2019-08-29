'use strict';const canvas=document.getElementById("screen");const ctx=canvas.getContext('2d');function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
var level_1=`
#############
#..s........#
#...........#
#.......i...#
#.p.........#
#.......e...#
#############
#############
#############
`;var level_2=`
#############
#...####....#
#.#.####e.i.#
#.#....#....#
#.####.#.####
#....#.#....#
####.#.####.#
#p..s#......#
#############
`;var level_3=`
#############
######.....e#
######.....i#
######..##.##
#e......#...#
#i.e.#..#i.e#
######..#####
#p.........s#
#############
`;var level_4=`
#############
##...#...#.e#
##ei...#...i#
######.######
#s........e.#
###.##.#.####
###e##p#i####
######i######
#############
`;var level_5=`
#############
##e.i#.....##
###.##.###.##
#s.....###p##
######.######
###e.......##
#####i.e#ie##
#############
#############
`;var level_6=`
#############
#############
#############
#############
#############
#############
#############
#############
#############
`;var levels=[level_1,level_2,level_3,level_4,level_5];var paths=["","","","",""];var secondTry=!1;var currentLevelIndex=0;const gridSize=32;var takeInput=!1;var timer=13;var target="e";var goal=0;var score=0;var animationCounter=0;var transition=!1;var this_level=levels[currentLevelIndex].split("\n");setupGoal(target);takeInput=!0;var moveShadowCounter=0;var shadowPlayerInterval=290;var playerSprite=new Image();playerSprite.src="sprites/sprite_0.png";var enemySprite=new Image();enemySprite.src="sprites/target0.png";var innocentSprite=new Image();innocentSprite.src="sprites/target2.png";var deadEnemySprite=new Image();deadEnemySprite.src="sprites/target1.png";var deadInnocentSprite=new Image();deadInnocentSprite.src="sprites/target3.png";var shadowPlayerSprite=new Image();shadowPlayerSprite.src="sprites/sprite_shadowPlayer.png";var wallSprite=new Image();wallSprite.src="sprites/wall_2.png";let enemy={width:gridSize,height:gridSize,color:"red"};let hazard={width:gridSize,height:gridSize,color:"orange"};let innocent={width:gridSize,height:gridSize,color:"blue"};let wall={width:gridSize,height:gridSize,color:"black"};let player={width:gridSize,height:gridSize,x:0,y:0,key:'p',color:"green"};let shadowPlayer={width:gridSize,height:gridSize,x:0,y:0,key:'p',color:"yellow"};function gotoNextLevel(){if(secondTry==!1){secondTry=!0;this_level=levels[currentLevelIndex].split("\n");target='i';setupGoal(target);moveShadowCounter=0;player.key='s'}else{secondTry=!1;player.key='p';if(currentLevelIndex<levels.length-1){currentLevelIndex++;this_level=levels[currentLevelIndex].split("\n");target='e';setupGoal(target)}else{clearInterval(main);gameWin();console.log("end of game")}}}
function setupGoal(target){let y;let x;goal=0;for(y=0;y<this_level.length;y++){for(x=0;x<this_level[1].length;x++){if(this_level[y][x]==target){goal++}}}}
var oldScore=0;function levelTransition(timeout){clearTimeout(timerHandler);clearTimeout(shadowPlayerMoving)
if(oldScore==0){oldScore=timer;score+=timer}
timerRunning=!0;timer=13;ctx.fillStyle="black";let levelHeight=(this_level.length-2)*gridSize;if(animationCounter<levelHeight){animationCounter++;setTimeout(levelTransition,timeout/2)}else{gotoNextLevel();levelTransitionEnd(100)}}
function levelTransitionEnd(timeout){if(animationCounter>0){animationCounter--;setTimeout(levelTransitionEnd,timeout/2)}else{oldScore=0;takeInput=!0;transition=!1;timer=13;timerRunning=!1;clearTimeout(shadowPlayerMoving)
if(secondTry==!0)shadowPlayerMoving=setTimeout(moveShadowPlayer,shadowPlayerInterval)}}
var slowTextCounter=0;var queueCounter=0;var slowTextHandler;async function drawPixelTextSlow(message,x,y,size,delay,color="white"){if(queueCounter<message.length){if(slowTextCounter<message[queueCounter].length){if(message[queueCounter]==="narrator"){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"magenta")}else if(message[queueCounter]==='\n'){queueCounter++;slowTextCounter=-1;y+=gridSize
x=-8}else if(message[queueCounter]==="stabbing robot 3000"){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"red")}else if(message[queueCounter]==="b"){ctx.fillStyle="black";let rectWidth=message[queueCounter-1].length*(size+10);let rectX=x-(rectWidth+size+10);let rectHeight=size;ctx.fillRect(rectX,y,rectWidth,size*5);x=rectX}else if(message[queueCounter]==='c'){await sleep(1000);ctx.fillStyle="black";ctx.fillRect(0,32,19*gridSize,(this_level.length-2)*gridSize);drawPixelText("press space to skip",200,(this_level.length-2)*gridSize,1.50,!1,"orange");x=-20;y=48}else if((message[queueCounter]==="hardware")||(message[queueCounter]==="limitations")){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"rgb(249, 152, 240)")}else if(message[queueCounter]==="Good."){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"rgb(152, 249, 188)")}else if((message[queueCounter]==="Just remember WASD to move the robot")||(message[queueCounter]=="and to stab targets just move into them.")){drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,"rgb(249, 96, 19)")}else{drawPixelText(message[queueCounter][slowTextCounter],x,y,size,!1,color)}
slowTextCounter++;slowTextHandler=setTimeout(function(){drawPixelTextSlow(message,x+size+10,y,size,delay,color)},delay)}else{slowTextCounter=0;queueCounter++;drawPixelTextSlow(message,x+size+10,y,size,delay,color)}}}
function drawPixelText(message,x,y,size,italics=!1,color="white"){let i;let pixelX=x;let pixelY=y;ctx.fillStyle=color;message=message.toUpperCase();for(i=0;i<message.length;i++){let j;let drawY=pixelY;let drawX=pixelX;if(letters[message[i]]!=undefined){for(j=0;j<letters[message[i]].length;j++){let k;if(italics)pixelX+=1;for(k=0;k<letters[message[i]][j].length;k++){if(letters[message[i]][j][k]==1){ctx.fillRect(drawX,drawY,size,size)}
drawX+=size}
drawY+=size;drawX=pixelX}
pixelX+=(letters[message[i]].length)*size}}}
var drawnScore=0;function drawLevel(level_array){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.lineWidth=1;let y,x;for(y=0;y<level_array.length;y++){for(x=0;x<level_array[y].length;x++){switch(level_array[y][x]){case '#':ctx.fillStyle=wall.color;ctx.drawImage(wallSprite,x*gridSize,y*gridSize,wall.width,wall.height);break;case 'p':if(secondTry==!1){player.x=x;player.y=y;ctx.drawImage(playerSprite,player.x*gridSize,player.y*gridSize,player.width,player.height)}else{shadowPlayer.x=x;shadowPlayer.y=y;ctx.drawImage(shadowPlayerSprite,shadowPlayer.x*gridSize,shadowPlayer.y*gridSize,shadowPlayer.width,shadowPlayer.height)}
break;case 's':if(secondTry==!0){player.x=x;player.y=y;ctx.drawImage(playerSprite,player.x*gridSize,player.y*gridSize,player.width,player.height)}
break;case 'e':ctx.fillStyle=enemy.color;ctx.drawImage(enemySprite,x*gridSize,y*gridSize,enemy.width,enemy.height);break;case "E":ctx.drawImage(deadEnemySprite,x*gridSize,y*gridSize,gridSize,gridSize);break;case "I":ctx.drawImage(deadInnocentSprite,x*gridSize,y*gridSize,gridSize,gridSize);break;case 'i':ctx.fillStyle=innocent.color;ctx.drawImage(innocentSprite,x*gridSize,y*gridSize,innocent.width,innocent.height);break;default:break}}}
console.log(this_level.length+8);ctx.fillStyle="black";let sidebarX=(this_level.length+2)
ctx.fillRect(sidebarX*gridSize,32,6*gridSize,(y-2)*gridSize);if(drawnScore<score)drawnScore++;drawPixelText("score "+drawnScore.toString(),(sidebarX+1)*gridSize-20,160,3,!0);drawPixelText("time: "+timer.toString(),(sidebarX+1)*gridSize-20,210,3,!0);drawPixelText("target ",(sidebarX+1)*gridSize-20,110,3,!0);if(target=='i'){ctx.drawImage(innocentSprite,(sidebarX+1)*gridSize+100,100,innocent.width,innocent.height)}else if(target=='e'){ctx.drawImage(enemySprite,(sidebarX+1)*gridSize+100,100,enemy.width,enemy.height)}
if(transition==!0){ctx.fillStyle="black";let levelWidth=(this_level[1].length)*gridSize;ctx.fillRect(0,32,levelWidth,animationCounter)}}
function checkCollision(x,y){switch(this_level[y][x]){case '#':return!1;case "E":return!1;case "I":return!1;case 's':case 'p':if(secondTry==!0){gameOver();return!1}else{return!0}
case target:this_level[y]=splice(this_level[y],x,1,target.toUpperCase());goal--;score+=10;if(goal<=0){transition=!0;takeInput=!1;animationCounter=0;levelTransition(100)}
return!1;case 'i':if('i'!=target){this_level[y]=splice(this_level[y],x,1,'I');gameOver()}
return!1;case 'e':if('e'!=target){this_level[y]=splice(this_level[y],x,y,"E");gameOver()}
return!1;default:return!0}};function updatePlayerArray(dx,dy,object){let replace=this_level[object.y+dy][object.x+dx];this_level[object.y+dy]=splice(this_level[object.y+dy],object.x+dx,1,object.key);this_level[object.y]=splice(this_level[object.y],object.x,1,replace);object.y+=dy;object.x+=dx}
var inputDelay=75;var stopInput=!1;function resumeInput(){stopInput=!1}
function movePlayer(dx,dy,direction){if((takeInput)&&(!stopInput)){if(checkCollision(player.x+dx,player.y+dy)){updatePlayerArray(dx,dy,player);if(secondTry===!1){paths[currentLevelIndex]=paths[currentLevelIndex]+direction}}
stopInput=!0;setTimeout(resumeInput,inputDelay)}}
Mousetrap.bind('w',function(){movePlayer(0,-1,'n')},'keypress');Mousetrap.bind('s',function(){movePlayer(0,1,'s')},'keypress');Mousetrap.bind('a',function(){movePlayer(-1,0,'w')},'keypress');Mousetrap.bind('d',function(){movePlayer(1,0,'e')},'keypress');var shadowPlayerMoving;function moveShadowPlayer(){if(moveShadowCounter<paths[currentLevelIndex].length){switch(paths[currentLevelIndex][moveShadowCounter]){case 'n':if(checkCollision(shadowPlayer.x,shadowPlayer.y-1))updatePlayerArray(0,-1,shadowPlayer);break;case 's':if(checkCollision(shadowPlayer.x,shadowPlayer.y+1))updatePlayerArray(0,1,shadowPlayer);break;case 'e':if(checkCollision(shadowPlayer.x+1,shadowPlayer.y))updatePlayerArray(1,0,shadowPlayer);break;case 'w':if(checkCollision(shadowPlayer.x-1,shadowPlayer.y))updatePlayerArray(-1,0,shadowPlayer);break}
moveShadowCounter++}
if(this_level[shadowPlayer.y-1][shadowPlayer.x]=='e'){this_level[shadowPlayer.y-1]=splice(this_level[shadowPlayer.y-1],shadowPlayer.x,1,"E")}else if(this_level[shadowPlayer.y+1][shadowPlayer.x]=='e'){this_level[shadowPlayer.y+1]=splice(this_level[shadowPlayer.y+1],shadowPlayer.x,1,"E")}else if(this_level[shadowPlayer.y][shadowPlayer.x+1]=='e'){this_level[shadowPlayer.y]=splice(this_level[shadowPlayer.y],shadowPlayer.x+1,1,"E")}else if(this_level[shadowPlayer.y][shadowPlayer.x-1]=='e'){this_level[shadowPlayer.y]=splice(this_level[shadowPlayer.y],shadowPlayer.x-1,1,"E")}
shadowPlayerMoving=setTimeout(moveShadowPlayer,shadowPlayerInterval)}
var gameOverCounter=0;function gameOver(){takeInput=!1;clearTimeout(shadowPlayerMoving);clearInterval(main);gameOverCounter=0;drawGameOver(0.025)}
function drawGameOver(timeout){ctx.fillStyle="red";let levelWidth=(this_level[1].length+6)*gridSize;ctx.fillRect(0,32,levelWidth,gameOverCounter);let levelHeight=(this_level.length-2)*gridSize;if(gameOverCounter<levelHeight){gameOverCounter++;setTimeout(drawGameOver,timeout)}else{drawPixelText("G A M E O V E R",levelWidth/4,levelHeight/2,4);drawPixelText("PRESS R TO RESTART",levelWidth/4,levelHeight/1.2,2);Mousetrap.bind("r",function(){Mousetrap.unbind("r");timer=13;clearTimeout(shadowPlayerMoving);moveShadowCounter=0;if(secondTry==!1){target='e'}else{target='i';moveShadowPlayer()}
score=0;animationCounter=0;transition=!1;this_level=levels[currentLevelIndex].split("\n");goal=0;setupGoal(target);takeInput=!0;main=setInterval(mainLoop,25)})}}
var timerRunning=!1;var timerHandler;function updateTimer(){if(timer>0){timer--}else{gameOver()}
timerRunning=!1}
function mainLoop(){if(timerRunning==!1){timerRunning=!0;timerHandler=setTimeout(updateTimer,1000)}
drawLevel(this_level)}
let titleContents=["Hello dear player.  It is I the","narrator","!","\n","And you are the","stabbing robot 3000","\n","your task is to stab","m y political opponents","b","very bad people.","\n","This would be a simple task but due to","hardware","\n","limitations","you will have to kill half the targets","\n","within two 13 second chunks. ","\n","The side bar will inform you of your target","\c","If you stab the wrong target you will recieve","\n","a gameover. Also when you kill the second half","\n","of targets you'll have to avoid yourself killing","\n","the first half of targets.","\n","Confusing?","Good.","\n","Just remember WASD to move the robot","\n","and to stab targets just move into them."];let endscreenText=["GOOD JOB!","You have taken down all the targets.","\n","You even netted a total of "+score+" points!","\n","HOWEVER, this is not the end of our journey","\n","stabbing robot 3000","there will inevitably be","\n","more targets to be stabbed during","\n","my illegal seizure of power","b",'LEGITIMATE CAMPAIGN.',"\n","so uhh.. great  job hero!","\n","err.. power off?"];var main;function titleScreen(){let gameX=5;let gameY=48;let fontSize=2;ctx.fillStyle="black";ctx.fillRect(0,32,19*gridSize,(this_level.length-2)*gridSize);drawPixelTextSlow(titleContents,gameX,gameY,fontSize,65);drawPixelText("press space to skip",200,(this_level.length-2)*gridSize,1.50,!1,"orange");Mousetrap.bind('space',function(){clearTimeout(slowTextHandler);Mousetrap.unbind('space');main=setInterval(mainLoop,25)})}
function gameWin(){let gameX=5;let gameY=48;let fontSize=2;ctx.fillStyle="black";ctx.fillRect(0,32,19*gridSize,(this_level.length-2)*gridSize);drawPixelTextSlow(endscreenText,gameX,gameY,fontSize,50)}
titleScreen()