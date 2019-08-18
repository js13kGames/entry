import { init as modelInit, getMapView } from '../model';
import { setState as modelSetState, getState, isUpdated } from '../model/state';
import { draw, init as viewInit, tileHeight, tileWidth } from '../view';

window.getState = getState;
const setState = val => modelSetState(val) && loop();
const loop = () => {
  const state = getState();
  const heightPadding = Math.ceil(((state.height / tileHeight) - 1) / 2)
  const widthPadding = Math.ceil(((state.width / tileWidth) - 1) / 2)
  draw(
    getMapView(state.position, heightPadding, widthPadding),
    state
  ).then(() => isUpdated() && loop());
}

export const init = () => {
  modelSetState({ position: {row: 50, col: 50 }});
  modelInit();
  viewInit(
    setState,
    {
      onWindowResize: (bodyDimensions) => setState(bodyDimensions),
      onKeyDown: (which) => {
        setState((state) => {
          let row = 0;
          let col = 0;
          switch (which) {
            case 37:
              // left
              col--;
              break;
            case 38:
              // up
              row--;
              break;
            case 39:
              // right
              col++;
              break;
            case 40:
              // down
              row++;
              break;
            default:
              return;
          }
          const proposedNewState = {
            row: state.position.row + row,
            col: state.position.col + col
          };
          const cell = getMapView(proposedNewState, 0, 0);
          if (cell[0][0] !== 'black') { // is not an invalid cell
            return { position: proposedNewState};
          }
        });
      }
    }
  );
};
