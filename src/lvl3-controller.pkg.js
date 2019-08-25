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

  function recoverFromAttack (name, time) {
    setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: actions.DISABLED
        }
      }
    });
    setTimeout(() => setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: actions.READY
        }
      }
    }), time);
  }

  function attack (attacker, opponent, distance, damage) {
    setState(state => {
      const attState = state[attacker];
      const oppState = state[opponent];
      let newState = {
        [attacker]: {
          ...attState,
          currentAction: actions.ATTACKING
        }
      };
      if (opponent) {
        let newLocation;
        if (attState.location < oppState.location) {
          newLocation = oppState.location + distance;
        } else {
          newLocation = oppState.location - distance;
        }
        newState[opponent] = {
          ...oppState,
          health: oppState.health - damage,
          location: newLocation
        }
      };
      // both will need to recover after the attack
      setTimeout(() => recoverFromAttack(attacker, 1500), 1000);
      setTimeout(() => recoverFromAttack(opponent, 1000), 500);
      return newState;
    });
  }

  function startAttackSequence (name) {
    setState(state => {
      const char = state[name];
      // check if can attack
      if (char.currentAction === actions.DISABLED) return state;
      // calculate attack location
      let attackLocation = char.location;
      if (char.direction === directions.LEFT) {
        attackLocation--;
      } else {
        attackLocation++;
      }
      // check if opponent is in attack location
      const oppName = state[opponent[name]].location === attackLocation ? opponent[name] : '';
      // start attack sequence = name, name, distance, damage
      setTimeout(() => attack(name, oppName, 1, 10), 500);
      return {
        ...state,
        [name]: {
          ...state[name],
          currentAction: actions.PREPARING_ATTACK
        }
      };
    })
  }

  // Only used by kong
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

  // Only used by kong
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

  // Only used by kong
  function clickHandler (e) {
    startAttackSequence('kong');
  }

  const {
    cleanUp,
    render
  } = initLevel3View(keydownHandler, keyupHandler, clickHandler, actions, directions);
  setState({
    kong: initialKongState,
    trex: initialTrexState
  });
};
