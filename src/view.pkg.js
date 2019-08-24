const initView = (setState, { onWindowResize, onKeyDown }, cellIds) => {
  const body = document.body;
  const element = type => document.createElement(type);
  const rAF = window.requestAnimationFrame;
  const cancelAF = window.cancelAnimationFrame;
  const windowAddEventListener = window.addEventListener.bind(window);

  const canvas = element('canvas');
  const ctx = canvas.getContext('2d');
  const tileHeight = 100;
  const tileWidth = 100;


  const {
    OUT_OF_BOUNDS,
    BLOCKED,
    BUILDING_2X4,
    OUT_OF_BOUNDS_CUTOFF,
    STREET,
    PIZZA,
    EXIT
  } = cellIds;
  const cellStyles = {
    [OUT_OF_BOUNDS]: 'lightblue',
    [BLOCKED]: 'gray',
    [BUILDING_2X4]: 'brown',
    // [OUT_OF_BOUNDS_CUTOFF]:
    [STREET]: 'black',
    [PIZZA]: 'yellow',
    [EXIT]: 'green'
  };

  const ape = ctx.createImageData(100, 100);
  // Iterate through every pixel
  for (let i = 0; i < ape.data.length; i += 4) {
    // Modify pixel data
    ape.data[i + 0] = 190;  // R value
    ape.data[i + 1] = 0;    // G value
    ape.data[i + 2] = 210;  // B value
    ape.data[i + 3] = 255;  // A value
  }

  const pizzaDataUrl = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(10, 15);
    ctx.quadraticCurveTo(50, 0, 90, 15);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'brown';
    ctx.stroke();
    ctx.lineTo(50, 90);
    ctx.lineTo(10, 15);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(35, 20, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(60, 40, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(44, 60, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    // return ctx.getImageData(0, 0, 100, 100);
    return canvas.toDataURL('image/png');
  })()

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
            const cell = view[y][x]
            ctx.fillStyle = cellStyles[cell.displayId];
            ctx.fillRect((viewXStart + x * tileWidth), (viewYStart + y * tileHeight), tileWidth, tileHeight);
            if (cell.itemId) {
              var img = new Image();
              img.src = pizzaDataUrl;
              ctx.drawImage(img, (viewXStart + x * tileWidth), (viewYStart + y * tileHeight));
            }
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