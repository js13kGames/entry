import defaults from './state';

import Assets from './assets';

import Graphics from './graphics';
import makeView from './view/main';
import makeCtrl from './ctrl/main';
import Loop from 'loopz';

import * as events from './events';

export function app(element, options) {

  const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
  element.append(canvas);
  const displayWidth = canvas.clientWidth,
        displayHeight = canvas.clientHeight;
  canvas.width = displayWidth;
  canvas.height = displayHeight;

  new Assets({
    'font': 'assets/font_10.png'
  }).start()
    .then(assets => {

      const state = {
        ...defaults(displayWidth, displayHeight)
      };

      let graphics = new Graphics(state, ctx);

      let ctrl = new makeCtrl(state, graphics);
      let view = new makeView(ctrl, graphics, assets);

      new Loop(delta => {
        ctrl.update(delta);
        ctrl.data.views = view.render(ctrl);
        //graphics.render();
        //view.release();
      }, 60).start();

      events.bindDocument(ctrl, graphics);


      if (module.hot) {
        module.hot.accept('./ctrl/main', function() {
          try {
            ctrl = new makeCtrl(state, graphics);
          } catch (e) {
            console.log(e);
          }
        });
        module.hot.accept
        (['./view/main'], function() 
         {
           try {
             view = new makeView(ctrl, graphics, assets);
           } catch (e) {
             console.log(e);
           }
         });
      }
    });
}
