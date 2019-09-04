import * as u from './util';

import backView from './view/background';
import playView from './view/play';
import menuView from './view/menu';
import uiView from './view/ui';
import debugView from './view/debug';

export default function view(ctrl, g, assets) {

  const { width, height } = ctrl.data;

  const back = new backView(ctrl, g);
  const ui = new uiView(ctrl, g, assets);
  const play = new playView(ctrl, g, assets);
  const menu = new menuView(ctrl, g);
  const debug = new debugView(ctrl, g);

  this.render = ctrl => {

    back.render(ctrl);
    const views = play.render(ctrl);
    //ui.render(ctrl);
    //menu.render(ctrl);
    //pdebug.render(ctrl);
    return views;
  };

  this.release = () => {
    play.release();
  };

}
