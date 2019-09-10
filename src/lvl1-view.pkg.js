const initLevel1View = (setState, { onWindowResize, onKeyDown }, numFoods, images) => {
  const [canvas, ctx] = createCanvas();
  const tileHeight = 100;
  const tileWidth = 100;

  const [
    hotdogImg,
    kongBackImg,
    kongFrontImg,
    kongRightImg,
    pizzaImg
  ] = images
  window.kongRight = kongRightImg;
  const cellStyles = {
    [OUT_OF_BOUNDS]: 'lightblue',
    [BLOCKED]: 'transparent',
    [BUILDING_2X4]: 'brown',
    // [OUT_OF_BOUNDS_CUTOFF]:
    [STREET]: colorStreet,
    [PIZZA]: 'yellow',
    [EXIT]: 'green'
  };

  const [progressBar, pizzaSpan] = createProgressBar('Pizzas Eaten');

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
  }

  function write (state) {
    pizzaSpan.style.width = `${(numFoods - state.remainingFoods) / numFoods * 100}%`;
  }

  function faceDirection (dir) {
    let kong;
    switch (dir) {
      case 'up': kong = kongBackImg; break;
      case 'right': kong = kongRightImg; break;
      case 'down': kong = kongFrontImg; break;
      case 'left': kong = kongRightImg; break;
    }
    let multiplier = 1;
    if (dir === 'left') {
      ctx.scale(-1, 1);
      ctx.translate(-100, 0);
      multiplier = -1;
    }
    ctx.drawImage(kong, multiplier * (canvas.width / 2 - kong.width / 2), canvas.height / 2 - kong.height / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function render (mapView, state) {
    return new Promise((resolve, reject) => {
      try {
        draw(mapView, state);
        faceDirection(state.facing);
        write(state);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  // init
  root.appendChild(progressBar);
  root.appendChild(canvas);
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
      root.removeChild(canvas);
      root.removeChild(progressBar);
      removeListeners.forEach(remove => remove());
    }
  }
}