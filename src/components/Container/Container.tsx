import { h } from "hyperapp";

import { actions, Action } from "../../actions/actions";
import { ChoiceType, MainGameScreen } from "../../states/screen";
import { State } from "../../states/state";

import Display from "../Display/Display";
import Numpad from "../Numpad/Numpad";

// Styling
import * as style from './Container.style';

export default (state: State, actions: Action) => {
  return (
    <div class={style.container} oncreate={actions.initScreen}>
      <div class={style.wrapper}>
        <h1>test </h1>
        <Display />
        <Numpad />
      </div>
    </div>
  );
};
