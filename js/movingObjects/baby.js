
// newbaby(): to be called during level setup
function newBaby(x,y){

  babies.push( new movingObject(x,y, 20,20,displayBaby,updateBaby,babies.length) );
  babies[babies.length-1].isExploring = false;
  babies[babies.length-1].isCarried = false;
  babies[babies.length-1].grabbable = true;

}


function updateBaby(){

  // if baby is carried then stick to player position
  if(this.isCarried){

    this.x = player.x +20+player.dir*this.index*10;
    this.y = player.y - 55+this.index*5;

    // if baby is carried and start position (home) is reached,
    // drop off baby and increment babies returned.
    if(
      collideRectRect(
        canvasW/2 - (player.x-startPos.x),
        startPos.y-yShift,
        startPos.w,
        startPos.h,
        canvasW/2,
        player.y-yShift,
        player.w,player.h
      )
      &&player.babiesCarried>0
    ){ // if nest reached
      player.babiesCarried --;
      this.isCarried = false;
      this.grabbable = false;
      this.returned = true;
      // stop moving
      this.isExploring = false;
      this.x = startPos.x+startPos.w/2 - this.index*15;
      this.y = startPos.y-20;
      babiesReturned ++;
    }
  }

  //  if baby is not being carried
  else {

    // if "exploring", move around randomly
    if(this.isExploring) this.speedX = constrain(
      this.speedX+-1+Math.random()*2, -2,2
    );
    // if not exploring don't move
    else this.speedX =0;

    // if overlapping with player, mark as carried.
    if(collideRectRect(
      canvasW/2 - (player.x-this.x),
      this.y-yShift-this.h,
      this.w,
      this.h,
      canvasW/2,player.y-yShift-player.h,player.w,player.h)
      && !player.knockedBack
      && this.grabbable
    //  && player.babiesCarried<2
    ){
      if(!this.isCarried) monkeyCrySFX();
      this.isCarried = true;
      player.babiesCarried++;
    }
  }
}


function displayBaby(){

  let tDist = -10;
  ctx = canvas.context;
  ctx.translate(0,tDist)
  // get position relative to player
  let pos = posOnScreen(this);

  // pick the right animation
  let loop = babyWalkLoop;
  if(this.isCarried) loop=babyCarriedLoop;

  // display baby
  displayStringLoop(loop,pos.x,pos.y-this.h,15,2,this.dir);
  ctx.translate(0,-tDist)
}
