import { getAngle } from './functions';
import w from './w'; 

export default class {
  constructor(opts = {}) {
    let t = this;
    t._parent      = opts.parent || 'game'; 
    t._type        = opts.type   || 'entity';

    t._speed       = opts.speed  || 1; 
    t._health      = opts.health || 1; 
    t._damage      = opts.damage || 1; 
    t._p           = opts.pos ? {...opts.pos} : {x: w._b.width / 2,  y: w._b.height / 2, angle: 0};
    t._v         = opts.vel ? {...opts.vel} : {x: 0,  y: 0};
    t._constAngle  = opts.constAngle;
    t._collides    = opts.collides || true; 
    
    t._buildIn     = opts.buildIn || false; 
    t._buildSpeed  = opts.buildSpeed || 1; 

    t._hitrad      = t._buildIn ? 1 : opts.hitrad || 5;
    t._maxrad      = opts.maxrad || t._hitrad;

    t.isDead       = false; 
  }

  takeDamage(d) {
    this._health -= d; 
    if(this._health <= 0) {this._die();}
  }
  
  moveTo(pos) {
    this._p.x = pos.x;
    this._p.y = pos.y;
  }

  _cCol() {
    let cols = w.entities.filter(e => w.sqDist(this._p, e._p) < w.sq(this._hitrad * 0.6) + w.sq(e._hitrad * 0.6) && e._collides)
    this._handleCollisions(cols);
  }

  _handleCollisions(cols) {
    
  }

  collides(p, prad) {
    return w.sqDist(this._p, p) < w.sq(this._hitrad * 0.6) + w.sq(prad * 0.6)
  }

  _checkBounds() {
    if(this._p.x - this._hitrad < 2)                {return 1}           
    if(this._p.x + this._hitrad > w._b.width)   {return 2} 
    if(this._p.y - this._hitrad < 2)                {return 3}             
    if(this._p.y + this._hitrad > w._b.height)  {return 4}
  }

  _die() {
    this.isDead = true; 
  }

  _build() {
    if(this._hitrad < this._maxrad) {
      this._hitrad += this._buildSpeed;
    }
  }

  _bounce() {
    switch(this._checkBounds()) {
      case 1: this._v.x = Math.abs(this._v.x); return true;
      case 2: this._v.x = -Math.abs(this._v.x); return true;
      case 3: this._v.y = -Math.abs(this._v.y); return true;
      case 4: this._v.y = Math.abs(this._v.y); return true;
    }
  }

  _updatePos() {
    this._p.x     += this._v.x * this._speed;
    this._p.y     -= this._v.y * this._speed;
    this._p.angle = this._constAngle || getAngle(this._p, this._target); 
  }

  _updateVel() {
    this._v.x *= this._v.x > 0.1 || this._v.x < 0.1 ? 0.95 : 0; 
    this._v.y *= this._v.y > 0.1 || this._v.y < 0.1 ? 0.95 : 0; 
  }
 
  update(ctx) {
    if(this._buildIn)     {this._build()}
    if(this.health <= 0)  {this._die()}
    if(this.collides)     {this._cCol()}; 

    this._updatePos();
    this._updateVel(); 
    this._checkBounds(); 
    this._render(ctx); 
  }

  _draw(ctx) {
    ctx.fillRect(this._p.x, this._p.y, 20 * this._hitrad / this._maxrad, 20 * this._hitrad / this._maxrad);
  }

  _render(ctx) {
    ctx.save();
    ctx.translate(this._p.x, this._p.y); 
    ctx.rotate(this._p.angle);
    
    this._draw(ctx); 

    ctx.restore(); 
  }
}
