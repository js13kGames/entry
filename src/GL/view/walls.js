import * as u from '../util';
import shaderMap from '../shaders';

import Pool from '../pool';

import * as G from '../graphics';

export default function view(ctrl, g) {

  const { width, height, wallWidth } = ctrl.data.game;


  const wallQuads = new Pool((id) => 
    g.makeQuad({
      name: 'wall' + id,
      fSource: shaderMap['fwall'],
      uniforms: {
        uMatrix: G.makeUniform3fvSetter('uMatrix')
      }
    }, wallWidth, wallWidth)
    , { name: 'wallQuads' } );

  this.render = ctrl => {
    const { x: cameraX } = ctrl.play.camera.data;

    const wallsCtrl = ctrl.play.walls;

    wallsCtrl.walls.each(wallCtrl => {
      const { x, y } = wallCtrl.data;
      let quad = wallQuads.acquire();
      g.addQuad(quad, {
        width: wallWidth,
        height: wallWidth,
        translation: [x - cameraX, y]
      });
    });

    wallsCtrl.fallingWalls.each(fallingCtrl => {
      const { x, y, rotation } = fallingCtrl.data;
      let quad = wallQuads.acquire();
      g.addQuad(quad, {
        width: wallWidth,
        height: wallWidth,
        translation: [x - cameraX, y],
        rotation
      });      
    });
  };

  this.release = () => {
    wallQuads.releaseAll();
  };
  
}
