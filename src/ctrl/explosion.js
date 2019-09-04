import makeMesh from '../mesh';
import * as geo from '../geometry';
import makeEntity from '../entity';
import makeLife from '../life';

import * as co from '../colors';
import * as u from '../util';

import Pool from '../pool';

export default function makeExplosion(ctrl, play) {

  this.particles = new Pool(id => new makeParticle(ctrl, this));

  let life = new makeLife(() => {
    this.particles.releaseAll();
    play.explosions.release(this);
  }, {
    life: 1
  });

  this.init = d => {
    this.data = { ...d };

    life.init();

    let { x, y, z } = this.data;

    for (let i = 0 ; i< 10; i++) {
      this.particles.acquire(_ => _.init({
        x, y, z
      }));
    }
  };

  this.update = delta => {
    life.update(delta);

    this.particles.each(_ => _.update(delta));

  };
  
}


function makeParticle(ctrl, explosion) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;

  const bWidth = 20;

  let geometry = geo.cubeGeometry(bWidth);
  this.mesh = new makeMesh(camera, geometry, {
    width: bWidth,
    height: bWidth
  });

  this.entity = new makeEntity
  (ctrl, this.mesh, () => {
    explosion.particles.release(this);
  }, 0.4);

  let phy = this.entity.physics;
  let lif = this.life = this.entity.life;

  let frontColor = new co.shifter(co.Palette.ChileanFire);

  let frontLum = new u.interpolator(0.0),
      frontAlpha = new u.interpolator(0.5);

  this.init = d => {
    this.data = { x: 0,
                  y: 0,
                  z: 0, ...d };

    lif.init();

    let { x, y, z } = this.data;

    phy.pos({ x, y, z });
    phy.vel({ x: 0, y: 0, z: 0 });
    phy.acc({ x: 0, y: 0, z: 0 });

    let jHigh = width * 0.05;

    phy.jump(u.rand(-jHigh, jHigh),
             u.rand(0, jHigh),
             u.rand(-jHigh, jHigh));

    phy.vrot({
      x: u.rand(0, u.TAU),
      y: u.rand(0, u.TAU),
      z: u.rand(0, u.TAU)
    });

    frontLum.set(0.5);
    frontAlpha.set(1.0);
  };

  const updatePaint = delta => {
    frontLum.interpolate();
    frontAlpha.interpolate();

    this.mesh.paint('front', frontColor
                    .reset()
                    .alp(frontAlpha.get())
                    .lum(frontLum.get())
                    .css());
  };


  this.update = delta => {
    updatePaint(delta);
    this.entity.update(delta);
    phy.update(delta);
  };
  
}
