import w from "./w";
import { getAngle } from './functions';
import types from './types';
import Explosion from "./explosion";
import Entity from "./entity";

export default class extends Entity {
  constructor(opts) {
    super(opts)
    let t = this;

    t._speed     = opts.speed || 4;
    t._hitrad    = 8;
    t._collides  = true;
    t._type      = types['projectile'];
    t._damage    = 1;
    t._initiator = opts.initiator;
    t._fillColor = opts.fillColor; 
    t._strokeColor;  

    t._subTypes = [
      'bullet',
      'ripple',
      'bomb',
      'seeker',
      'orbiter',
    ]
    t._subType = opts.subType || 'bullet';
    t._initProjectileType()
  }

  static getTypes() {
    return [
      'bullet',
      'ripple',
      'bomb',
      'seeker',
      'orbiter',
    ];
  }

  _initProjectileType() {
    switch(typeof(this._subType) === 'function' ? this._subType() : this._subType) {
      case 'bullet':
        this._draw = (ctx) => {
          let r = this._hitrad;
          ctx.fillStyle = 'rgba(2, 100, 2, 0.1)';
          ctx.fillRect(-r, -r/2, -r / 2, r / 2);
          ctx.fillStyle = 'rgba(2, 100, 2, 0.1)';
          ctx.fillRect(-r / 2, -r/2, -r / 2, r / 2);
          ctx.fillStyle = this._fillColor || 'rgba(0, 20, 100, 0.8)';
          ctx.fillRect(0, -r/2, -r / 2, r / 2);
        }
        break;

      // case 'ripple':
      //   this._v     = {x: 0, y: 0}
      //   this._hitrad  = 5; 
      //   this._maxrad  = 100;
      //   this._draw = (ctx) => {
      //     let r = this._hitrad;
      //     r < this._maxrad ? r += 2 : this._die();  
      //     ctx.beginPath();
      //     // ctx.strokeStyle = `rgba(0, 100, 0, ${0.6 - r/ this._maxrad})`
      //     ctx.arc(0, 0, r * 0.6, 0, 2 * Math.PI);
      //     ctx.stroke();
      //     ctx.closePath();
      //   }
      //   break;

      case 'bomb':
        this._v     = {x: 0, y: 0}
        let r = 20; 
        this._draw = (ctx) => {
          ctx.save();

          let f1,f2; 
          if(this._parent === types['enemy']) {
            f1 = '#d31d1d';
            f2 = '#870000';
          } else {
            f1 = '#4dc5f9';
            f2 = '#3582e4';
          }
          ctx.beginPath();
          ctx.fillStyle = f1;
          ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
          ctx.fill();

          let cQuart = (ctx, col) => {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.fillStyle = col;
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, r * 0.6, 0, Math.PI / 2);
            ctx.moveTo(0, 0);
            ctx.fill();
          }

          cQuart(ctx, f2);
          cQuart(ctx, f1);
          cQuart(ctx, f2);

          ctx.restore();
        }
        break; 

      case 'seeker':
        this._health  = 5;
        this._hitrad  = 30;
        this._draw = (ctx) => {
          let r = this._hitrad;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        break; 

      case 'orbiter':  
        this._hitrad  = 30;
        this._speed   = 0.6;
        this._p = {x: this._initiator._p.x + 100, y: this._initiator._p.y} 
        // this._v = {x: -10, y: 0} 
        this._draw = (ctx) => {
          w.circ(0, 0, this._hitrad * 0.6, ctx);
        }
        break;     
    }
  }

  _die() {
    let e = new Explosion({pos: this._p});
    w.entities.push(e);
    this.isDead = true;
  }

  _handleCollisions(cols) {
    cols.map(c => {
      switch(c._type) {
        case this._type:
          if(c._parent != this._parent) {
            c.takeDamage(this._damage); 
            this.takeDamage(1);
          }
          break; 
        case this._parent:
          break;
        
        default:
          c.takeDamage(this._damage); 
          this._die(); 
      }
    })
  }

  update(ctx) {
    this._cCol();
    
    switch(this._subType) {
      case 'seeker':
        if(w.oneIn(5)) {
          this._p.angle = getAngle(this._p, w.player._p);          
        }
        this._v.x += Math.cos(this._p.angle) / 10; 
        this._v.y += -Math.sin(this._p.angle) / 10;
        this._p.x += this._v.x * this._speed;
        this._p.y -= this._v.y * this._speed;
        this._updateVel();
        break; 
        
      case 'orbiter':    
        this._p.angle = getAngle(this._p, this._initiator._p);  
        this._v.x += Math.cos(this._p.angle) / 10; 
        this._v.y += -Math.sin(this._p.angle) / 10;
        this._p.x += this._v.x * this._speed;
        this._p.y -= this._v.y * this._speed;
        break;        
        
      default: 
        if(this._checkBounds()) {this._die()};
        this._p.x     += this._v.x * this._speed;
        this._p.y     -= this._v.y * this._speed;
        this._p.angle = this._constAngle;
        break;
    }

    
    ctx.fillStyle = 'white';
    this._render(ctx); 
  }

  
}