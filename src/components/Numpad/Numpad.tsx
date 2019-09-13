import { h, Component } from "hyperapp";
import classNames from "classnames";
import { State, GameState } from "../../states/state";
import { Action } from "../../actions/actions";
import {
  isMainGameScreen,
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
  const _isMainGameScreen = isMainGameScreen(currScreen);
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
  buttons.push({
    type: ChoiceType.CONFIRM,
    params: [],
    label: "Ok"
  });

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

  // return (
  //   <div>
  //     {_isMainGameScreen &&
  //       (currScreen as MainGameScreen).choices.map(choice => {
  //         const fnName = getActionToInvoke(choice.type);
  //         return (
  //           <button onclick={() => action[fnName](...choice.params)}>
  //             {choice.label}
  //           </button>
  //         );
  //       })}
  //     {!isCompleted &&
  //       _isMainGameScreen &&
  //       (gameState === GameState.PLAYING || gameState === GameState.LOSE) && (
  //         <button onclick={() => action.restartOperator()}>CLR</button>
  //       )}
  //     {!isCompleted && _isMainGameScreen && gameState === GameState.WIN && (
  //       <button onclick={() => action.loadNextScreen()}>OK</button>
  //     )}
  //     {!isCompleted && !_isMainGameScreen && (
  //       <button
  //         onclick={() => {
  //           action.confirmOperator();
  //         }}
  //       >
  //         OK
  //       </button>
  //     )}
  //   </div>
  // );
  // console.log("buttongrid");
  // console.log(buttonGrid);
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
