import * as u from '../util';

export default function makeBlock(ctrl) {

  this.init = (d) => {
    this.data = { ...defaults(), ...d };

    this.life = 10;
    this.baseX = this.data.x;
    this.baseY = this.data.y;
    
  };

  this.update = delta => {

    updateLife(delta);
    updatePos(delta);

  };

  const updatePos = delta => {

    const c = Math.cos(this.life) * 10,
          s = Math.sin(this.life) * 10;

    this.data.x = this.baseX + c;
    this.data.y = this.baseY + s;
    
  };

  const updateLife = delta => {
    this.life -= delta * 0.001;
    
    if (this.life < 0) {
      ctrl.blocks.release(this);
    }
  };
}

const spotColor = () => u.randItem([
  18,
  20,
  5
]);

const defaults = () => ({
  x: 0,
  y: 0,
  angle: u.THIRDTAU,
  length: 100,
  color: spotColor(),
});
