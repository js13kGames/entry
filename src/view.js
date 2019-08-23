import * as u from './util';

import text from './text';  

import overView from './view/over';
import playView from './view/play';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const b = g.buffers;
  
  g.renderTarget = b.Screen;

  const over = new overView(ctrl, g);
  const play = new playView(ctrl, g);

  this.render = ctrl => {
    clear(ctrl, g);

    play.render(ctrl);

    over.render(ctrl);

    renderDebug(ctrl, g);

    flush(ctrl, g);

    effects(ctrl, g);
  };

  function effects(ctrl, g) {
    extrusion(ctrl, g);
    
    shake(ctrl, g);
  }

  function extrusion(ctrl, g) {
    g.renderTarget = b.Effects;
    g.clear(0);

    let { angle3 } = ctrl.data.extrusion;

    angle3 = angle3.map(u.round);

    g.renderSource = b.Screen;
    g.renderTarget = b.Effects;
    g.spr();

    g.renderTarget = b.Screen;
    //g.clear(0);
    g.fr(0, 0, width, height, 0);

    g.renderSource = b.Effects;
    g.renderTarget = b.Screen;
    g.rspr3(0, 0, width, height, width / 2, height / 2, angle3);
  }

  function shake(ctrl, g) {
    g.renderTarget = b.Effects;
    g.clear(0);

    let { angle, x, y } = ctrl.data.shake;

    angle = u.round(angle);
    x = u.round(x);
    y = u.round(y);

    g.renderSource = b.Screen;
    g.renderTarget = b.Effects;
    g.spr();

    g.renderTarget = b.Screen;
    g.clear(0);

    g.renderSource = b.Effects;
    g.renderTarget = b.Screen;
    g.rspr(0, 0, width, height, width/2 + x, height/2 + y, 1, angle);
  }

  function flush(ctrl, g) {
    g.renderSource = b.Background;
    g.renderTarget = b.Screen;
    g.spr();

    g.renderSource = b.Collision;
    g.renderTarget = b.Screen;
    // g.spr();

    g.renderSource = b.Midground;
    g.renderTarget = b.Screen;
    g.spr();

    g.renderSource = b.Foreground;
    g.renderTarget = b.Screen;
    g.spr();


    g.renderSource = b.Ui;
    g.renderTarget = b.Screen;
    g.spr();
  }

  function clear(ctrl, g) {
    g.renderTarget = b.Ui;
    g.clear(0);
    g.renderTarget = b.Collision;
    g.clear(0);
    g.renderTarget = b.Background;
    g.clear(0);
    g.renderTarget = b.Buffer;
    g.clear(0);
    g.renderTarget = b.Screen;
    g.clear(0);
    g.renderTarget = b.Midground;
    g.clear(0);
    g.renderTarget = b.Foreground;
    g.clear(0);
  }

  function renderDebug(ctrl, g) {
    if (!ctrl.data.debug) {
      return;
    }
    g.renderTarget = b.Foreground;
    const w = 8;

    for (let i = 0; i < 64; i++) {
      const x = Math.floor(i / 32) * w * 4 + width * 0.1,
            y = (i % 32) * w;
      g.fillRect(x, y, x + w, y + w, i);
      text({
        x: x - w,
        y: y,
        hspacing: 1,
        text: i + '',
        color: i
      }, g);
    }
  }
}

