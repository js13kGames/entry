import { screens, Screen } from "./screen";

export enum GameState {
  IDDLE,
  PLAYING,
  WIN,
  LOSE
}

export interface State {
  // to avoid complexity of merging, we keep everything flat
  screenPointer: number;
  guideMsgPointer: number;
  remainingMove: number;
  displayMsg: string;
  isAcceptInput: boolean;
  gameState: GameState;

  //actual loading data :
  screens: Array<Screen>;
}

export const state: State = {
  screens: screens,
  screenPointer: 0,
  guideMsgPointer: 0,
  remainingMove: 0,
  displayMsg: "",
  isAcceptInput: true,
  gameState: GameState.IDDLE
};
