const initState = () => {
  const state = {}
  let updated = false;

  const setState = update => {
    let newState = update;
    if (typeof update === 'function') newState = update(state);
    if (newState) {
      Object.assign(state, newState);
      updated = true;
    }
    return updated;
  };
  const getState = () => {
    updated = false;
    return state;
  }
  const isUpdated = () => updated;

  return {
    getState,
    isUpdated,
    setState
  }
}