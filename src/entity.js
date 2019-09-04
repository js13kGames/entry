import makeMesh from './mesh';
import * as geo from './geometry';
import makePhysics from './physics';
import makeLife from './life';

import * as u from './util';

import Pool from './pool';

import * as v from './vector';

const { vec3 } = v;

export default function makeEntity(ctrl, mesh, onDie, liveSecs, gravity = vec3(0.0, 10, 0.0)) {

  const { camera } = ctrl;
  const { width, height } = ctrl.data.game;
  
  const physics = new makePhysics({
    width: mesh.width,
    height: mesh.height,
    gravity
  });

  let life = new makeLife(onDie, {
    life: liveSecs
  });

  let phy = this.physics = physics;
  this.life = life;

  this.init = d => {
    this.data = { ...d };
  };


  this.dimensions = delta => {
    const pos = phy.values(),
          posAfter = this.calculatePhysics(delta);

    return {
      before: dimensions(pos, mesh.width),
      after: dimensions(posAfter, mesh.height)
    };
  };

  this.calculatePhysics = delta => {
    let { pos, theta } = phy.calculateUpdate(delta);
    return phy.values(pos, theta);
  };

  this.applyPhysics = (delta, collisions) => {
    let update = phy.calculateUpdate(delta, collisions);

    if (collisions.bottom) {
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    if (collisions.top) {
      this.groundedTop = true;
    } else {
      this.groundedTop = false;
    }

    phy.applyUpdate(update);
  };
  
  const updateModel = delta => {
    mesh.updateModel(physics.values());
  };

  this.update = delta => {

    updateModel();

    life.update(delta);
  };

}

const dimensions = (pos, w, h = w) => {
  return {
    left: pos.x,
    top: pos.y,
    right: pos.x + w,
    bottom: pos.y + h,
    front: pos.z
  };
};
