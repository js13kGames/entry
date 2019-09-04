import * as gu from '../gutil';
import * as u from '../util';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const bg = gu.makeQuad(g, {
    program: 'debugbg',
    width,
    height
  });

  const item = gu.makeQuad(g, {
    program: 'debugbg',
    width: width * 0.2,
    height: height * 0.2
  });

  this.render = ctrl => {
    bg();

    item({
      translation: [width * 0.5,
                    height * 0.5],
      scale: [2.0, 2.0],
      width: width * 0.2,
      height: height * 0.2
    });
    
  };
  
}
