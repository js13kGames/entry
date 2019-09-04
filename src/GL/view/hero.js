import shaderMap from '../shaders';

import * as u from '../util';
import Pool from '../pool';

import * as G from '../graphics';

export default function view(ctrl, g) {
  const { width, height, heroWidth, ratio } = ctrl.data.game;
  
  const game = ctrl.data;

  let heroQuad = g.makeQuad({
    fSource: shaderMap['fhero'],
    uniforms: {

      uResolution: G.makeUniform2fSetter("uResolution"),
      uTime: G.makeUniform1fSetter("uTime"),
      uMatrix: G.makeUniform3fvSetter("uMatrix")
    }
  }, heroWidth, heroWidth);


  let bulletQuads = new Pool(id => 
    g.makeQuad({
      name: 'bullet' + id,
      fSource: shaderMap['fhero'],
      uniforms: {
        uMatrix: G.makeUniform3fvSetter("uMatrix")      
      }
    }, heroWidth * 0.3, heroWidth * 0.3)
    , { name: 'bulletQuad' });

  const renderHero = ctrl => {
    const { tick } = ctrl.data;
    const heroCtrl = ctrl.play.hero;
    
    const { x: cameraX } = ctrl.play.camera.data;

    const { x, y } = heroCtrl.data;

    g.addQuad(heroQuad, {
      width: heroWidth,
      height: heroWidth,
      translation: [x - cameraX, y]
    }, {
      uTime: [tick]
    });
  };

  const renderBullet = (ctrl, bulletCtrl) => {
    const { x: cameraX } = ctrl.play.camera.data;

    const { x, y } = bulletCtrl.data;

    let quad = bulletQuads.acquire();
    g.addQuad(quad, {
      width: heroWidth * 0.3,
      height: heroWidth * 0.3,
      translation: [x - cameraX, y]
    });
  };

  this.render = ctrl => {
    renderHero(ctrl);

    ctrl.play.bullets.bullets.each(bulletCtrl =>
      renderBullet(ctrl, bulletCtrl));    
  };

  this.release = () => {
    bulletQuads.releaseAll();
  };
}
