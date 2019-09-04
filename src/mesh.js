import * as u from './util';

import * as mat4 from './matrix';

export default function mesh(camera, geometry, dims) {

  dims = { 
    x: 0,
    y: 0,
    z: 0,
    width: 10,
    height: 10,
    scale: 1,
    theta: [0, 0, 0],
    ...dims };

  this.width = dims.width;
  this.height = dims.height;

  let modelMatrix = mat4.identity();

  let material = {};

  this.material = () => material;

  this.paint = (face, color) => {
    material[face] = color;
  };

  this.geometry = () => {

    let { vertices, lines, faces, faceIndexes } = geometry;

    let model = vertices.map(vertex => {
      return mat4.multiplyVec(modelMatrix, [...vertex, 1.0]);
    });

    let view = model.map(vertex =>
      camera.project(vertex)
    );


    return {
      view,
      lines,
      faces,
      faceIndexes
    };
  };

  this.updateModel = (props =  {}) => {
    dims = { ...dims, ...props };

    const { x, y, z, 
            width,
            height,
            scale,
            theta } = dims;

    modelMatrix = mat4.translation(x,
                                   y,
                                   z);

    modelMatrix = mat4.translate(modelMatrix,
                                 -width * 0.5,
                                 -height * 0.5, 
                                 -width * 0.5);

    modelMatrix = mat4.translate(modelMatrix,
                                 width * 0.5,
                                 height * 0.5, 
                                 width * 0.5);

    modelMatrix = mat4.zRotate(modelMatrix, theta[0]);
    modelMatrix = mat4.yRotate(modelMatrix, theta[1]);
    modelMatrix = mat4.zRotate(modelMatrix, theta[2]);

    modelMatrix = mat4.scale(modelMatrix, scale, scale, scale);

    modelMatrix = mat4.translate(modelMatrix,
                                 -width * 0.5,
                                 -height * 0.5,
                                 -width * 0.5);
  };

  this.updateModel();
}
