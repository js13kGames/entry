// update() and display() functions for a flying baddie

function displayFlyingBaddie(){

  let tDist = -this.h;
  ctx.translate(0,tDist)

  // get x,y pos and direction
  let pos = posOnScreen(this);
  this.getDir();

  // pick animation
  let loop = birdStillLoop;
  if(this.flying) {
    loop=birdFlapLoop;
    this.dir = -this.dir;
  }
  // display the bird
  displayStringLoop(loop,pos.x,pos.y,20,2,this.dir);

  ctx.translate(0,-tDist)
  this.counter++;

}

function updateFlyingBaddie(){

  checkPlayerCollision(this.index);

  // while flying
  if(this.flying) {

    // fly up until a certain height is reached
    if(this.y>this.init.y-50) this.y --;
    // once over that height fly up and down at random
    else {
      this.y = constrain( this.y + -1+Math.random()*2, this.init.y-100,canvasH);

      // stop flying at some point (baddies falls back to the ground)
      if(this.counter%450===0) {
      this.flying = false;
      birdChirpSFX(this);
      }
    }
  }
  else if(this.counter%150===0) {
      this.flying = true;
      birdChirpSFX(this);
    }

  // if not knocked back, update speedX so as to move between boundaries
  this.moveInBounds(2);
}
