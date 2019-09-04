import * as co from '../colors';
import * as u from '../util';

import makeMesh from '../mesh';
import * as geo from '../geometry';
import makeLife from '../life';

export default function block(ctrl, play, id) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;

  const bWidth = 20;

  const colBlock = new co.shifter(co.Palette.SummerSky);

  this.init = d => {
    this.data = { ...d };

    let geometry = geo.triGeometry(bWidth);

    this.mesh = new makeMesh(camera, geometry, {
      width: bWidth,
      height: bWidth
    });

    this.life = new makeLife(() => {
      play.blocks.release(this);
    });
  };

  const updateModel = delta => {
    const { tick } = ctrl.data;

    let theta = (tick * 0.001 + id) % u.TAU;

    let scale = 1.0 + Math.sin(this.life.alpha()* u.TAU) * 0.2;

    this.mesh.paint('front', colBlock
                    .reset()
                    .lum(Math.sin(theta) * 0.3)
                    .css());

    this.mesh.updateModel({
      x: this.data.x + u.usin(Math.cos(theta)) * 4,
      y: this.data.y + Math.cos(u.usin(theta)) * 4,
      z: 0,
      scale,
      theta: [0, theta, 0]
    });
  };



  this.update = delta => {
    updateModel(delta);

    this.life.update(delta);
  };
 
}
