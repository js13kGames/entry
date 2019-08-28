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
      // This needs to move somewhere else. You shouldn't be able to try to move if you're dead...
      if (char.health <= 0) window.alert(`${name} has no health`);
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
    });
  }

  let attackInProgress = {};

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

  function checkIfUnderAttack (name, attackLocation, attackerLocation, distance, damage) {
    const state = getState()[name];
    if (state.location === attackLocation && state.currentAction !== actions.BLOCKING) {
      const attackWasInProgress = !!attackInProgress[name]
      attackInProgress[name] && attackInProgress[name].cancel();
      let newLocation;
      if (attackerLocation < state.location) {
        newLocation = state.location + distance;
      } else {
        newLocation = state.location - distance;
      }
      setState((currState) => ({
        [name]: {
          ...currState[name],
          health: state.health - damage,
          location: newLocation,
          currentAction: actions.DISABLED
        }
      }));
      wait(1500)
        .then(() => recoverFromAttack(name))
        .then(() => { if (name === 'trex' && attackWasInProgress) trexBrainLoop(); });
    }
  }

  function unblock (name, cb) {
    setState(state => {
      // TODO check if now being attacked
      checkIfUnderAttack (name, attackLocation, state[opponentOf[name]].location, 1, 10);
      return {
        [name]: {
          ...state[name],
          currentAction: actions.READY
        }
      }
    });
  }

  function recoverFromAttack (name) {
    setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: actions.READY
        }
      }
    });
  }

  function setToDisabled (name) {
    setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: actions.DISABLED
        }
      }
    });
  }

  function attack (attacker, attackLocation, distance, damage) {
    const state = getState();
    const attackerState = state[attacker];
    // check if opponent is in attack location
    checkIfUnderAttack(opponentOf[attacker], attackLocation, attackerState.location, distance, damage);
    // both will need to recover after the attack
    attackInProgress[attacker] = wait(500);
    attackInProgress[attacker].then(() => setToDisabled(attacker))
      .then(() => {
        attackInProgress[attacker] = wait(1000);
        return attackInProgress[attacker];
      })
      .then(() => recoverFromAttack(attacker));
    setState(state => {
      return {
        [attacker]: {
          ...state[attacker],
          currentAction: actions.ATTACKING
        }
      };
    });

    return attackInProgress[attacker];
  }

  function startAttackSequence (name) {
    const char = getState()[name];
    // check if can attack
    if (char.currentAction !== actions.READY) return Promise.resolve();
    // calculate attack location
    let attackLocation = char.location;
    if (char.direction === directions.LEFT) {
      attackLocation--;
    } else {
      attackLocation++;
    }
    // name, name, loc, distance, damage
    attackInProgress[name] = wait(500);
    attackInProgress[name].then(() => attack(name, attackLocation, 1, 10));

    setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: actions.PREPARING_ATTACK
        }
      };
    });
    return attackInProgress[name];
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
  let loopI = 0;
  var runningLoops = new Set();
  window.running = runningLoops;
  function trexBrainLoop () {
    const loopId = loopI++;
    runningLoops.add(loopId);
    // console.trace();
    const state = getState();
    if (state.trex.location - state.kong.location <= 2) {
      if (random() > .5) {
        startAttackSequence('trex')
        .then(() => runningLoops.delete(loopId))
          .then(trexBrainLoop);
      } else {
        block('trex');
        wait(1000)
          .then(() => unblock('trex'))
          .then(() => runningLoops.delete(loopId))
          .then(trexBrainLoop);
      }
    } else {
      wait(random() * 1000)
      .then(() => move('left', 'trex'))
      .then(() => runningLoops.delete(loopId))
      .then(trexBrainLoop);
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
