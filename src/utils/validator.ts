import { State } from "../states/state";
import { MainGameScreen } from "../states/screen";

export const isAchieveGoal = (state: State): boolean => {
  const { screens, screenPointer } = state;
  const currLevel = screens[screenPointer];
  return state.displayMsg == (currLevel as MainGameScreen).goal;
};
