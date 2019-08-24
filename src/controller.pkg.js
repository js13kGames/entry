const initController = () => {
  const loop = () => {
    const state = getState();
    const heightPadding = ceil(((state.height / tileHeight) - 1) / 2)
    const widthPadding = ceil(((state.width / tileWidth) - 1) / 2)
    draw(
      getMapView(state.position, heightPadding, widthPadding),
      state
    ).then(() => isUpdated() && loop());
  };

  const {
    getMapView,
    cellIds,
    numFoods,
    enableExit
  } = initModel(20, 20, .01);

  const {
    getState,
    isUpdated,
    setState: modelSetState
  } = initState();
  const setState = val => modelSetState(val) && loop();

  const onWindowResize = (bodyDimensions) => setState(bodyDimensions);
  const onKeyDown = (which) => {
    setState((state) => {
      if (state.gameOver) return;
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
      const proposedNewPosition = {
        row: state.position.row + row,
        col: state.position.col + col
      };
      let pizzaCount = state.numFoods;
      let canExit = state.canExit;
      const cell = getMapView(proposedNewPosition, 0, 0)[0][0];
      if (cell.canEnter) {
        if (cell.itemId === cellIds.PIZZA) {
          cell.itemId = null;
          pizzaCount = pizzaCount - 1;
        }
        if (pizzaCount === 0 && !canExit) {
          enableExit();
          canExit = true;
        }
        let gameOver = state.gameOver;
        if (cell.displayId === cellIds.EXIT) {
          gameOver = true;
        }
        return { position: proposedNewPosition, numFoods: pizzaCount, canExit, gameOver };
      }
    });
  }
  const {
    draw,
    tileHeight,
    tileWidth
  } = initView(modelSetState, { onWindowResize, onKeyDown }, cellIds);


  // init
  modelSetState({
    position: {row: 10, col: 10 },
    numFoods,
    canExit: false,
    gameOver: false
  });
  loop();
};
