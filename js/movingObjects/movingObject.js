/*
class movingObject
this is the class for the player, babies, jumping baddies and flying baddies.
listens for (and runs) falls, jumps and knockbacks.
updates X position using speedX value.

arguments:
- x,y: coordinates at start
- a display function
- a motion function (includes things like changes in speedX, jump trigger etc)
- index: position within parent array (for babies[] or baddies[])
*/

class movingObject{

  constructor(x, y ,w,h,display,motion,index){
    // position
    this.x = x;
    this.y = y;
    // velocity
    this.speedX = 0;
    // size
    this.w =w;
    this.h=h;
    // display and update
    this.display = display;
    this.updateMotion = motion;
    // position within parent array, or "player" if player
    this.index=index;
    // count frames to trigger jumping or flying
    this.counter =randI(100); // start at random value

    // direction image is facing
    this.dir = 1;
    // initial position
    this.init = {x:x,y:y};

    this.jumping = false;
    this.isCarried = false;
    this.fallSpeed=0;
    if(y===0) this.flying = true;
    else this.flying = false;
  }

  // update(): updates position of and displays this object
  update(){

    // check if on screen
    this.onScreen = false;
    let pos = posOnScreen(this);
    if(inBox(pos.x,pos.y,-40,0,canvasW+40,canvasH+40)) this.onScreen = true;

    // run motion function
    this.updateMotion();
    // update x,y
    this.newPos();

    // display only if on screen
    if(this.onScreen||this.index==="player") this.display();
  }

 getDir(){
    if(this.speedX!=0) this.dir = -this.speedX/Math.abs(this.speedX);
  }

  newPos(){

    // if knocked back, update this.speedX
    if(this.knockedBack) this.calculateKnockBack();

    // add speedX to x pos and constrain
    this.x = constrain(this.x+this.speedX,0,levelRange);
    // constrain y so as not to drop below ground zero
    this.y = constrain(this.y,-5000,canvasH);

    // if jumping, update y position
    if(this.jumping) this.calculateJump();
    // if not flying or carried, check if falling and update y position
    else if(!this.flying&&!this.isCarried) this.calculateFall();

    if(this.index==="player"){
      let limit = canvasH*0.5;
      if(this.y>limit)  yShift = 0;
      else yShift=this.y-limit;
    }
  }

  // startjump()
  // check if already jumping and loosely near the ground then trigger jump

  startJump(input){

    if(!this.jumping&&distToGround(this.x+this.w/2,this.y,this.w)<2){

      if(this.index==="player") jumpSFX(0.5,1,0.35);
      else if(this.onScreen) jumpSFX(0.8,1.2,0.1);
      this.jumping = true;
      this.jumpForce = 20;
      if(this.babiesCarried>=0) this.jumpForce = 20-this.babiesCarried;
    }
  }

  // forcejump()
  // jump regardless of the conditions

  forceJump(force){
    jumpSFX(0.8,1.2,0.1);
    this.jumping = true;
    this.jumpForce = force;
  }

  // calculateJump: update this.y during jump. also ends jump.
  calculateJump(){

    // during jump, decrease jump force and move up
    this.jumpForce -= 2;
    this.y -= this.jumpForce;

    // jump is over once force reaches 0
    if(this.jumpForce<=0) this.jumping = false;
  }

  // calculateFall(): check distance to ground, then fall.
  // there is no fall "end": movingObject will fall as long as there is
  // fall distance below.

  calculateFall(){

    // check distance to ground
    let dist = distToGround(this.x+this.w/2,this.y,this.w);

    // during fall:
    if( dist>this.fallSpeed ||(this.grabbable===false&&this.y<canvasH&&Math.random()>0.5)&&this.returned!=true ){
      this.y += this.fallSpeed;
      this.fallSpeed +=1;
      this.falling = true;
    }
    // fall end:
    else if(dist>0){
      if(
        this.falling===true
        &&this.fallSpeed>1
        &&this.onScreen
      ) thumpSFX();
     this.falling = false;

      this.fallSpeed = 0;
      this.y += dist-1;
    }
  }

  // calculateKnockBack: updates speedX during knockback. also ends knockback.
  calculateKnockBack(){
    let vel = Math.floor(this.speedX);
    if(vel>0) this.speedX--;
    else if(vel<0) this.speedX++;
    else  this.knockedBack = false;
  }

  // collided()
  // trigger and setup knockback motion
  // called in checkPlayerCollision() (in collisions.js)

  collided(input){

    this.knockedBack = true;
    this.speedX = 10*input;
    this.jumpForce =0;
    this.flying = false;
  }

  // moveInBounds()
  // when called, updates speedX so that this object moves
  // between boundaries or back towards them if off course

  moveInBounds(vel){

    if(!this.knockedBack&&this.stunned!=true){
      if(this.x<=this.leftBoundX) this.speedX = vel;
      else if(this.x>=this.rightBoundX)  this.speedX = -vel;
      else if(this.speedX ===0){
        if(Math.random()>0.5) this.speedX = 1;
        else this.speedX =-1;
      }
    }

  }
}
