import { h, Component } from "hyperapp";
import classNames from 'classnames';
import { State, GameState } from "../../states/state";
import { Action } from "../../actions/actions";
import { isMainGameScreen, MainGameScreen } from "../../states/screen";
import { getActionToInvoke } from "../../utils/actionMapping";

import * as style from "./Numpad.style";

export type NumpadProps = {};

const Numpad: Component<NumpadProps, State, Action> = () => (
  state: State,
  action: Action
) => {
  const { screens, screenPointer, gameState } = state;
  const currScreen = screens[screenPointer];
  const _isMainGameScreen = isMainGameScreen(currScreen);
  const isCompleted = screenPointer === screens.length - 1;
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

  return (
    <div class={style.keys}>
      <div class={style.row}>
        <div class={style.column}>
          <button
            class={classNames(style.button, style.buttonPlus)}
            onClick='console.log("test")'
          >
            +1
          </button>
        </div>
        <div class={style.column}>
          <button class={classNames(style.button, style.buttonClear)}>Clr</button>
        </div>
        <div class={style.column}>
          <button class={classNames(style.button, style.buttonAppend)}>1</button>
        </div>
      </div>
      <div class={style.row}>
        <div class={style.column}>
          <button class={classNames(style.button, style.buttonConvert)}>23 &#61;&gt; 45</button>
        </div>
        <div class={style.column}>
          <button class={classNames(style.button, style.buttonShift)}>&lt; &lt;</button>
        </div>
        <div class={style.column}></div>
      </div>
      <div class={style.row}>
        <div class={style.column}>
          <button class={classNames(style.button, style.buttonHelp)}>?</button>
        </div>
        <div class={style.column}>
          <button class={classNames(style.button, style.buttonOk)}>Ok</button>
        </div>
        <div class={style.column}>
          <button class={classNames(style.button)}>+1</button>
        </div>
      </div>
    </div>
  );
};

export default Numpad;
