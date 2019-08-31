c = []; //0 is first bg color, 1 is second bg color, 2 is front block color, 3 is back block color, and 4 is hero color.
c[0] = "#223e32"; c[1] = "#A7C06D"; c[2] = "#b3dd52"; c[3] = "#015d00"; c[4] = "#04bf00"; 
//c[0] = "#22393F" ; c[1] = "#00B8B5"; c[2] = "#50DADC" ; c[3] = "#0087BD"; c[4] = "#14A9FF";
//c[0] = "#fff"; c[1] = "#fff"; c[2] = "#fff"; c[3] = "#fff"; c[4] = "#fff";

const TAU = Zdog.TAU;

x=game.getContext`2d`;
state = 0; //0 is title screen, 1 is gameplay
paused = false; //If the game is paused no step events will trigger.
level = 500; //How long the stage should be the player is playing in.
playermovex = 0; playermovey = 1; //Direction the player's going into.
horborder = 200;
flipvisual = 1; flipped = 1;
cameray = 0; //This controls where the camera is currently looking at.
obstacle = []; visobstacle = []; //Optimalization array that only holds the blocks that are currently visible.
shakex = 0; shakey = 0; shakeduration = 0; //Control screen shake.
bgcolor = c[0]; //Each time before the zdog illustration is updated, this color gets applied to the background.
const times = []; let fps; //Used to display FPS during debugging.
canstartgame = false; //Set to true when HTML is fully loaded, and to prevent player to start a new game instantly after getting a game over
timeleft = 30; timejackpot = 3; score = 0; hiscore = 0; //timeleft ticks down, but gets refilled with the jackpot upon flipping.
flipy = 9000; ytop = 0; ybottom = 0; //These tell the player

document.addEventListener("DOMContentLoaded", HtmlLoaded);

initGame();

setInterval(e=>{ step(false) },15);

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
            { x: -horborder-10, y: -500 },          // start at top left
            { x: -horborder-10, y: 500 },          // line to top right
            { move: { x: horborder+10, y: -500 } }, // move to bottom left
            { x: horborder+10, y: 500 },          // line to bottom right
        ],
    });

    flipline = new Zdog.Shape({
        addTo: illo,
        stroke: 8,
        color: c[1],
        translate: {z: 25},
        path: [
            { x: -horborder*1 },
            { x: -horborder*0.9 },//dotted line
            { move: { x: -horborder*0.8 } },
            { x: -horborder*0.7 },
            { move: { x: -horborder*0.6 } },
            { x: -horborder*0.5 },
            { move: { x: -horborder*0.4 } },
            { x: -horborder*0.3 },
            { move: { x: -horborder*0.2 } },
            { x: -horborder*0.1},
            { move: { x: 0 } },
            { x: horborder*0.1 },
            { move: { x: horborder*0.2 } },
            { x: horborder*0.3 },
            { move: { x: horborder*0.4 } },
            { x: horborder*0.5 },
            { move: { x: horborder*0.6 } },
            { x: horborder*0.7 },
            { move: { x: horborder*0.8 } },
            { x: horborder*0.9 },
            { move: { x: horborder } },
            { x: horborder*1.1 },
        ],
    });

    resizeScreen();

    loadLevel(level);

    draw();
}

function loadLevel(lvlnumber) {
    //Clean up
    level = lvlnumber;

    if (state == 0) {player.visible = false;} //Demo mode for title screen
    else {player.visible = true;}

    seed = 1000*lvlnumber
    if (obstacle.length > 1)
    {
        for (var i = 0; i != obstacle.length; i++)
        {
            obstacle[i].remove();
            console.log("Obstacle removed");
        }
    }
    obstacle = []
    flipped = 1; flipvisual = 1; bgcolor = c[0]; 
    player.translate.x = 0; player.translate.y = 0; playermovex = 0; playermovey = 1;
    illo.rotate = {x: -(TAU/16), y: TAU/16};

    //Build new
    var amount = (lvlnumber*2) + 1

    for (var i = 0; i != amount; i++)
    {
        var obstaclex = random() * (horborder - -horborder) + -horborder;
        var obstacley = i*50;
        var front = (random() >= 0.2);
        var clr = c[4]; if (front == true) {clr = c[2]}

        obstacle[i] = new Zdog.Box({
            addTo: illo,
            width: 32,
            height: 32*3,
            frontFace: false, backFace: false,
            depth: 8,
            stroke: 8,
            cornerRadius: 20,
            color: clr,
            visible: false, //This will be enabled and added to the step event if this is near the player.
            translate: {x: obstaclex, y: obstacley, z: (front * 50) -25}
        });
        obstacle[i].colliding = false;
        obstacle[i].zspeed = 0;
        console.log[i];
    }

    flipy = i*50
    flipline.translate.y = flipy;

    console.log("Loaded level "+lvlnumber.toString())
}

function step(framestep) {

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
    document.getElementById("seed-display").innerHTML = seed.toString() + " seed";
    document.getElementById("level-display").innerHTML = level.toString() + " level";
    document.getElementById("cam-display").innerHTML = illo.rotate.x.toString() + "x  " + illo.rotate.y.toString() + "y  " + illo.rotate.x.toString() + "z  " + TAU.toString() + "tau";

    i1.innerHTML = "Time: " +timeleft.toFixed(2).toString();
    i2.innerHTML = "+" +timejackpot.toString() + " sec";
    i3.innerHTML = "Flips: " +score.toString();

    if (paused && framestep == false) {return;}

    //Screen shake and camera movement
    if (shakeduration > 0)
    {
        illo.translate = {x: 0 + shakex, y: cameray + shakey}; 
        shakeduration -= 1;
    } else {
        illo.translate = {x: 0, y: cameray}; 
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
        flipy = -flipy; //QQQ Push further back each round
        flipline.translate.y = flipy;
        flipped = -flipped;
        playermovey = flipped;

        timeleft += timejackpot; //QQQ Activate animation?
        i2.style.animation = ""; //Reset
        i2.style.animation = "jackpot-claim 1s ease-in-out";
        timejackpot = 3;
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
        }
        else
        {
            obstacle[i].visible = false
        }

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
    
    for (var j = 0; j != 4; j += 1) //So we're doing most of the step loop four times for smoother movement! They did it in Super Mario 64, so we can do it here!
    {
        //Moving player
        player.translate.x += playermovex/4;
        if (player.translate.x > horborder) {player.translate.x = horborder; playermovex = 0; playermovey = 1*flipped}
        if (player.translate.x < -horborder) {player.translate.x = -horborder; playermovex = 0; playermovey = 1*flipped}
        player.translate.y += playermovey/4;
        
        //Collisions
        if (state == 1) //Only in gameplay
        {
            for (var i = 0; i != visobstacle.length; i++)
            {
                xx = visobstacle[i].translate.x; 
                yy = visobstacle[i].translate.y;
                zz = visobstacle[i].translate.z;
                w = visobstacle[i].width-5; h = visobstacle[i].height-20;

                if ( ((flipped == 1 && zz == 25) || (flipped == -1 && zz == -25)) && player.translate.x > xx - w && player.translate.x < xx + w && player.translate.y > yy - h && player.translate.y < yy + h)
                {
                    if (visobstacle[i].colliding == false)
                    { //Collision enter
                        console.log("Collision detected with "+i.toString());
                        visobstacle[i].colliding = true;
                        
                        if (playermovex == 0) //Player fell on top of this block
                        {
                            playermovey = 0; shakey = 2; shakeduration = 2;
                        } else { //Player kicked side of this block
                            if (playermovex > 0) {shakex = 5;} else if (playermovex < 0) {shakex = -5} else {shakex = 0}
                            playermovex = 0; playermovey = 1*flipped; shakeduration = 2;
                        }

                        sound([0,,0.035,,0.1449+(random()*0.5),0.4918,,-0.5252,,,,,,0.034,,,,,1,,,,,0.15])
                    }
                }
                else if (visobstacle[i].colliding == true)
                { //Collision leave
                    collisionEnd(visobstacle[i])
                    console.log("Collision ended with "+i.toString());
                }
            }
        }
    }

    draw();
}

function collisionEnd(obstacle){
    obstacle.colliding = false;

    if (obstacle.translate.z == 25) //In foreground
    {
        obstacle.zspeed = -10; obstacle.color = c[4];
    } else { //In background
        obstacle.zspeed = 10; obstacle.color = c[2];
    }

    timejackpot += 1;
    i2.style.animation = ""; //Reset
    i2.style.animation = "jackpot-gain 0.5s ease-out";
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
            sound([1,,0.0806,,0.4981,0.2637,,0.4277,,,,,,,,0.6758,,,1,,,,,0.15]);
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
        
        if (delta != 0 && playermovex == 0) //Left or A or Q
        {
            playermovex = 8*delta;
            playermovey = 0;
            sound([1,,0.22,0.26,0.11,0.41+(random()*0.3),0.21,-0.30,,0.06,0.02,,,0.43,0.19,,,,1,-0.04,,0.18,0.01,0.15])
            for (var i = 0; i != obstacle.length; i++)
            {
                if (obstacle[i].colliding == true)
                {
                    collisionEnd(obstacle[i])
                }
            }
        }
        if ((key == "ArrowUp" || key == "w" || key == "z") && playermovey != 3*flipped)
        {
            playermovex = 0;
            playermovey = 0.5*flipped;
            sound([0,,0.05,,0.18,0.38+(random()*0.3),0.02,0.24,0.04,,0.05,,,0.31,0.07,0.06,,0.08,0.9,-0.03,0.02,0.15,0.03,0.15])
        }
        if ((key == "ArrowDown" || key == "s") && playermovey != 3*flipped )
        {
            playermovex = 0;
            playermovey = 3*flipped;
            sound([1,,0.25,0.01,,0.43+(random()*0.2),0.27,-0.25,,,,,,0.79,-0.66,,0.20,-0.18,1,,,,,0.15])
            if (playermovex == 0)
            {
                for (var i = 0; i != obstacle.length; i++)
                {
                    if (obstacle[i].colliding == true)
                    {
                        collisionEnd(obstacle[i])
                    }
                }
            }
        }
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
    playermovey = 1;
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
        not.style.visibility = "visible"; not.innerHTML = "Congrats, you beat your old highscore of "+hiscore.toString+"with a new score of "+score.toString()+"!";
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