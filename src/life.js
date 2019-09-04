import * as u from './util';

export default function makeLife(onDie = () => {}, opts) {

  opts = { life: 3, ...opts };

  let life = opts.life;

  this.init = () => {
    life = opts.life;
  };

  this.alpha = () => life / opts.life;

  this.update = delta => {
    life -= delta * 0.001;

    if (life < 0) {
      onDie();
    }
  };
  
 
}
