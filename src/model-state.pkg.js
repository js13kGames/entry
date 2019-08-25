const initState = () => {
  const state = {}
  let updated = false;

  /**
   *
   * @param {*} update - The new state to overwrite with or an updater function
   *
   * Update will be merge with current state object Object.assign(currentState, newState);
   * Updater function should return an update to merge in as above.
   * Returning a falsey value or the original state will result in no update.
   *
   */

  const setState = update => {
    let newState = update;
    if (typeof update === 'function') newState = update(state);
    if (!newState || newState === state) return false;
    if (newState) {
      Object.assign(state, newState);
      updated = true;
    }
    return true;
  };
  const getState = () => {
    updated = false;
    return state;
  }
  const isUpdated = () => updated;

  window.getState = getState;

  return {
    getState,
    isUpdated,
    setState
  }
}