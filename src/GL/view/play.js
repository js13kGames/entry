import * as u from '../util';

import * as G from '../graphics';

import tilesView from './tiles';

export default function view(ctrl, g, assets) {

  const { width, height } = ctrl.data;

  const tiles = new tilesView(ctrl, g, assets);

  this.render = ctrl => {
    return tiles.render(ctrl);
  };

  this.release = () => {
    tiles.release();
  };

}
