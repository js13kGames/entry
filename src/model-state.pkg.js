const initState = () => {
  const state = {}
  let updatedSinceLastSnapshot = false;

  /**
   *
   * @param {*} update - The new state to overwrite with or an updater function
   *
   * Update will be merge with current state object Object.assign(currentState, newState);
   * Updater function should return an update to merge in as above.
   * Returning a falsey value or the original state will result in no update.
   *
   */

  const setState = (update, cb = noop) => {
    let newState = update;
    if (typeof update == 'function') newState = update(state);
    if (!newState || newState == state) {
      cb(state);
      return false;
    };
    if (newState) {
      Object.assign(state, newState);
      updatedSinceLastSnapshot = true;
    }
    cb(state);
    return true;
  };
  const getState = () => {
    return state;
  }
  const getSnapshot = () => {
    updatedSinceLastSnapshot = false;
    return state;
  }
  const isUpdated = () => updatedSinceLastSnapshot;

  window.getState = getState;

  return {
    getState,
    getSnapshot,
    isUpdated,
    setState
  }
}