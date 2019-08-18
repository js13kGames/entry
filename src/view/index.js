const body = document.body;
const element = type => document.createElement(type);
const rAF = window.requestAnimationFrame;
const cancelAF = window.cancelAnimationFrame;
const windowAddEventListener = window.addEventListener.bind(window);
const ceil = Math.ceil;
const floor = Math.floor;

const canvas = element('canvas');
const ctx = canvas.getContext('2d');

export const tileWidth = 100;
export const tileHeight = 100;

export function init (setState, { onWindowResize, onKeyDown }) {
  body.appendChild(canvas);
  windowAddEventListener(
    'resize',
    () => onWindowResize({
      width: body.clientWidth,
      height: body.clientHeight
    })
  );

  setState({
    width: body.clientWidth,
    height: body.clientHeight
  })
  windowAddEventListener(
    'keydown',
    (e) => {
      onKeyDown(e.which)
    }
  )
}

function getView (map, width, height, position) {
  const widthFits = floor(width / tileWidth);
  const heightFits = floor(height / tileHeight);
  const widthPadding = ceil((widthFits - 1) / 2);
  const heightPadding = ceil((heightFits - 1) / 2);
  const rowStart = position.row - heightPadding + 1;
  const rowEnd = position.row + heightPadding - 1;
  const colStart = position.col - widthPadding + 1;
  const colEnd = position.col + widthPadding - 1;

  return map.slice(rowStart, rowEnd).map(row => row.slice(colStart, colEnd));
}

export function draw (view, state) {
  return new Promise((resolve, reject) => {
    try {
      canvas.width = state.width;
      canvas.height = state.height;

      const viewWidth = view[0].length * tileWidth;
      const viewHeight = view.length * tileHeight;
      const viewYStart = (state.height - viewHeight) / 2;
      const viewXStart = (state.width - viewWidth) / 2;
      for (let y = 0; y < view.length; y++) {
        for (let x = 0; x < view[0].length; x++) {
          ctx.fillStyle = view[y][x];
          ctx.fillRect((viewXStart + x * tileWidth), (viewYStart + y * tileHeight), tileWidth, tileHeight);
        }
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}