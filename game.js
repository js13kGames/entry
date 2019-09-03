palette = 0; palletename = "";
c = []; //0 is first bg color, 1 is second bg color, 2 is front block color, 3 is back block color, and 4 is hero color.
switchPalette(0);

x=game.getContext`2d`;

//Global variables
const TAU = Zdog.TAU;
const c_startverticalspeed = 8; //Vertical speed when starting kick
const c_addverticalspeed = 0.25;
const c_fallspeed = 1;
const c_dropspeed = 3;
const c_adddropspeed = 0.0025;
const c_jumpspeed = 5;
const c_addjumpspeed = 0.1;
const c_starttime = 30;
const c_startjackpot = 5;
const c_timegainperblock = 0.5;
const c_horborder = 200; //How wide the playing field is.

state = 0; //0 is title screen, 1 is gameplay
paused = false; //If the game is paused no step events will trigger.
canstartgame = false; //Set to true when HTML is fully loaded, and to prevent player to start a new game instantly after getting a game over
level = 50; //How long the stage should be the player is playing in.
playermovex = 0; playermovey = 1; //Direction the player's going into.
flipped = 1; flipvisual = 1;  //flipped controls in which direction gravity is, and also if the player is in the fore- or background. Flipvisual is a smoother version that is used to flip the camera.
flipy = 9000; fliptop = 0; flipbottom = 0; //If the player reaches flipy, the level becomes flipped. fliptop and flipbottom dictate where flipy should go to next once it's been reached.
cameray = 0; //This controls where the camera is currently looking at.
shakex = 0; shakey = 0; shakeduration = 0; //Control screen shake.
obstacle = []; visobstacle = []; //Optimalization array that only holds the blocks that are currently visible.
timeleft = c_starttime; timejackpot = c_startjackpot; score = 0; hiscore = 0; //timeleft ticks down, but gets refilled with the jackpot upon flipping.
bgcolor = c[0]; //Each time before the zdog illustration is updated, this color gets applied to the background.

const times = []; let fps; //Used to display FPS during debugging.

document.addEventListener("DOMContentLoaded", HtmlLoaded);

initGame();

setInterval(e=>{ step(false) },(1/60)*1000);

//Mobile input init
onkeydown=e=>{ input(e.key); }
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = 10;
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
const gestureZone = document.getElementById('game');

gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function initGame() {

    // init illo
    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        zoom: 2,
        resize: true,
        rotate: {x: -(TAU/16), y: TAU/16},
        onPrerender: function(ctx) {
            ctx.beginPath();
            ctx.rect(-1080, -1080, 1080*2, 1080*2);
            ctx.fillStyle = bgcolor;
            ctx.fill();
        },
    });

    player = new Zdog.Group({
        addTo: illo,
        transform: {z: 25}
    });

    new Zdog.Shape({ //body
        addTo: player,
        stroke: 24,
        color: c[4],
    });

    new Zdog.Shape({ //eyes
        addTo: player,
        stroke: 5,
        color: '#fff',
        translate: {z: 5},
        path: [
            { x: -6, y: -10 },          // start at top left
            { x: -6, y: 0 },          // line to top right
            { move: { x: 6, y: -10 } }, // move to bottom left
            { x: 6, y: 0 },          // line to bottom right
        ],
    });

    new Zdog.Shape({ // legs
        addTo: player,
        stroke: 5,
        color: c[4],
        translate: {y: 16, z: 5},
        path: [
            { x: -6, y: -10 },          // left leg at body
            { x: -6, y: 0 },          // to knee
            { x: -10, y: 0 },          // to toes
            { move: { x: 6, y: -10 } }, // right leg
            { x: 6, y: 0 },          // to knee
            { x: 10, y: 0 },          // to toes
        ],
    });

    border = new Zdog.Shape({
        addTo: illo,
        stroke: 8,
        color: c[1],
        path: [ //QQQ Don't make them so long but move with either player or camera
            { x: -c_horborder-10, y: -600 },          // start at top left
            { x: -c_horborder-10, y: 600 },          // line to top right
            { move: { x: c_horborder+10, y: -600 } }, // move to bottom left
            { x: c_horborder+10, y: 600 },          // line to bottom right
        ],
    });

    flipline = new Zdog.Shape({
        addTo: illo,
        stroke: 8,
        color: c[1],
        translate: {z: 25},
        path: [
            { x: -c_horborder*1 },
            { x: -c_horborder*0.9 },//dotted line
            { move: { x: -c_horborder*0.8 } },
            { x: -c_horborder*0.7 },
            { move: { x: -c_horborder*0.6 } },
            { x: -c_horborder*0.5 },
            { move: { x: -c_horborder*0.4 } },
            { x: -c_horborder*0.3 },
            { move: { x: -c_horborder*0.2 } },
            { x: -c_horborder*0.1},
            { move: { x: 0 } },
            { x: c_horborder*0.1 },
            { move: { x: c_horborder*0.2 } },
            { x: c_horborder*0.3 },
            { move: { x: c_horborder*0.4 } },
            { x: c_horborder*0.5 },
            { move: { x: c_horborder*0.6 } },
            { x: c_horborder*0.7 },
            { move: { x: c_horborder*0.8 } },
            { x: c_horborder*0.9 },
            { move: { x: c_horborder } },
            { x: c_horborder*1.1 },
        ],
    });

    resizeScreen();

    loadLevel(level);

    draw();
}

function loadLevel(lvlnumber) {
    //Clean up

    if (obstacle.length > 1)
    {
        for (var i = 0; i != obstacle.length; i++)
        {
            obstacle[i].remove();
            obstacle[i] = undefined;
            console.log("Obstacle removed");
        }
    }

    level = lvlnumber;

    if (state == 0) {player.visible = false;} //Demo mode for title screen
    else {player.visible = true;}

    seed = 1000*lvlnumber

    obstacle = []
    flipped = 1; flipvisual = 1; bgcolor = c[0]; 
    player.translate.x = 0; player.translate.y = 0; playermovex = 0; playermovey = c_fallspeed;
    timeleft = c_starttime; timejackpot = c_startjackpot; score = 0;
    illo.rotate = {x: -(TAU/16), y: TAU/16};

    //Build new
    var amount = (lvlnumber*2) + 1

    flipy = generateObstacles(lvlnumber*2,100,flipped)

    flipline.translate.y = flipy;
    fliptop = 0; flipbottom = flipy;

    console.log("Loaded level "+lvlnumber.toString())
}

function generateObstacles(amount,position,direction) {

    var off = 0;
    for (var i = 0; i != amount; i++)
    {
        var width = 0; var height = 0;
        var obstaclex = 0; var obstacley = 0;
        var front = (random() >= 0.2); if (flipped == -1) {front = !front}

        switch(Math.round(random()*10))
        {
            case 0: //Two tall platforms at same height
                height = 40+(random()*100)*direction;
                obstaclex = (random() * (c_horborder - -c_horborder) + -c_horborder) * 0.7;
                obstacley = position+off;

                obstacle[obstacle.length] = addObstacle(obstaclex,obstacley,16+(random()*32), height, front)
                obstacle[obstacle.length] = addObstacle(-obstaclex,obstacley,16+(random()*32), height, front)
                break;
            case 1: //Two tall platforms, one lower than the other
                height = 40+(random()*100)*direction;
                obstaclex = (random() * (c_horborder - -c_horborder) + -c_horborder) * 0.8;
                obstacley = position+off;

                obstacle[obstacle.length] = addObstacle(obstaclex,obstacley,16+(random()*32), height, front)
                obstacley += 50;
                obstacle[obstacle.length] = addObstacle(-obstaclex,obstacley,16+(random()*32), height, front)

                off += 50;
                break;
            case 2: //Funnel
                obstaclex = (random() * (c_horborder - -c_horborder) + -c_horborder) * 0.8;
                obstacley = position+off;
                height = 30;

                obstacle[obstacle.length] = addObstacle(obstaclex,obstacley,64, height, front);
                obstacley += 50;
                obstacle[obstacle.length] = addObstacle(obstaclex,obstacley,40, height, front);
                obstacley += 50;
                obstacle[obstacle.length] = addObstacle(obstaclex,obstacley,24, height, front);

                off += 100;
                break;
            case 3: //Three tall platforms at same height
                height = 80*direction;
                obstaclex = (random() * (c_horborder - -c_horborder) + -c_horborder) * 0.25;
                obstacley = position+off;

                obstacle[obstacle.length] = addObstacle(obstaclex-(c_horborder*0.4),obstacley,24, height, front)
                obstacle[obstacle.length] = addObstacle(obstaclex                 ,obstacley,24, height, front)
                obstacle[obstacle.length] = addObstacle(obstaclex+(c_horborder*0.4),obstacley,24, height, front)
                off += 10;
                break;
            case 4: //Three tall platforms at descending heights
                height = 40+(random()*100)*direction;
                obstaclex = (random() * (c_horborder - -c_horborder) + -c_horborder) * 0.25;
                obstacley = position+off;

                obstacle[obstacle.length] = addObstacle(obstaclex-(c_horborder*0.35),obstacley,16+(random()*32), height, front)
                obstacley += 50;
                obstacle[obstacle.length] = addObstacle(obstaclex                 ,obstacley,16+(random()*32), height, front)
                obstacley += 50;
                obstacle[obstacle.length] = addObstacle(obstaclex+(c_horborder*0.35),obstacley,16+(random()*32), height, front)

                off += 100;
                break;

            case 5: //Enclosed box
                height = 80+(random()*40)*direction; var width = height;
                obstaclex = (random() * (c_horborder - -c_horborder) + -c_horborder) * 0.25;
                obstacley = position+off;

                obstacle[obstacle.length] = addObstacle(obstaclex,obstacley,width, 16, front)
                obstacley += height/2;
                obstacle[obstacle.length] = addObstacle(obstaclex-(c_horborder*0.35),obstacley,16, height, front)
                obstacle[obstacle.length] = addObstacle(obstaclex+(c_horborder*0.35),obstacley,16, height, front)
                obstacley += height/2;
                obstacle[obstacle.length] = addObstacle(obstaclex,obstacley,width, 16, front)

                off += 100;
                break;
            default:
                height = 40+(random()*100)*direction;
                obstaclex = (random() * (c_horborder - -c_horborder) + -c_horborder) * 0.8;
                obstacley = position+off;

                obstacle[obstacle.length] = addObstacle(obstaclex,obstacley,16+(random()*32), height, front)
        }

        off += 20+height;
    }

    return(position+off)
}

function addObstacle(xx,yy,width,height,front) {
    var clr = c[3]; if (front == true) {clr = c[2]}
    var newobstacle = new Zdog.Box({
        addTo: illo,
        width: width,
        height: height,
        frontFace: false, backFace: false,
        depth: 16,
        stroke: 8,
        cornerRadius: 20,
        color: clr,
        visible: false, //This will be enabled and added to the step event if this is near the player.
        translate: {x: xx, y: yy, z: (front * 50) -25}
    });

    newobstacle.zspeed = 0;
    return(newobstacle);
}

function step(framestep) {

    var delta = 1;

    if (state == 1 && paused == false)
    {
        timeleft -= (1/60);
        if (timeleft <= 0)
        {
            gameOver();
        }
    }

    //Update interface
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;
    document.getElementById("fps-display").innerHTML = fps.toString() + " fps";

    i1.innerHTML = "Time: " +timeleft.toFixed(2).toString();
    if (timeleft < 10)
    {
        i1.style.color = "#F08080";
    } else {
        i1.style.color = "white";
    }
    i2.innerHTML = "+" +timejackpot.toString() + " sec";
    var ypercent = (player.translate.y - fliptop) / (flipbottom - fliptop) * 9.45; //9.45 instead of 10 so the number never gets rounded up to 10 in the interface
    if (flipped == -1) {ypercent = (9.45-ypercent)}
    ypercent = Math.max(0,ypercent); //To avoid interface displaying -0 in some cases
    i3.innerHTML = "Flips: " +score.toString() + "." + ypercent.toFixed(0).toString();

    if (paused && framestep == false) {return;}

    //Screen shake and camera movement
    if (shakeduration > 0)
    {
        illo.translate = {x: 0 + shakex, y: cameray + shakey}; 
        shakeduration -= 1;
    } else {
        illo.translate = {x: 0, y: cameray}; 
    }

    if (playermovex != 0)
    {
        playermovex += c_addverticalspeed*Math.sign(playermovex)
    }
    
    if ((playermovey <= -c_dropspeed && flipped == -1) || (playermovey >= c_dropspeed && flipped == 1) && state == 1)
    {
        playermovey += c_adddropspeed*Math.sign(playermovey)
    } else if ((flipped == 1 && playermovey < 1) || (flipped == -1 && playermovey > -1) && playermovex == 0) { //If falling against gravity direction
        playermovey += c_addjumpspeed*flipped
    }

    //Flipping camera after screen swap
    if (flipvisual != flipped)
    {
        if (flipped == -1)
        {
            illo.rotate.x += (TAU/64);
            flipvisual -= (1/16);
        }
        else //Negative
        {
            illo.rotate.x += (TAU/64);
            flipvisual += (1/16);
        }
    }

    //Flipping player after reaching bottom of level
    if ((flipped == 1 && player.translate.y > flipy) || (flipped == -1 && player.translate.y < flipy) )
    {
        player.translate.y = flipy;
        flipped = -flipped;
        playermovey = flipped;

        if (flipped == 1)
        {
            flipbottom += 200;
            flipy = flipbottom;
            //QQQ Generate new platforms in that area
        }
        else
        {
            fliptop -= 200;
            flipy = fliptop;
            //QQQ Generate new platforms in that area
        }
        flipline.translate.y = flipy;

        timeleft += timejackpot;
        i2.style.animation = ""; //Reset
        i2.style.animation = "jackpot-claim 1s ease-in-out";
        timejackpot = c_startjackpot;;
        score += 1;

        if (state == 1) //Otherwise we don't have audio permission yet
            {sound([0,,,,0.39,0.39,,0.13,,,,,,0.57,,0.44,,,1,,,,,0.15])}

        if (flipped == -1)
        {
            bgcolor = c[1];
            border.color = c[0];
            flipline.color = c[0];
        }
        else
        {
            bgcolor = c[0];
            border.color = c[1];
            flipline.color = c[1];
        }
    }

    visobstacle = []; var obstaclelen = obstacle.length;
    for (var i = 0; i != obstaclelen; i++)
    {
        //Optimization, don't render squares that are not in view
        if (obstacle[i].translate.y > player.translate.y - 500 && obstacle[i].translate.y < player.translate.y + 1000) //QQQ 500 and 1000 should change depending on flip direction
        {
            obstacle[i].visible = true;
            visobstacle[visobstacle.length] = obstacle[i];

            //Check if obstacle needs to be shifted to the back or frontside
            if (obstacle[i].zspeed != 0)
            {
                if (obstacle[i].translate.z >= 35) {
                    obstacle[i].translate.z = 25;
                    obstacle[i].zspeed = 0;
                } else if (obstacle[i].translate.z <= -35) {
                    obstacle[i].translate.z = -25;
                    obstacle[i].zspeed = 0;
                } else {
                    obstacle[i].translate.z += 5*Math.sign(obstacle[i].zspeed)
                }
            }
        }
        else
        {
            obstacle[i].visible = false
        }
    }
    
    for (var j = 0; j != 4; j += 1) //So we're doing most of the step loop four times for smoother movement! They did it in Super Mario 64, so we can do it here!
    {
        //Moving player
        player.translate.x += playermovex/4;
        if (player.translate.x > c_horborder) {player.translate.x = c_horborder; playermovex = 0; playermovey = 1*flipped}
        if (player.translate.x < -c_horborder) {player.translate.x = -c_horborder; playermovex = 0; playermovey = 1*flipped}
        player.translate.y += playermovey/4;
        
        //Collisions
        if (state == 1) //Only in gameplay
        {
            for (var i = 0; i != visobstacle.length; i++)
            {
                xx = visobstacle[i].translate.x-(flipped*10); //The player is on a different layer compared to the blocks, so we offset the x to closely match the perspective the player is seeing.
                yy = visobstacle[i].translate.y;
                zz = visobstacle[i].translate.z;
                w = visobstacle[i].width; aw = visobstacle[i].width+25; //w is collision width, aw is activation width, where the player is not effected but the block is marked as collided.
                h = visobstacle[i].height-10;

                if ( ((flipped == 1 && zz == 25) || (flipped == -1 && zz == -25)) && player.translate.x > xx - aw && player.translate.x < xx + aw && player.translate.y > yy - h && player.translate.y < yy + h)
                {
                    console.log("Collision detected with "+i.toString());
                    var collided = false;

                    if (playermovex == 0) //Player fell on top of this block
                    {
                        if (player.translate.x > xx - w && player.translate.x < xx + w)
                        {
                            playermovey = c_fallspeed*flipped; shakey = 2; shakeduration = 2;
                            console.log("Fell on top of block")
                            shakex = 0; shakey = 10; shakeduration = 3;
                            collided = true;
                        }
                        else
                        {
                            console.log("Fell directly past block")
                            collided = true;
                        }
                    } else if (player.translate.x > xx - w && player.translate.x < xx + w) { //Player kicked side of this block
                        playermovex = 0; playermovey = c_fallspeed*flipped;
                        if (playermovex > 0) {shakex = 5;} else if (playermovex < 0) {shakex = -5} else {shakex = 0}
                        shakey = 0; shakeduration = 2;
                        console.log("Kicked against block")
                        collided = true;
                    }

                    if (collided)
                    {
                        pushObstacleToFlipside(visobstacle[i])
                        sound([0,,0.035,,0.15+(random()*0.5),0.49,,-0.53,,,,,,0.03,,,,,1,,,,,0.15])
                    }
                }
            }
        }
    }

    draw();
}

function pushObstacleToFlipside(obstacle){

    if (obstacle.translate.z == 25) //In foreground
    {
        obstacle.zspeed = -10; obstacle.translate.z += obstacle.zspeed; obstacle.color = c[3];
    } else { //In background
        obstacle.zspeed = 10; obstacle.translate.z += obstacle.zspeed; obstacle.color = c[2];
    }

    if (timejackpot < 99)
    {
        timejackpot += c_timegainperblock;
    }
    i2.style.animation = ""; //Reset

    if (isOdd(timejackpot/c_timegainperblock)) //Swap between identical animations so the animation restarts properly. See https://css-tricks.com/restart-css-animation/
    {
        i2.style.animation = "jackpot-gain 0.5s ease-out";
        console.log("Animation 1");
    }
    else
    {
        i2.style.animation = "jackpot-gain-2 0.5s ease-out";
        console.log("Animation 2");
    }
}

function handleGesture(e) { //Taken from https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d#gistcomment-2577818
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if (yx <= limit) {
            if (x < 0) {
                input("ArrowLeft");
            } else {
                input("ArrowRight");
            }
        }
        if (xy <= limit) {
            if (y < 0) {
                input("ArrowUp");
            } else {
                input("ArrowDown");
            }
        }
    } else {
        input(" ");
    }
}

function input(key) {
    console.log(key)

    if (state == 0) //Main menu
    {
        if (key == " " && canstartgame) {
            l1.style.animation = "gamestart-top 1s ease-in";
            l2.style.animation = "gamestart-bottom 1s ease-in";
            l3.style.visibility = "hidden"; 
            i1.style.visibility = "visible"; 
            i2.style.visibility = "visible"; 
            i3.style.visibility = "visible"; 
            not.style.visibility = "hidden";
            state = 1;
            sound([1,,0.08,,0.50,0.26,,0.43,,,,,,,,0.68,,,1,,,,,0.15]);
            loadLevel(5)
            setTimeout(function(){
                l1.style.visibility = "hidden";
                l2.style.visibility = "hidden";
            }, 975);
        }
    }
    else if (state == 1) //Gameplay
    {
        if (key == "Escape")
        {
            pause(-1)
        }
        
        if (paused) 
        {
            if (key == "f") //Frame skip QQQ
                {step(true);}
            if (key == " ")
            {
                draw() //Allow rotation QQQ
            }
            else
                {return;}
        }

        var delta = 0; 
        if (key == "ArrowLeft" || key == "a" || key == "q") {delta = -1}
        if (key == "ArrowRight" || key == "d") {delta = 1}
        
        if (Math.sign(playermovey) == flipped || Math.sign(playermovey) == 0) //Not moving against the fall direction
        {
            if (delta != 0 && playermovex == 0)
            {
                playermovex = c_startverticalspeed*delta;
                playermovey = 0;
                sound([1,,0.22,0.26,0.11,0.41+(random()*0.3),0.21,-0.30,,0.06,0.02,,,0.43,0.19,,,,1,-0.04,,0.18,0.01,0.15])
            } else if ((key == "ArrowUp" || key == "w" || key == "z"))
            {
                playermovex = 0;
                playermovey = -c_jumpspeed*flipped;
                sound([0,,0.05,,0.18,0.38+(random()*0.3),0.02,0.24,0.04,,0.05,,,0.31,0.07,0.06,,0.08,0.9,-0.03,0.02,0.15,0.03,0.15])
            } else if ((key == "ArrowDown" || key == "s") && playermovex == 0 && ((playermovey < c_dropspeed && flipped == 1) || (playermovey > -c_dropspeed && flipped == -1)) )
            {
                playermovex = 0;
                playermovey = c_dropspeed*flipped;
                sound([1,,0.25,0.01,,0.43+(random()*0.2),0.27,-0.25,,,,,,0.79,-0.66,,0.20,-0.18,1,,,,,0.15])
            }
        } //else the player is moving against fall direction.

        if (key == " ")
        {
            pause(false)
        }
    }
}

function draw() {
    var yoff = (TAU/4)*(1-flipvisual); if (flipped == -1) {yoff = ((TAU/4)*flipvisual)+(TAU/4)*3} //Some fancy numbers to make the player rotate smoothly while flipping screen
    player.rotate = { y: -(playermovex)*0.08, x: -(playermovey*0.15*flipvisual)+yoff} //x and y swap here
    border.translate.y = player.translate.y

    cameray = (-flipvisual*player.translate.y*0.935)-100; // 15/16 

    illo.updateRenderGraph();
}

function gameOver() {
    state = 0;
    player.visible = false;
    playermovey = 0.5*flipped;
    canstartgame = false;
    l1.style.animation = ""; //Reset animations
    l2.style.animation = "";
    l1.style.visibility = "visible";
    l2.style.visibility = "visible";
    l1.innerHTML = "Time up";
    l2.innerHTML = "Game Over!";
    l3.innerHTML = "Space or Tap to try again";
    i1.style.visibility = "hidden"; i2.style.visibility = "hidden"; i3.style.visibility = "hidden";
    sound([0,,0.021,,0.28,0.38,,-0.40,,,,,,0.12,,,,,1,,,,,0.16])
    setTimeout(function(){
        canstartgame = true;
        l3.style.visibility = "visible"; 
    }, 1000);
    if (score > hiscore)
    {
        if (hiscore > 0)
        {
            not.style.visibility = "visible"; not.innerHTML = "Congrats!<br>You broke your old highscore of<br>"+hiscore.toString()+" with a new score of "+score.toString()+"!";
        }
        hiscore = score;
    }
}

//Utility functions and features
//Taken from https://stackoverflow.com/a/19303725
var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

window.addEventListener("resize", function() {
    resizeScreen();
});

function resizeScreen() {
    var canvas = document.getElementById('game');
    if (window.innerWidth > 850 && window.innerHeight > 600) {illo.zoom = 2}
    else if (window.innerWidth > 600 && window.innerHeight > 400) {illo.zoom = 1.5}
    else if (window.innerWidth > 400 && window.innerHeight > 300) {illo.zoom = 1}
    else {illo.zoom = 0.9}
    draw();
}

function sound(settings) {
    var soundURL = jsfxr(settings); 
    var player = new Audio();
    player.src = soundURL;
    player.play();
}

document.addEventListener("visibilitychange", function() {
    pause(true)
    });

function pause(toggle) {
    if (state == 0) {return;}
    if (toggle == -1) {paused = !paused;}
    else if (paused != toggle) {paused = toggle} else {return;}

    if (paused) {
        not.style.visibility = "visible"; n.innerHTML = "PAUSED, [Space] or [Tap] to resume";
        i1.style.visibility = "hidden"; i2.style.visibility = "hidden"; i3.style.visibility = "hidden";
    }
    else {
        not.style.visibility = "hidden";
        i1.style.visibility = "visible"; i2.style.visibility = "visible"; i3.style.visibility = "visible";
    }
}

function HtmlLoaded() {
    //Caching all references to HTML elements
    l1 = document.getElementById("l1");
    l2 = document.getElementById("l2");
    l3 = document.getElementById("l3");
    i1 = document.getElementById("i1");
    i2 = document.getElementById("i2");
    i3 = document.getElementById("i3");
    n = document.getElementById("not");
    canstartgame = true;
}

function isOdd(num) { return num % 2;}

function switchPalette(id) {
    switch(id) {
        case 0: c[0] = "#22393F" ; c[1] = "#00B8B5"; c[2] = "#50DADC" ; c[3] = "#0087BD"; c[4] = "#14A9FF";  palletename = "Default Colors";
        case 1: c[0] = "#223e32" ; c[1] = "#A7C06D"; c[2] = "#b3dd52"; c[3] = "#015d00"; c[4] = "#04bf00"; palletename = "Berry Juice (Hiscore 10)"; break;
        //case 2: c[0]= "#fff"; c[1] = "#fff"; c[2] = "#fff"; c[3] = "#fff"; c[4] = "#fff"; palletename = "Debug" break;
    }

    //QQQ Update color values on all existing objects (assuming no gameplay is happening)
}