const initLevel1 = async (pizzaSound, nextLevel) => {
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
    numFoods,
    enableExit
  } = initModel(40, 38, .1);

  const {
    getSnapshot,
    isUpdated,
    setState: modelSetState
  } = initState();
  const setState = val => modelSetState(val) && loop();

  const onWindowResize = (bodyDimensions) => setState(bodyDimensions);
  const onKeyDown = (which) => {
    let facing;
    setState((state) => {
      if (state.gameOver) return;
      let row = 0;
      let col = 0;
      switch (which) {
        case 37: // left
        case 65: // a
          col--;
          facing = 'left';
          break;
        case 38: // up
        case 87: // w
          row--;
          facing= 'up';
          break;
        case 39: // right
        case 68: // d
          col++;
          facing = 'right'
          break;
        case 40: // down
        case 83: // s
          row++;
          facing = 'down';
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
        if (cell.itemId == PIZZA || cell.itemId == HOTDOG) {
          cell.itemId = null;
          pizzaCount = pizzaCount - 1;
          pizzaSound();
        }
        if (pizzaCount == 0 && !canExit) {
          enableExit();
          canExit = true;
        }
        let gameOver = state.gameOver;
        if (cell.displayId == EXIT) {
          gameOver = true;
          setTimeout(() => {
            viewCleanUp();
            nextLevel();
          }, 2000);
        }
        return {
          position: proposedNewPosition,
          remainingFoods: pizzaCount,
          canExit,
          gameOver,
          facing
        };
      }
    });
  }
  const images = await loadSVGs([
    'assets/hot-dog.svg',
    'assets/kong-back.svg',
    'assets/kong-front.svg',
    'assets/kong-right.svg',
    'assets/pizza.svg'
  ]);

  const {
    render,
    tileHeight,
    tileWidth,
    cleanUp: viewCleanUp
  } = initLevel1View(modelSetState, { onWindowResize, onKeyDown }, numFoods, images);

  // init
  modelSetState({
    position: {row: 9, col: 10 },
    facing: 'down',
    remainingFoods: numFoods,
    canExit: false,
    gameOver: false
  });

  loop();
};
