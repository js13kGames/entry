import shaderMap from '../shaders';

import Pool from '../pool';

import * as u from '../util';

import * as G from '../graphics';

export default function blocks(ctrl, g) {

  const { width, height, wallWidth } = ctrl.data.game;

  const blockQuads = new Pool((id) => 
    g.makeQuad({
      name: 'block' + id,
      fSource: shaderMap['fwall'],
      uniforms: {
        uMatrix: G.makeUniform3fvSetter('uMatrix')
      }
    }, wallWidth, wallWidth)
    , { name: 'blockQuads' } );

  this.render = ctrl => {
    const { x: cameraX } = ctrl.play.camera.data;

    const blocksCtrl = ctrl.play.blocks;

    blocksCtrl.blocks.each(blockCtrl => {
      const { x, y } = blockCtrl.data;
      let quad = blockQuads.acquire();
      g.addQuad(quad, {
        translation: [x - cameraX, y]
      });
    });

  };


  this.release = () => {
    blockQuads.releaseAll();
  };
}
