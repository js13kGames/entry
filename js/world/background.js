// sky color values (red,green,blue, time (fraction of level length))
let skyShades = [
  {r:133,g:186,b:214,t:0},
  {r:17,g:128,b:214,t:0.6},
  {r:101,g:155,b:184,t:0.7},
  {r:236,g:236,b:29,t:0.8},
  {r:255,g:59,b:59,t:0.9},
  {r:51,g:70,b:95,t:0.96},
  {r:51,g:70,b:95,t:1}
];

// sun color values
let sunShades = [
  {r:255,g:235,b:215,t:0},
  {r:255,g:255,b:15,t:0.5},
  {r:255,g:255,b:15,t:0.7},
  {r:255,g:55,b:55,t:0.8},
  {r:255,g:35,b:185,t:1}
]

// fadelight()
// fade between values in a either sky or sun colors array

function fadeLight(s){
  let r,g,b;
  let sunState = frame/sunDownFrame;
  for(let i=0; i<s.length; i++){
    if(sunState<s[i].t){
      let fact = (frame-s[i-1].t*sunDownFrame)/((s[i].t-s[i-1].t)*sunDownFrame);
      r = s[i-1].r + fact*(s[i].r-s[i-1].r)
      g = s[i-1].g + fact*(s[i].g-s[i-1].g)
      b = s[i-1].b + fact*(s[i].b-s[i-1].b)
      return {r:r,g:g,b:b}
    }
  }
}

// displaybackground()
//
// update sky and sun color and display

function displayBackground(){

  // update sky color
  if(timedRun){
    let sky = fadeLight(skyShades);
    bgImage.c[0] = "rgb("+sky.r+","+sky.g+","+sky.b+")";
  }
  else bgImage.c[0] = "rgb(125,200,255)";


  drawBG();
  drawSun();
}

// drawsun()
//
// update sun color and position then display

function drawSun(){

  // update sun color
  let sun = fadeLight(sunShades);
  let index = imgIndex(3);
  if(timedRun){
    sunLoop[ index ].c[1] = "rgb("+sun.r+","+sun.g+","+sun.b+")";
    // update sun direction
    let sunDir = 1;
   if(frame/sunDownFrame<0.5) sunDir = -1;
  // update sun position
   sunPos.y += sunDir*((canvasH)/(sunDownFrame));
   sunPos.x += (canvasW/2)/(sunDownFrame);
  }
  else {
    sunLoop[ index ].c[1] = "rgb(255,255,200";
    sunPos = {x:canvasW/4,y:sunStart};
  }




// display sun
  displayStringLoop(
    sunLoop,
    sunPos.x-player.x/4,
    sunPos.y-yShift/2,
    8,
    8,
    1);
}

class cloud{
  constructor(index){
    console.log("cloud")
    this.x=player.x+flRand(-200,200);
    this.y=player.y+flRand(-100,100);
    this.col = [false,"rgb(255,255,255)"];
    this.timer=0;
  }
  update(){
    this.x--;
    this.y+= flRand(-4,4);
    this.timer++;
    let co = 255-this.timer;
    this.col[1] = "rgba("+co+","+co+",255,0.5)"
    let pos = posOnScreen(this);
    displayImage(cloudImg.a,this.col,pos.x,pos.y,5,10,1);
    if(this.timer>200) killCloud(this.index);
  }
}

function killCloud(index){
  clouds.splice(index,1);
}


// drawbg()
//
// draw background image (sky/horizon/clouds)

function drawBG(){

  displayImage(
    bgImage.a,bgImage.c,
    -player.x/4,
    -0.4*canvasH-yShift/2,
    bgImage.w,
    1.5*canvasW/bgImage.w,
    1
  );
}

// displayground()
//
// display the ground below all platforms ("ground zero")

function displayGround(){

  // draw ground from one end of canvas to another.
  for(let i=0; i<canvasW/20; i++){
    displayImage(
      groundImg.a, groundImg.c,
      i*20-player.x%20, // shift x-position to show player velocity
      canvasH-yShift-4,
      5,4,1
    )
  }
}
