import * as u from '../util';

export default function star(ctrl, g) {
  const { width, height } = ctrl.data.game;

  this.init = (d) => {
    this.falling = false;
    this.data = { ...defaults(width, height), ...d };
  };

  this.update = delta => {
    updateLife(delta);
    updatePos(delta);

    if (this.data.life <= 2 && !this.falling) {
      this.falling = true;
      this.data.vx = u.rand(-1, 1) * 2;
      this.data.vy = u.rand(-1, 1) * 2;
    }
  };

  const updatePos = delta => {
    this.data.vx += -ctrl.data.hero.ax * delta * 0.001;
    this.data.vy += -ctrl.data.hero.ay * delta * 0.001;

    this.data.x += this.data.vx;
    this.data.y += this.data.vy;
  };

  const updateLife = delta => {
    this.data.life -= delta * 0.001;

    if (this.data.life < 0) {
      ctrl.stars.release(this);
    }
  };
  
}

const defaults = (w, h) => ({
  x: u.rand(0, w),
  y: u.rand(0, h),
  vx: 0,
  vy: 0,
  life: 10
});
