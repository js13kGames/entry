import defaults from './state';

import Audio from './audio';
import Graphics from './graphics';
import makeView from './view';
import makeCtrl from './ctrl';
import Loop from './loop';

import * as events from './events';

export function app(element, options) {

  const canvas = document.createElement('canvas');
  const canvasCtx = canvas.getContext('2d');

  const state = {
    ...defaults()
  };

  let audio = new Audio(state);

  if (!state.debug) {
    audio.generate().then(() => {
      audio.playSound('song', 1, 0, 0.2, true);
    });
  }

  let graphics = new Graphics(state, canvasCtx);

  let ctx = {
    g: graphics,
    a: audio
  };

  let ctrl = new makeCtrl(state, ctx);
  let view = new makeView(ctrl, graphics);

  new Loop(delta => {
    ctrl.update(delta);
    view.render(ctrl);
    graphics.render();
  }).start();

  canvas.width = state.game.width;
  canvas.height = state.game.height;
  element.append(canvas);

  events.bindDocument(ctrl);

  if (module.hot) {
    module.hot.accept('./ctrl', function() {
      try {
        ctrl = new makeCtrl(state, graphics);
      } catch (e) {
        console.log(e);
      }
    });
    module.hot.accept('./view', function() {
      try {
        view = new makeView(ctrl, graphics);
      } catch (e) {
        console.log(e);
      }
    });
  }

}
