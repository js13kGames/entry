export default function spark(ctrl) {
  this.ctx = ctrl.ctx;

  this.init = d => {
    this.data = { ...defaults(), ...d };

    this.life = 1;
    this.alpha = 1;
    this.scale = 1;
    this.rotation = 0;

  };

  this.update = dt => {
    this.data.vel *= this.data.drag;
    this.data.x += Math.cos(this.data.angle) * this.data.vel;
    this.data.y += Math.sin(this.data.angle) * this.data.vel;

    this.life -= this.data.decay;
    this.alpha = this.life;
    this.scale = this.life;

    if (this.life <= 0) {
      ctrl.sparks.release(this);
    }
    
  };
}

function defaults() {
  return {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    angle: 0,
    vel: 1,
    drag: 0.95,
    decay: 0.02
  };
}
