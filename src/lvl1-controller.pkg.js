const initLevel1 = (nextLevel) => {
  const loop = () => {
    const state = getSnapshot();
    const heightPadding = ceil(((state.height / tileHeight) - 1) / 2)
    const widthPadding = ceil(((state.width / tileWidth) - 1) / 2)
    render(
      getMapView(state.position, heightPadding, widthPadding),
      state
    ).then(() => isUpdated() && loop());
  };

  const {
    getMapView,
    cellIds,
    numFoods,
    enableExit
  } = initModel(20, 20, .1);

  const {
    getState,
    getSnapshot,
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
      let pizzaCount = state.remainingFoods;
      let canExit = state.canExit;
      const cell = getMapView(proposedNewPosition, 0, 0)[0][0];
      if (cell.canEnter) {
        if (cell.itemId === cellIds.PIZZA || cell.itemId === cellIds.HOTDOG) {
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
          setTimeout(() => {
            viewCleanUp();
            nextLevel();
          }, 2000);
        }
        return { position: proposedNewPosition, remainingFoods: pizzaCount, canExit, gameOver };
      }
    });
  }
  const {
    render,
    tileHeight,
    tileWidth,
    cleanUp: viewCleanUp
  } = initLevel1View(modelSetState, { onWindowResize, onKeyDown }, cellIds, numFoods);


  // init
  modelSetState({
    position: {row: 10, col: 10 },
    remainingFoods: numFoods,
    canExit: false,
    gameOver: false
  });
  loop();
};
