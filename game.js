c = []; //0 is first bg color, 1 is second bg color, 2 is front block color, 3 is back block color, and 4 is hero color.
//c[0] = "#223e32"; c[1] = "#A7C06D"; c[2] = "#b3dd52"; c[3] = "#015d00"; c[4] = "#04bf00"; 
c[0] = "#22393F" ; c[1] = "#00B8B5"; c[2] = "#50DADC" ; c[3] = "#0087BD"; c[4] = "#14A9FF";
//c[0] = "#fff"; c[1] = "#fff"; c[2] = "#fff"; c[3] = "#fff"; c[4] = "#fff";

x=game.getContext`2d`;
state = 0; //0 is title screen, 1 is gameplay
level = 5; //0 and lower are states, everything higher are game levels
playerx = 0; playery = 0;
playermovex = 0; playermovey = 1;
horborder = 200; flipy = 9000; flipvisual = 1; flipped = 1;
paused = false;
direction = 1; cameray = 0;
const TAU = Zdog.TAU
obstacle = [];
shakex = 0; shakey = 0; shakeduration = 0;
bgcolor = c[0];
const times = []; let fps;
interval = 0;
canstartgame = true;

create();
setInterval(e=>{ step(false) },15);
onkeydown=e=>{ input(e.key); }
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
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

//Taken from https://stackoverflow.com/a/19303725
var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function create() {

    // create illo
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
            { x: -horborder-10, y: -5000 },          // start at top left
            { x: -horborder-10, y: 5000 },          // line to top right
            { move: { x: horborder+10, y: -5000 } }, // move to bottom left
            { x: horborder+10, y: 5000 },          // line to bottom right
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

    resizescreen();

    loadlevel(level);

    draw();
}

function loadlevel(lvlnumber) {
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
    playerx = 0; playery = 0; playermovex = 0; playermovey = 1;
    illo.rotate = {x: -(TAU/16), y: TAU/16};

    //Build new
    direction = 1;
    var amount = (lvlnumber*2) + 1

    for (var i = 0; i != amount; i++)
    {
        var obstaclex = random() * (horborder - -horborder) + -horborder;
        var obstacley = i*50-direction;
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
            translate: {x: obstaclex, y: obstacley, z: (front * 50) -25}
        });
        obstacle[i].colliding = false;
        obstacle[i].zspeed = 0;
        console.log[i];
    }

    flipy = i*50-direction;
    flipline.translate.y = flipy;

    console.log("Loaded level "+lvlnumber.toString())
}

function step(framestep) {

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

    if (paused && framestep == false) {return;}
    cameray -= direction;

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
    if ((flipped == 1 && playery > flipy) || (flipped == -1 && playery < flipy) )
    {
        playery = flipy;
        flipy = -flipy; //QQQ Push further back each round
        flipline.translate.y = flipy;
        flipped = -flipped;
        if (state == 1) //Otherwise we don't have audio permission yet
        {sound([0,,0.0371,,0.3841,0.3887,,0.1299,,,,,,0.566,,0.4401,,,1,,,,,0.31])}
        playermovey = flipped;
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

    for (var i = 0; i != obstacle.length; i++)
    {
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
        playerx += playermovex/4;
        if (playerx > horborder) {playerx = horborder; playermovex = 0; playermovey = 1*flipped}
        if (playerx < -horborder) {playerx = -horborder; playermovex = 0; playermovey = 1*flipped}
        playery += playermovey/4;
        
        //Collisions
        if (state == 1) //Only in gameplay
        {
            for (var i = 0; i != obstacle.length; i++)
            {
                xx = obstacle[i].translate.x; 
                yy = obstacle[i].translate.y;
                zz = obstacle[i].translate.z;
                w = obstacle[i].width-5; h = obstacle[i].height-20;

                if ( ((flipped == 1 && zz == 25) || (flipped == -1 && zz == -25)) && playerx > xx - w && playerx < xx + w && playery > yy - h && playery < yy + h)
                {
                    if (obstacle[i].colliding == false)
                    { //Collision enter
                        console.log("Collision detected with "+i.toString());
                        obstacle[i].colliding = true;
                        
                        if (playermovex == 0) //Player fell on top of this block
                        {
                            playermovey = 0; shakey = 2; shakeduration = 2;
                        } else { //Player kicked side of this block
                            if (playermovex > 0) {shakex = 5;} else if (playermovex < 0) {shakex = -5} else {shakex = 0}
                            playermovex = 0; playermovey = 1*flipped; shakeduration = 2;
                        }

                        sound([0,,0.035,,0.1449+(random()*0.5),0.4918,,-0.5252,,,,,,0.034,,,,,1,,,,,0.2+(random()*0.2)])
                    }
                }
                else if (obstacle[i].colliding == true)
                { //Collision leave
                    collisionend(i)
                }
            }
        }
    }

    draw();
}

function collisionend(i){
    console.log("Collision ended with "+i.toString());
    obstacle[i].colliding = false;

    if (obstacle[i].translate.z == 25) //In foreground
    {
        obstacle[i].zspeed = -10; obstacle[i].color = c[4];
    } else { //In background
        obstacle[i].zspeed = 10; obstacle[i].color = c[2];
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
            document.getElementById("l1").style.animation = "gamestart-top 1s ease-in";
            document.getElementById("l2").style.animation = "gamestart-bottom 1s ease-in";
            document.getElementById("l3").style.visibility = "hidden"; 
            document.getElementById("not").style.visibility = "hidden";
            state = 1;
            sound([1,,0.0806,,0.4981,0.2637,,0.4277,,,,,,,,0.6758,,,1,,,,,0.3]);
            loadlevel(5)
            setTimeout(function(){
                document.getElementById("l1").style.visibility = "hidden";
                document.getElementById("l2").style.visibility = "hidden";
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
            sound([1,,0.2159,0.2603,0.1064,0.4074+(random()*0.3),0.2062,-0.3031,-0.0065,0.0638,0.0206,-0.0114,,0.4332,0.1898,,-0.0074,-0.0091,1,-0.0456,,0.1791,0.0109,0.3])
            for (var i = 0; i != obstacle.length; i++)
            {
                if (obstacle[i].colliding == true)
                {
                    collisionend(i)
                }
            }
        }
        if ((key == "ArrowUp" || key == "w" || key == "z") && playermovey != 3*flipped)
        {
            playermovex = 0;
            playermovey = 0.5*flipped;
            sound([0,,0.0549,0.0019,0.1806,0.3751+(random()*0.3),0.0193,0.2378,0.0414,,0.0453,,,0.3062,0.0736,0.0563,0.014,0.0768,0.936,-0.0341,0.0175,0.1448,0.0321,0.3])
        }
        if ((key == "ArrowDown" || key == "s") && playermovey != 3*flipped )
        {
            playermovex = 0;
            playermovey = 3*flipped;
            sound([1,,0.2506,0.0144,0.0071,0.4263+(random()*0.2),0.2723,-0.252,,,,,,0.7952,-0.6573,,0.1965,-0.182,1,,,,,0.3])
            if (playermovex == 0)
            {
                for (var i = 0; i != obstacle.length; i++)
                {
                    if (obstacle[i].colliding == true)
                    {
                        collisionend(i)
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
    player.translate = {x: playerx, y: playery}
    var yoff = (TAU/4)*(1-flipvisual); if (flipped == -1) {yoff = ((TAU/4)*flipvisual)+(TAU/4)*3} //Some fancy numbers to make the player rotate smoothly while flipping screen
    player.rotate = { y: -(playermovex)*0.08, x: -(playermovey*0.15*flipvisual)+yoff} //x and y swap here
    border.y = playery

    cameray = (-flipvisual*player.translate.y*0.935)-100; // 15/16 

    illo.updateRenderGraph();
}

function gameover() {
    state = 0;
    player.visible = false;
    playermovey = 1;
    canstartgame = false;
    document.getElementById("l1").style.animation = ""; //Reset animations
    document.getElementById("l2").style.animation = "";
    document.getElementById("l1").style.visibility = "visible";
    document.getElementById("l2").style.visibility = "visible";
    document.getElementById("l1").innerHTML = "Time up";
    document.getElementById("l2").innerHTML = "Game Over!";
    document.getElementById("l3").innerHTML = "Space or Tap to try again";
    sound([0,,0.0214,,0.2823,0.3797,,-0.4003,,,,,,0.1188,,,,,1,,,,,0.36])
    setTimeout(function(){
        canstartgame = true;
        document.getElementById("l3").style.visibility = "visible"; 
    }, 1000);
}

//Utility functions
window.addEventListener("resize", function() {
    resizescreen();
});

function resizescreen() {
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

    var n = document.getElementById('not')
    if (paused) {
        n.style.visibility = "visible"; n.innerHTML = "PAUSED, [Space] or [Tap] to resume";
    }
    else {
        n.style.visibility = "hidden";
    }
}