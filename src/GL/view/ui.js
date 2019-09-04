import * as u from '../util';

import * as gutil from '../gutil';

export default function view(ctrl, g, assets) {

  const { width, height } = ctrl.data.game;

  const dScore = gutil.makeTextDraw(g, assets['glyps']);
  const dScoreLabel = gutil.makeTextDraw(g, assets['glyps']);

  const dLevel = gutil.makeTextDraw(g, assets['glyps']);
  const dLevelLabel = gutil.makeTextDraw(g, assets['glyps']);

  const scale = 4.0,
        sOffsetX = 80,
        sOffsetY = 20;

  this.render = ctrl => {
    const { score, level } = ctrl.data;

    // const { width: lW } = dScoreLabel("score", {
    //   translation: [sOffsetX, sOffsetY],
    //   scale: [scale, -scale]
    // });

    // dScore(score + "", {
    //   scale: [scale * 1.2, -scale * 1.2],
    //   translation: [sOffsetX + (lW * scale) + 5, sOffsetY]
    // });

    let { width: lW2 } = dLevelLabel("level", {
      translation: [width - 200, height - 30],
      scale: [scale, -scale]
    });

    dLevel(level + "", {
      scale: [scale * 1.2, -scale * 1.2],
      translation: [width - 80, height - 30]
    });
  };
  
}
