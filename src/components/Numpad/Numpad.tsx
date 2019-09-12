import { h, Component } from "hyperapp";
import { State, GameState } from "../../states/state";
import { Action } from "../../actions/actions";
import { isMainGameScreen, MainGameScreen } from "../../states/screen";
import { getActionToInvoke } from "../../utils/actionMapping";

export type NumpadProps = {};

const Numpad: Component<NumpadProps, State, Action> = () => (
  state: State,
  action: Action
) => {
  const { screens, screenPointer, gameState } = state;
  const currScreen = screens[screenPointer];
  const _isMainGameScreen = isMainGameScreen(currScreen);
  const isCompleted = screenPointer === screens.length - 1;
  return (
    <div>
      {_isMainGameScreen &&
        (currScreen as MainGameScreen).choices.map(choice => {
          const fnName = getActionToInvoke(choice.type);
          return (
            <button onclick={() => action[fnName](...choice.params)}>
              {choice.label}
            </button>
          );
        })}
      {!isCompleted &&
        _isMainGameScreen &&
        (gameState === GameState.PLAYING || gameState === GameState.LOSE) && (
          <button onclick={() => action.restartOperator()}>CLR</button>
        )}
      {!isCompleted && _isMainGameScreen && gameState === GameState.WIN && (
        <button onclick={() => action.loadNextScreen()}>OK</button>
      )}
      {!isCompleted && !_isMainGameScreen && (
        <button
          onclick={() => {
            action.confirmOperator();
          }}
        >
          OK
        </button>
      )}
    </div>
  );
};

export default Numpad;
