const state = {}
let updated = false;

export const setState = update => {
  let newState = update;
  if (typeof update === 'function') newState = update(state);
  if (newState) {
    Object.assign(state, newState);
    updated = true;
  }
  return updated;
};
export const getState = () => {
  updated = false;
  return state;
}
export const isUpdated = () => updated;
