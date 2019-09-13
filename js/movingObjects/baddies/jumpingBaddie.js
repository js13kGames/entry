// update() and display() functions for a jumping baddie

function displayJumpingBaddie(){

  let tDist = -this.h;
  ctx.translate(0,tDist)

  // get position and direction tiger is facing
  let pos = posOnScreen(this);
  this.getDir();

  // pick animation
  let loop= tigerWalkLoop;
  if( distToGround(this.x+this.w/2,this.y,this.w)>2 ) loop = tigerJumpLoop;
  // display tiger
  displayStringLoop(loop,pos.x,pos.y-1.5*27,27,3,this.dir);

  ctx.translate(0,-tDist)
  this.counter++;
}


// updatejumpingbaddie()
// tiger behavior

function updateJumpingBaddie(){

  checkPlayerCollision(this.index);

  // jump at some point
  if(this.counter%150===0) this.startJump(baddies[this.index]);
  // if not knocked back, move between boundaries
  this.moveInBounds(2);
}
