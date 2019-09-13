const initLevel3 = async (punchSound, blockSound, nextLevel) => {
  const MAP_WIDTH = 50;
  let gameIsOver = false;
  const opponentOf = {
    trex: 'kong',
    kong: 'trex'
  };
  let winner;

  const currentWait = {};
  const wait = (name, time, onComplete) => {
    currentWait[name] = setTimeout(() => {
      currentWait[name] = null;
      onComplete();
    }, time)
  }
  function breakWait (name) {
    clearTimeout(currentWait[name]);
  }

  const loop = () => {
    const state = getSnapshot();

    render(
      MAP_WIDTH,
      state.kong,
      state.trex,
      winner
    ).then(() => isUpdated() && loop());
  };

  // init
  const {
    initialKongState,
    initialTrexState,
  } = initLevel3Model(25, 50);

  const {
    getState,
    getSnapshot,
    isUpdated,
    setState: modelSetState
  } = initState();
  const setState = (...args) => modelSetState(...args) && loop();

  const isLocationValid = (nextLocation, name, state = getState()) => {
    return nextLocation < MAP_WIDTH
      && nextLocation >= 0
      && nextLocation !== state[opponentOf[name]].location
  }

  const respondToHit = (name, cb = noop) => newState => {
    if (newState[name].currentAction == READY) cb();
    // You were hit!
    if (newState[name].currentAction == DISABLED) {
      if (newState[name].health <= 0) {
        gameIsOver = true;
        wait(name, 250, () => endGame(opponentOf[name]));
      } else {
        punchSound();
        wait(name, 750, () => recoverFromAttack(name, cb))
      }
    }
  };

  function move (desiredDirection, name, cb = noop) {
    const state = getState();
    const char = state[name];

    if (char.currentAction !== READY) return;

    setState((state) => {
      const char = state[name];
      let nextLocation = char.location;
      let newFacingDirection;
      switch (desiredDirection) {
        case 'left':
          nextLocation--;
          newFacingDirection = LEFT;
          break;
        case 'right':
          nextLocation++;
          newFacingDirection = RIGHT;
          break;
      }
      if (!isLocationValid(nextLocation, name, state)) nextLocation = char.location; // reset to current state

      return checkIfUnderAttack(name, {
        ...state,
        [name]: {
          ...char,
          direction: newFacingDirection,
          location: nextLocation
        }
      });
    }, respondToHit(name, cb));
  }

  function block (name) {
    const object = getState()[name];
    if (object.currentAction !== READY) return;
    setState(state => {
      if (state[name].currentAction == READY) {
        return {
          [name]: {
            ...state[name],
            currentAction: BLOCKING
          }
        }
      }
    });
  }

  function checkIfUnderAttack (name, state = getState()) {
    const object = state[name];
    const attackerName = opponentOf[name];
    const attackerState = state[attackerName];
    if (attackerState.currentAction !== ATTACKING) return state;
    if (object.currentAction == BLOCKING) {
      blockSound();
      return state;
    }

    const attackLocation = attackerState.location + (attackerState.direction == LEFT ? -1 : 1);
    if (object.location !== attackLocation) return state;

    // [name] is under attack
    breakWait(name);
    let newLocation;

    // TODO fix these mutations
    if (attackerState.location < object.location) {
      newLocation = object.location + 1;
    } else {
      newLocation = object.location - 1;
    }
    object.health -= 5;
    object.location = isLocationValid(newLocation, name, state) ? newLocation : object.location;
    object.currentAction = DISABLED

    return state;
  }

  function unblock (name, cb = noop) {
    setState(state => {
      return checkIfUnderAttack(name, {
        ...state,
        [name]: {
          ...state[name],
          currentAction: READY
        }
      });
    }, respondToHit(name, cb));
  }

  function recoverFromAttack (name, cb = noop) {
    setState(state => {
      return checkIfUnderAttack(name, {
        ...state,
        [name]: {
          ...state[name],
          currentAction: READY
        }
      });
    }, respondToHit(name, cb));
  }

  function setToDisabled (name, cb = noop) {
    setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: DISABLED
        }
      }
    }, cb);
  }

  function attack (attacker, cb = noop) {
    // both will need to recover after the attack
    setState(state => {
      return checkIfUnderAttack(opponentOf[attacker], {
        ...state,
        [attacker]: {
          ...state[attacker],
          currentAction: ATTACKING
        }
      });
    }, (newState) => {
      respondToHit(
        opponentOf[attacker],
        opponentOf[attacker] == 'trex' ? trexLoop : noop
      )(newState);
      wait(
        attacker,
        250,
        () => setToDisabled(
          attacker,
          () => wait(
            attacker,
            500,
            () => recoverFromAttack(attacker, cb)
          )
        )
      )
    });
  }

  function startAttackSequence (name, cb = noop) {
    const char = getState()[name];
    // check if can attack
    if (char.currentAction !== READY) return;
    setState(state => {
      return {
        [name]: {
          ...state[name],
          currentAction: PREPARING_ATTACK
        }
      };
    }, () => wait(name, 250, () => attack(name, cb)));
  }

  // Only used by kong
  function keydownHandler (key) {
    if (gameIsOver) return;
    switch (key) {
      case 37: // left
      case 65: // a
        move('left', 'kong');
        break;
      case 39: // right
      case 68: // d
        move('right', 'kong');
        break;
      case 40: // down
      case 83: // s
        block('kong');
        break;
      case 32: // space bar
        startAttackSequence('kong');
        break;
      default:
        return;
    }
  }

  // Only used by kong
  function keyupHandler (key) {
    switch (key) {
      case 40: // release down
      case 83: // release s
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

  function trexAction () {
    const state = getState();
    if (state.trex.location - state.kong.location > 1) {
      wait('trex', random() * 300 + 100, () => move(
        'left', 'trex', trexLoop)
      );
    } else if (random() < .5) {
      block('trex');
      wait('trex', 500, () => unblock('trex', trexLoop));
    } else {
      startAttackSequence('trex', trexLoop);
    }
  }

  function trexLoop () {
    if (gameIsOver) return;
    trexAction();
  };

  function endGame (char) {
    winner = char;
    wait('', 5000, () => {
      cleanUp();
      nextLevel();
    });
  }

  const images = await loadSVGs([
    'assets/kong-attack.svg',
    'assets/kong-block.svg',
    'assets/kong-disabled.svg',
    'assets/rex-attack.svg',
    'assets/rex-block.svg',
    'assets/rex-disabled.svg',
    'assets/rex-right.svg',
    'assets/background.svg'
  ]);
  if (DEBUG) window.kongRight = window.kongRight || (await loadSVGs(['assets/kong-right.svg']))[0];
  images.push(window.kongRight); // comes from level 1
  const {
    cleanUp,
    render
  } = initLevel3View(keydownHandler, keyupHandler, clickHandler, images);
  setState({
    kong: initialKongState,
    trex: initialTrexState
  });
  trexLoop();
};
