import { h } from "hyperapp";

import { actions, Action } from "../../actions/actions";
import { ChoiceType, MainGameScreen } from "../../states/screen";
import { State } from "../../states/state";

import Display from "../Display/Display";
import Numpad from "../Numpad/Numpad";

// Styling
import * as style from "./Container.style";
// import * as style from './Container.linaria.style';

export default (state: State, actions: Action) => {
  return (
    <div class={style.container} oncreate={() => actions.loadScreen(1)}>
      <div class={style.wrapper}>
        <Display />
        <Numpad />
      </div>
    </div>
  );
};
