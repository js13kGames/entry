import * as u from '../util';

import * as mat4 from '../matrix';

export default function edge(ctrl, g) {

  const { camera } = ctrl;
  const { width, height, holeRadius } = ctrl.data.game;

  let modelMatrix = mat4.identity();
 
  let geometry,
      tX,
      tY,
      tTheta;

  this.init = (d, geo) => {
    this.data = { x: 0, y: 0,
                  theta: 0,
                  z: camera.near, ...d };

    tX = this.data.x;
    tY = this.data.y;
    tTheta = this.data.theta;

    geometry = geo;
  };

  this.move = (x, y) => {
    tX = x;
    tY = y;
  };

  this.rotate = (angle) => {
    tTheta += angle;
    //tTheta = tTheta % u.TAU;
  };

  this.geometry = () => {
    let { vertices, lines } = geometry;

    let model = vertices.map(vertex => {
      return mat4.multiplyVec(modelMatrix, [...vertex, 1.0]);
    });

    let view = model.map(vertex =>
      camera.project(vertex)
    );

    return { view, lines };
  };

  const updatePos = delta => {
    this.data.z += delta * 0.1;

    this.data.x = u.interpolate(this.data.x, tX, 0.01);
    this.data.y = u.interpolate(this.data.y, tY, 0.01);

    this.data.theta = u.interpolate(this.data.theta, tTheta);
  };

  const updateModel = () => {
    modelMatrix = mat4.translation(this.data.x,
                                   this.data.y,
                                   this.data.z);

    modelMatrix = mat4.zRotate(modelMatrix, this.data.theta);
  };

  const maybeKill = () => {
    if (this.data.z > camera.far) {
      ctrl.play.tiles.edges.release(this);
    }
  };

  this.update = delta => {
    
    updatePos(delta);
    updateModel();

    maybeKill();

  };
 
}
