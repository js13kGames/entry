import { h, Component } from "hyperapp";
import classNames from "classnames";
import { State, GameState } from "../../states/state";
import { Action } from "../../actions/actions";
import {
  isMainGameScreen as _isMainGameScreen,
  MainGameScreen,
  ChoiceType
} from "../../states/screen";
import { getActionToInvoke } from "../../utils/actionMapping";

import * as style from "./Numpad.style";

export type NumpadProps = {};

import Button from "../Button/Button";

const Numpad: Component<NumpadProps, State, Action> = () => (
  state: State,
  action: Action
) => {
  const { screens, screenPointer, gameState } = state;
  const currScreen = screens[screenPointer];
  const isMainGameScreen = _isMainGameScreen(currScreen);
  const isCompleted = screenPointer === screens.length - 1;

  // fill remainig array buttons with empty state
  const choices = (currScreen as MainGameScreen).choices || [];
  const buttons = [...choices];
  for (let i = choices.length; i < 8; i++) {
    buttons.push({
      type: ChoiceType.EMPTY,
      params: [],
      label: ""
    });
  }

  const getExtraButton = (gameState: GameState) => {
    if (!isMainGameScreen) {
      return {
        type: ChoiceType.CONFIRM,
        params: [],
        label: "Ok"
      };
    }

    if (gameState === GameState.WIN) {
      return {
        type: ChoiceType.NEXT,
        params: [],
        label: "Ok"
      };
    }

    return {
      type: ChoiceType.CLR,
      params: [],
      label: "CLR"
    };
  };

  buttons.push(getExtraButton(gameState));

  // convert button to 2d array
  const NUM_OF_ROW = 3,
    NUM_OF_COL = 3;
  const buttonGrid = [];

  for (let i = 0; i < NUM_OF_ROW; i++) {
    const row = [];
    for (let j = 0; j < NUM_OF_COL; j++) {
      const button = buttons[NUM_OF_ROW * i + j];
      row.push(button);
    }
    buttonGrid.push(row);
  }

  return (
    <div class={style.keys}>
      {buttonGrid.map(row => (
        <div class={style.row}>
          {row.map(button => (
            <div class={style.column}>
              {button.type !== ChoiceType.EMPTY && <Button {...button} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Numpad;
