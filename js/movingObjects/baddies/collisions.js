
// check collision between a baddie and player.

function checkPlayerCollision(index){

  let b = baddies[index];
  let p = player;

  // if baddie and player overlap and player isn't already knocked back
  if(
    collideRectRect(
    canvasW/2 - (p.x-b.x),
    b.y-yShift-b.h,
    b.w,
    b.h,
    canvasW/2,p.y-yShift-p.h,p.w,p.h
  )
    && !p.knockedBack
  ){

    let knock = false;
    let whichBaby = 0;
    let pOnTop = false;
    let pOnBot = false;
    let force = 0.8;

    // check if player is jumping below or above baddie
    if(distToGround(p.x+p.w/2,p.y,p.w)>5){
      if(b.y-20>p.y) pOnTop = true;
      else if (b.y-b.h<p.y) pOnBot = true;
      else return;
      // if so, then baddie is stunned
      force = 1.5;
      b.stunned = true;
      let i = index;
      clearTimeout(b.stunTimer);
      b.stunTimer = setTimeout(function(){baddies[i].stunned = false;},1000)
    }

    // check if any babies are carried. knock off one baby
    for(let i=0; i<babies.length; i++){
      if(babies[i].isCarried&&!knock&&!pOnTop) {
        babies[i].isCarried = false;
        babies[i].isExploring = true;
        knock = true;
        whichBaby = i;
        p.babiesCarried --;
        babies[whichBaby].grabbable = false;
      }
    }

    // mark baby as grabbable in half a sec
    if(knock) setTimeout( function(){
      babies[whichBaby].grabbable = true;
    },500);

    if(b.x<p.x)sendEmFlying(index,force,15,pOnTop,pOnBot,knock,whichBaby,-1)
    else sendEmFlying(index,force,15,pOnTop,pOnBot,knock,whichBaby,1)

  }
}

// sendemflying()
//
// send the right peeps in the right direction following a collision

function sendEmFlying(i,f,jf,pOT,pOB,k,wB,dir){
  let p = player;
  f = f+player.babiesCarried*0.2;
  if(pOT) {
    // if player was jumping overtop, baddie gets knocked back and player jumps again
    p.forceJump(jf);
    baddies[i].collided(dir*f);
  }
  else if(pOB) {
    // if player was jumping below, baddie jumps and player gets knocked back
    player.collided(-dir);
    baddies[i].forceJump(1.5*jf);
  }
  else  {
    // else both baddie and player are knocked back
    p.collided(dir);
    baddies[i].collided(-dir*f)
  }
  // knockback baby
  if(k)  babies[wB].collided(dir*3);

  // vfx, sfx
  triggerParticles(p.x+p.w/2,p.y+p.h/2,[{r:255,g:125,b:125}])
  collideSFX();
}
