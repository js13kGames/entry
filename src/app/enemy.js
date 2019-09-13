import w from './w'; 
import types from './types'; 
import { getAngle } from './functions';
import Entity from "./entity";
import Projectile from './projectile';
import Explosion from "./explosion";

export default class extends Entity {
  constructor(opts = {}) {
    super(opts); 
    let t = this; 

    t._spawn       = opts.spawn; 
    t._subType     = opts.subType || 'floater';
    t._speed       = 0.5;
    t._type        = types['enemy'];
    t._projType    = Projectile.getTypes()[0]; 
    t._shots       = 1;
    t._firerate    = 14; 
    t._projColor   = '#d31d1d';
    t._starttick = 0;

    switch(t._subType) {
      case 'floater':
        t._speed  = 0.8;
        t._maxrad = 30;
        t._hitrad = 1;
        t._health = 1;
        t._damage = 1;
        break; 

      case 'sniper':
        t._health = 2;
        t._maxrad = 15;
        t._hitrad = 1;
        break;

      case 'seeker':
        t._speed  = 1.5;
        t._maxrad = 20;
        t._hitrad = 1;
        t._health = 1;
        t._firerate = 0;
        break; 

      case 'launcher':
        t._p.x      = w._b.spawnPoints[t._spawn].x;
        t._p.y      = w._b.spawnPoints[t._spawn].y;
        t._p.angle  = getAngle(t._p, w.player._p);
        t._speed    = 0.1;
        t._maxrad   = 120;
        t._hitrad   = 120;
        t._health   = 20;
        t._buildIn  = false;
        t._shots    = 2;
        t._firerate = 75; 
        t._projType = Projectile.getTypes()[3];
        t._projSpeed = 1.5;
        break; 

      case 'bomber':
        t._p.x      = w._b.spawnPoints[t._spawn].x;
        t._p.y      = w._b.spawnPoints[t._spawn].y;
        t._p.angle = getAngle(t._p, w.player._p);
        t._v      = {x: 0, y: 0}
        t._speed  = 0.2;
        t._maxrad = 100;
        t._hitrad = 80;
        t._health = 20;
        t._shots    = 1;
        t._firerate = 150; 
        t._projType = Projectile.getTypes()[2];
        break; 

      case 'boss':
        t._p.x      = w._b.spawnPoints[t._spawn].x;
        t._p.y      = w._b.spawnPoints[t._spawn].y;
        t._p.angle = getAngle(t._p, w.player._p);
        t._v    = {x: 0, y: 0}
        t._speed  = 0.1;
        t._maxrad = 100;
        t._hitrad = 80;
        t._health = 25;
        t._starttick = 399;
        break; 
    }
  }

  _die() {
    w.entities.push(new Explosion({pos: this._p}))
    this.isDead = true;
  }
    
  _shoot() {
    if(this._starttick % this._firerate == 0 && this._starttick > 100) {
      for(let i=0; i<this._shots; i++) {
        let a = (this._p.angle + (w.ran() - 0.5) / 10) + (Math.PI * 2 / this._shots * i); 
        this._proj = new Projectile({
          parent: types['enemy'],
          initiator: this, 
          subType: this._projType,
          pos: this._p, 
          vel: {x: Math.cos(a), y:  -Math.sin(a)}, 
          speed: this._projSpeed, 
          constAngle: a,
          fillColor: this._projColor,
        })
        w.entities.push(this._proj);
      }
    }
  }

  _changeTarget() {
    this._p.angle = getAngle(this._p, w.player._p);
  }

  update(ctx) {
    if(this.isDead)         {return}
    if(this._buildIn)       {this._build()}
    if(this._health === 0)  {this._die()}

    this._cCol();

    let vNorm = t => {
      t._v.x += Math.cos(t._p.angle) / 10; 
      t._v.y += -Math.sin(t._p.angle) / 10;
      t._p.x += t._v.x * t._speed;
      t._p.y -= t._v.y * t._speed;
    }

    switch(this._subType) {
      case 'floater':
        if(w.oneIn(100)) {
          this._p.angle = getAngle(this._p, w._b.ranPos()) + w.ranRad();          
        }
        vNorm(this); 
        if(this._bounce()) {
          this._p.angle = getAngle(this._p, w._b.ranPos());
        }           
        break;

      case 'sniper':
        this._v.x = 0;
        this._v.y = 0;
        if(w.oneIn(5)) {
          this._p.angle = getAngle(this._p, w.player._p);          
        }
        this._shoot();
        break; 

      case 'seeker':
        if(this._starttick > 100) {
          if(w.oneIn(5)) {
            this._p.angle = getAngle(this._p, w.player._p);          
          }
          vNorm(this); 
        }
        break;

      case 'launcher':
        this._p.angle = getAngle(this._p, w.player._p);          
        vNorm(this); 
        this._shoot();
        break; 

      case 'bomber':
        if(w.oneIn(80)) {
          this._p.angle = getAngle(this._p, w._b.ranPos()) + w.ranRad();          
        }
        vNorm(this); 
        if(this._bounce()) {
          this._p.angle = getAngle(this._p, w._b.ranPos());
        } 
        this._shoot();
        break; 

      case 'boss':
        if(w.oneIn(1)) {
          this._p.angle = getAngle(this._p, w.player._p);          
        }
        vNorm(this); 

        this._shots    = 4;
        this._firerate = 10; 
        this._projType = Projectile.getTypes()[0];
        this._shoot();

        this._shots    = 6;
        this._firerate = 400; 
        this._projType = Projectile.getTypes()[4];
        this._shoot();
        break; 
    }
    this._starttick++;
    this._updateVel();
    this._render(ctx); 
  }

  _draw(ctx) {
    ctx.strokeWidth = 10; 
    let r = this._hitrad;
    ctx.beginPath();          
    ctx.fillStyle = 'white';
    
    switch(this._subType) {
      case 'floater':
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-r/ 2, -r/ 2, r, r);
        ctx.strokeRect(-r/ 2, -r/ 2, r, r);
        break;

      case 'sniper':
        ctx.fillRect(-r/2, -r/2, r, r);
        ctx.strokeRect(-r/ 2, -r/ 2, r, r);
        break; 

      case 'seeker':
        w.circ(-r * 0.3,        0, r * 0.4, ctx);
        w.circ(r * 1 - r * 0.6, 0, r * 0.4, ctx);
        break; 

      case 'launcher':
        w.circ(0, 0,    r * 0.6, ctx);
        w.circ(0, r/2,  r * 0.2, ctx);
        w.circ(0, -r/2, r * 0.2, ctx);
        break; 

      case 'boss':
        w.circ(0, 0,    r * 0.6, ctx);
        w.circ(0, r/2,  r * 0.2, ctx);
        w.circ(0, -r/2, r * 0.2, ctx);
        w.circ(r/2, 0,  r * 0.2, ctx);
        w.circ(-r/2, 0,  r * 0.2, ctx);
        ctx.beginPath();
        break; 

      default: 
        w.circ(0, 0,    r * 0.6, ctx);
        break;
      
    }
  }
}


/*
*
* Cursors from https://tobiasahlin.com/blog/common-mac-os-x-lion-cursors/
*
*/
