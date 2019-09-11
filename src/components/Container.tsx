import { h } from "hyperapp";
import { actions, Action } from "../actions/actions";
import { ChoiceType, MainGameScreen } from "../states/screen";
import { State } from "../states/state";
import { pstyle } from "../utils/picostyle";
import { getActionToInvoke } from "../utils/actionMapping";
import Display from "./Display";
import Numpad from "./Numpad";

// const Wrapper = pstyle("div")({
//   h1: {
//     color: "blue",
//     "font-size": "20px"
//   },
//   button: {
//     color: "red"
//   }
// });

// TODO: Move to another file (modularity)

export default (state: State, actions: Action) => {
  return (
    <div oncreate={actions.initScreen}>
      {/* <h1>Level: {currLevelIdx + 1}</h1> */}
      <Display />
      {/* {(currLevel as PlayTypeLevel).choices.map(choice => {
        return (
          <button
            onclick={() => {
              const funcName = getActionToInvoke(choice.type);
              actions[funcName](...choice.params);
            }}
          >
            {choice.label}
          </button>
        );
      })} */}
      <Numpad />
      debugger:
      <pre>{JSON.stringify(state, undefined, 2)}</pre>
      {/* <button onclick={() => actions.initLevel()}>CLR</button> */}
    </div>
  );
};
