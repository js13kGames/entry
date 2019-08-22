const initView = (setState, { onWindowResize, onKeyDown }) => {
  const body = document.body;
  const element = type => document.createElement(type);
  const rAF = window.requestAnimationFrame;
  const cancelAF = window.cancelAnimationFrame;
  const windowAddEventListener = window.addEventListener.bind(window);
  const ceil = Math.ceil;
  const floor = Math.floor;

  const canvas = element('canvas');
  const ctx = canvas.getContext('2d');
  const tileHeight = 100;
  const tileWidth = 100;

  const ape = ctx.createImageData(100, 100);
  // Iterate through every pixel
  for (let i = 0; i < ape.data.length; i += 4) {
    // Modify pixel data
    ape.data[i + 0] = 190;  // R value
    ape.data[i + 1] = 0;    // G value
    ape.data[i + 2] = 210;  // B value
    ape.data[i + 3] = 255;  // A value
  }

  function draw (view, state) {
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
        ctx.putImageData(ape, canvas.width / 2 - ape.width / 2, canvas.height / 2 - ape.height / 2);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  // init
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
  });
  windowAddEventListener(
    'keydown',
    (e) => {
      onKeyDown(e.which)
    }
  );

  return {
    draw,
    tileHeight,
    tileWidth
  }
}