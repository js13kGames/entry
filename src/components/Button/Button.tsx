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

import * as style from "./Button.style";

export type ButtonProps = {
  type: ChoiceType;
  label: string;
  params?: any;
};

const Button: Component<ButtonProps, State, Action> = ({
  type,
  params,
  label
}) => (state: State, action: Action) => {
  const buttonStyle = classNames({
    [style.button]: true,
    [style.buttonPlus]: [
      ChoiceType.ADDITION,
      ChoiceType.MULTIPLY,
      ChoiceType.DIVISION
    ].includes(type),
    [style.buttonClear]: type === ChoiceType.CLR,
    [style.buttonOk]: [ChoiceType.CONFIRM, ChoiceType.NEXT].includes(type),
    [style.buttonShift]: [ChoiceType.DELETE].includes(type)
  });

  const fnName = getActionToInvoke(type);

  return (
    <button
      class={buttonStyle}
      onclick={() => {
        console.log("test clicked");
        action[fnName](...params);
      }}
    >
      {label}
    </button>
  );
};

export default Button;
