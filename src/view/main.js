import playView from './play';
import overView from './over';

import * as co from '../colors';

export default function view(ctrl, g, assets) {
  const { width, height } = ctrl.data.game;

  const play = new playView(ctrl, g);
  const over = new overView(ctrl, g);

  const colBg = new co.shifter(co.Palette.Mandarin);

  this.render = ctrl => {

    g.draw(ctx => {
      ctx.clearRect(0, 0, width, height);


      ctx.fillStyle = colBg.css();
      ctx.fillRect(0, 0, width, height);
    }, { x: 0, y: 0, width, height });

    play.render(ctrl, g);
    over.render(ctrl, g);
  };

}
