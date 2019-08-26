const initLevel3 = () => {
  const opponentOf = {
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
      if (char.health === 0) window.alert(`${name} has no health`);
      if (char.currentAction !== actions.READY) {
        return;
      }
      let nextLocation = char.location;
      let newFacingDirection;
      switch (desiredDirection) {
        case 'left':
          nextLocation--;
          newFacingDirection = directions.LEFT;
          break;
        case 'right':
          nextLocation++;
          newFacingDirection = directions.RIGHT;
          break;
      }
      if (
        nextLocation >= mapData.width
        || nextLocation < 0
        || nextLocation === state[opponentOf[name]].location
      ) nextLocation = char.location; // reset to current state
      // TODO is location under attack
      return {
        [name]: {
          ...char,
          direction: newFacingDirection,
          location: nextLocation
        }
      }
    })
  }

  function block (name) {
    setState(state => {
      if (state[name].currentAction === actions.READY) {
        return {
          [name]: {
            ...state[name],
            currentAction: actions.BLOCKING
          }
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

  function recoverFromAttack (name) {
    setTimeout(() => setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: actions.READY
        }
      }
    }), time);
  }

  function startRecoveryFromAttack (name, time) {
    setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: actions.DISABLED
        }
      }
    });
    setTimeout(() => recoverFromAttack(name), time);
  }

  function attack (attacker, attackLocation, distance, damage) {
    setState(state => {
      const attackerState = state[attacker];
      let newState = {
        [attacker]: {
          ...attackerState,
          currentAction: actions.ATTACKING
        }
      };
      const opponentState = state[opponentOf[attacker]];
      // check if opponent is in attack location
      if (opponentState.location === attackLocation && opponentState.currentAction !== actions.BLOCKING) {
        let newOpponentLocation;
        if (attackerState.location < opponentState.location) {
          newOpponentLocation = opponentState.location + distance;
        } else {
          newOpponentLocation = opponentState.location - distance;
        }
        newState[opponent] = {
          ...opponentState,
          health: opponentState.health - damage,
          location: newOpponentLocation,
          currentAction: actions.DISABLED
        }
        setTimeout(() => recoverFromAttack(opponent, 1500), 500);
      };
      // both will need to recover after the attack
      setTimeout(() => startRecoveryFromAttack(attacker, 1500), 500);
      return newState;
    });
  }

  function startAttackSequence (name) {
    setState(state => {
      const char = state[name];
      // check if can attack
      if (char.currentAction !== actions.READY) return;
      // calculate attack location
      let attackLocation = char.location;
      if (char.direction === directions.LEFT) {
        attackLocation--;
      } else {
        attackLocation++;
      }
      // name, name, loc, distance, damage
      setTimeout(() => attack(name, attackLocation, 1, 10), 500);
      return {
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
  function clickHandler () {
    startAttackSequence('kong');
  }

  function trexBrainLoop () {
    if (state.trex.location - state.kong.location <= 2) {
      if (random() > .5) {
        startAttackSequence('trex');
      } else {
        block('trex');
        setTimeout(() => unblock('trex'), 1000);
      }
    } else {
      setTimeout(() => {
        move('left', 'trex');
        trexBrainLoop();
      }, random() * 1000);
    }
  };

  const {
    cleanUp,
    render
  } = initLevel3View(keydownHandler, keyupHandler, clickHandler, actions, directions);
  setState({
    kong: initialKongState,
    trex: initialTrexState
  });
  trexBrainLoop();
};
