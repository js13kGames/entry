// triggerparticles()
//
// trigger a few particles at a given point.
// provide an array of colors to pick at random.

function triggerParticles(x,y,co){

  // number of particles ( randI() = random integer up to a max value )
  let amount = 4+randI(5);

  // pick new particles with random colors
  for(let i=0; i<amount; i++){
    let col = randI(co.length);  // random color
    particles.push( new Particle(x,y,particles.length,co[col]) );
  }
}

// particle class {}
//
// is given a random direction and speed on start. fades away
// then gets sliced out of the particles array

class Particle{

  constructor(x,y,index,co){

    this.x=x-player.w/2;
    this.y=y-player.h/2;
    this.speed = flRand(2,4);
    this.dir = Math.random()*2*Math.PI;
    this.vel = {
      x: this.speed*Math.cos(this.dir),
      y: this.speed*Math.sin(this.dir)
    };
    this.alph = 0.8;
    this.r = co.r;
    this.g = co.g;
    this.b = co.b;

  }

  update(){

    // update position
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.alph -= this.speed/150; // alpha value.

    // draw particle
    ctx = canvas.context;
    ctx.beginPath();
    // set alpha and color
    ctx.globalAlpha = this.alph;
    ctx.fillStyle = "rgba("+this.r+","+this.g+","+this.b+")";
    // get position relative to player
    let pos = posOnScreen(this);
    // draw
    ctx.fillRect(pos.x,pos.y,8,8);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.closePath();

    // if faded away, kill particle
    if(this.alph<=0) killParticle(this.index);
  }
}

// killparticle()
//
// slice a particle out of the particles array

function killParticle(index){
  particles.splice(index,1);
}
