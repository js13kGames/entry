const initLevel1View = (setState, { onWindowResize, onKeyDown }, cellIds, numFoods) => {
  const rAF = window.requestAnimationFrame;
  const cancelAF = window.cancelAnimationFrame;

  const canvas = createElement('canvas');
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
    HOTDOG,
    EXIT
  } = cellIds;
  const cellStyles = {
    [OUT_OF_BOUNDS]: 'lightblue',
    [BLOCKED]: 'transparentx',
    [BUILDING_2X4]: 'brown',
    // [OUT_OF_BOUNDS_CUTOFF]:
    [STREET]: 'black',
    [PIZZA]: 'yellow',
    [EXIT]: 'green'
  };

  const [progressBar, pizzaSpan] = createProgressBar('pizza-progress', 'Pizzas Eaten');

  const ape = ctx.createImageData(100, 100);
  // Iterate through every pixel
  for (let i = 0; i < ape.data.length; i += 4) {
    // Modify pixel data
    ape.data[i + 0] = 190;  // R value
    ape.data[i + 1] = 0;    // G value
    ape.data[i + 2] = 210;  // B value
    ape.data[i + 3] = 255;  // A value
  }

  const pizzaImg = new Image();
  pizzaImg.src = 'assets/pizza.svg';
  const hotdogImg = new Image();
  hotdogImg.src = 'assets/hot-dog.svg';

  function draw(mapView, state) {
    canvas.width = state.width;
    canvas.height = state.height;

    const viewWidth = mapView[0].length * tileWidth;
    const viewHeight = mapView.length * tileHeight;
    const viewYStart = (state.height - viewHeight) / 2;
    const viewXStart = (state.width - viewWidth) / 2;
    for (let y = 0; y < mapView.length; y++) {
      for (let x = 0; x < mapView[0].length; x++) {
        const cell = mapView[y][x]
        ctx.fillStyle = cellStyles[cell.displayId];
        ctx.fillRect((viewXStart + x * tileWidth), (viewYStart + y * tileHeight), tileWidth, tileHeight);
        if (cell.displayId < OUT_OF_BOUNDS_CUTOFF && cell.imgData) {
          ctx.putImageData(cell.imgData, (viewXStart + x * tileWidth), (viewYStart + y * tileHeight));
        }
        if (cell.itemId) {
          if (cell.itemId === PIZZA) ctx.drawImage(pizzaImg, (viewXStart + x * tileWidth), (viewYStart + y * tileHeight));
          if (cell.itemId === HOTDOG) ctx.drawImage(hotdogImg, (viewXStart + x * tileWidth), (viewYStart + y * tileHeight));
        }
      }
    }
    ctx.putImageData(ape, canvas.width / 2 - ape.width / 2, canvas.height / 2 - ape.height / 2);
  }

  function write (state) {
    pizzaSpan.style.width = `${(numFoods - state.remainingFoods) / numFoods * 100}%`;
  }

  function render (mapView, state) {
    return new Promise((resolve, reject) => {
      try {
        draw(mapView, state);
        write(state);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  // init
  body.appendChild(canvas);
  body.appendChild(progressBar);
  const removeListeners = [
    addEventListener(
      window,
      'resize',
      () => onWindowResize({
        width: body.clientWidth,
        height: body.clientHeight
      })
    ),
    addEventListener(
      window,
      'keydown',
      (e) => {
        onKeyDown(e.which)
      }
    )
  ];

  setState({
    width: body.clientWidth,
    height: body.clientHeight
  });

  return {
    render,
    tileHeight,
    tileWidth,
    cleanUp: () => {
      body.removeChild(canvas);
      body.removeChild(progressBar);
      removeListeners.forEach(remove => remove());
    }
  }
}