import { Screen } from "../states/screen";
import { State } from "../states/state";

export const getCurrentScreen = (state: State): Screen => {
  return state.screens[state.screenPointer];
};
