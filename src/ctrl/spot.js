import * as u from '../util';

export default function spot(ctrl) {

  this.init = (d) => {
    this.data = { ...defaults(), ...d };

    this.data.radius = this.data.life * 2;
  };

  this.update = delta => {
    this.data.life -= delta * 0.01;

    this.data.radius = this.data.life * 2;

    if (this.data.life < 0) {
      ctrl.spots.release(this);
    }
  };
  
  const defaults = () => ({
    x: 0,
    y: 0,
    color: 12,
    life: 10
  });

}
