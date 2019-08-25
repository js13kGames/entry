const initLevel3 = () => {
  const opponent = {
    trex: 'kong',
    kong: 'trex'
  };
  const loop = () => {
    const state = getState();
    render(
      mapData,
      state.kong,
      state.trex
    ).then(() => isUpdated() && loop());
  };

  // init
  const {
    mapData,
    initialKongState,
    initialTrexState,
    actions,
    directions
  } = initLevel3Model(50, 25, 35);

  const {
    getState,
    isUpdated,
    setState: modelSetState
  } = initState();
  const setState = val => modelSetState(val) && loop();

  function move (desiredDirection, name) {
    setState((state) => {
      const char = state[name];
      if (char.currentAction === actions.DISABLED || char.currentAction === actions.BLOCKING) {
        return;
      }
      let proposedLocation = char.location;
      let newFacingDirection;
      switch (desiredDirection) {
        case 'left':
          proposedLocation--;
          newFacingDirection = directions.LEFT;
          break;
        case 'right':
          proposedLocation++;
          newFacingDirection = directions.RIGHT;
          break;
      }
      if (
        proposedLocation >= mapData.width
        || proposedLocation < 0
        || proposedLocation === state[opponent[name]].location
      ) proposedLocation = char.location; // reset to current state
      // TODO is location under attack
      return {
        [name]: {
          ...char,
          direction: newFacingDirection,
          location: proposedLocation
        }
      }
    })
  }

  function block (name) {
    setState(state => {
      if (state[name].currentAction === actions.DISABLED) {
        return state;
      }
      return {
        [name]: {
          ...state[name],
          currentAction: actions.BLOCKING
        }
      }
    });
  }

  function unblock (name) {
    setState(state => {
      // TODO check if now being attacked
      return {
        [name]: {
          ...state[name],
          currentAction: actions.READY
        }
      }
    });
  }

  window.move = move;
  window.block = block;
  window.unblock = unblock;

  function keydownHandler (key) {
    switch (key) {
      case 37:
        // left
        move('left', 'kong');
        break;
      case 39:
        // right
        move('right', 'kong');
        break;
      case 40:
        // down
        block('kong');
        break;
      default:
        return;
    }
  }

  function keyupHandler (key) {
    switch (key) {
      case 40:
        // release down
        unblock('kong');
        break;
      default:
        return;
    }
  }

  const {
    cleanUp,
    render
  } = initLevel3View(keydownHandler, keyupHandler, actions, directions);
  setState({
    kong: initialKongState,
    trex: initialTrexState
  });
};
