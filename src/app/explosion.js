import w from './w'; 
import Entity from "./entity";

export default class extends Entity {
  constructor(opts) {
    super(opts); 
    let t = this;

    t._maxrad      = opts.maxrad || 30; 
    t._collides    = false; 
    t._type        = 'explosion';
    t._fill        = opts.fill;
  }

  update(ctx) {
    this._build();
    if(this._hitrad >= this._maxrad) {this._die(); return}
    this._render(ctx); 
  }

  _draw(ctx) {
    let r = this._hitrad;
    ctx.strokeStyle = `rgba(0, 100, 0, ${0.6 - r/ this._maxrad})`

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);    
    ctx.stroke(); 
    if(this._fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }
  }
}


