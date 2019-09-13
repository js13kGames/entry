import w from './w'; 
import { getAngle } from './functions';
import cursors from './cursors';
import types from './types'
import Explosion from './explosion';
import Projectile from './projectile';
import Entity from "./entity";

export default class extends Entity {
  constructor(opts) {
    super(opts); 
    let t = this;

    t.subTypes     = Object.keys(cursors); 
    t._type        = types['player'];
    t._subType     = t.subTypes[0];
    t._projType    = Projectile.getTypes()[0]; 

    t._health      = 3; 
    t._speed       = 0.5;
    t._shots       = 1;
    t._firerate    = 14; 
    t._imgLoaded   = false; 
    t._cursorImg   = new Image();
    t.isDisabled  = false; 
    
    t._cursorImg.onload = _ => {t._imgLoaded = true}
    t._initPlayerType(); 
  }

  _initPlayerType() {
    let t = this;
    t._cursorImg.src = cursors[t._subType];
    t._imgLoaded = false;

    switch(t._subType) {
      case 'cPointer':
        t._shots         = 1;
        t._firerate      = 14; 
        t._projType      = Projectile.getTypes()[0]; 
        break;
        
      case 'cRapid':
        t._shots         = 1;
        t._firerate      = 9; 
        break;

      case 'cDiagonal':
        t._shots         = 2;
        t._firerate      = 11; 
        break;

      case 'cCross':
        t._shots         = 4;
        t._firerate      = 11; 
        break;

      case 'cBomb':
        t._shots         = 1;
        t._firerate      = 30; 
        t._projType      = Projectile.getTypes()[2]; 
        break;

      // case 'cQuestion':
      //   this._projType      = _ => Projectile.getTypes()[w.ranInt(Projectile.getTypes().length)]; 
      //   break;

      // case 'cFinger':
      //   this._shots         = 1;
      //   this._firerate      = 50; 
      //   this._projType      = Projectile.getTypes()[1];
      //   break;

      default:
    }
  }

  reset() {
    let t = this;
    t._subType   = t.subTypes[0];
    t._cursorImg.src = cursors[t._subType];
    t._initPlayerType(); 
    t._health    = 3;
    t.isDisabled = false; 
    t.isDead     = false; 
    t._p.x     = w._b.getCenter().x;
    t._p.y     = w._b.getCenter().y;
    t._v.x     = 0;
    t._v.y     = 0;
  }

  nextType() {
    this._subType = w.next(this.subTypes, this._subType);
    this._initPlayerType();
  }

  setType(type) {
    this._subType = type;
    this._initPlayerType();
  }

  _handleCollisions(cols) {
    cols.map(c => {
      if(c._type === types['enemy']) {
        c.takeDamage(1); 
        this.takeDamage(1);
      }
    })
  }

  _die() {
    w.entities.push(new Explosion({pos: this._p}))
    this.isDead = true;
  }

  _shoot() {
    if(w.tick % this._firerate == 0) {
      for(let i=0; i<this._shots; i++) {
        let a = (this._p.angle + (w.ran() - 0.5) / 10) + (Math.PI * 2 / this._shots * i); 
        this._proj = new Projectile({
          parent: types['player'],
          subType: this._projType,
          pos: this._p, 
          vel: {x: Math.cos(a), y:  -Math.sin(a)}, 
          constAngle: a 
        })
        w.entities.push(this._proj);
      }
    }
  }

  update(ctx) {
    let t = this; 
    if(t.isDead)       {return;}
    if(t._health <= 0) {t._die(); return;}
    if(t._buildIn)     {t._build()}
    t._cCol();
    t._updatePos();

    if(!player.isDisabled) {
      if(w.keyMap&w.keys[87]) {t._v.y += t._speed} // W
      if(w.keyMap&w.keys[65]) {t._v.x -= t._speed} // A
      if(w.keyMap&w.keys[83]) {t._v.y -= t._speed} // S
      if(w.keyMap&w.keys[68]) {t._v.x += t._speed} // D
      if(w.keyMap&w.keys[32]) {t._shoot()} // Space
    }

    t._updateVel();
    t._bounce();
    t._render(ctx); 
  }

  _render(ctx) {
    ctx.save();
    ctx.translate(this._p.x, this._p.y); 
    ctx.rotate(this._p.angle + Math.PI / 2);
    let t = this;
    let r = this._hitrad;

    if(this._imgLoaded) {
      let w = t._cursorImg.width * 1.5 * r / t._maxrad;
      let h = t._cursorImg.height * 1.5 * r / t._maxrad;
      ctx.drawImage(t._cursorImg, -w / 2, -h / 2, w, h);
    } else {
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.moveTo(-r, 0);
      ctx.lineTo(0, -r);
      ctx.lineTo(r, 0);
      ctx.strokeRect(-r / 2, -r / 2, r, r);
      ctx.stroke(); 
    }
    ctx.restore(); 
  }
}
