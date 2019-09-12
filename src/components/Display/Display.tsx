import { h, Component } from "hyperapp";
import classNames from "classnames";
import { State, GameState } from "../../states/state";
import { Action } from "../../actions/actions";
import {
  MainGameScreen,
  isMainGameScreen as _isMainGameScreen,
  GuideScreen
} from "../../states/screen";

export type DisplayProps = {};

import * as style from './Display.style';

const Display: Component<DisplayProps, State, Action> = () => (
  state: State,
  action: Action
) => {
  const {
    screens,
    screenPointer,

    remainingMove,
    displayMsg,
    gameState
  } = state;
  const currScreen = screens[screenPointer];
  const isMainGameScreen = _isMainGameScreen(currScreen);

  const getEmoji = (gameState: GameState): string => {
    switch (gameState) {
      case GameState.WIN:
        return `~(˘▾˘~)`;
      case GameState.LOSE:
        return `(╥﹏╥)`;
      case GameState.IDDLE:
        return `o(￣ˇ￣)o`;
      default:
        return `（⌒▽⌒）`;
    }
  };

  // return (
  //   <div>
  //     <h1>Level: {isMainGameScreen && (currScreen as MainGameScreen).level}</h1>
  //     <h2>Moves: {isMainGameScreen && remainingMove}</h2>
  //     <h2>Goals: {isMainGameScreen && (currScreen as MainGameScreen).goal}</h2>
  //     <h2>
  //       Status : {GameState[gameState]} {}
  //     </h2>

  //     <pre>Value: {displayMsg}</pre>
  //   </div>
  // );
  return (
    <div class={style.display}>
      <div class={style.displayWrapper}>
        <div class={style.displayHeader}>
          <div class={style.displayLevel}>Level : {(currScreen as MainGameScreen).level}</div>
          <div class={style.displaySolarPanel}>
            <div class={style.displaySolarPanelElement}></div>
            <div class={style.displaySolarPanelElement}></div>
            <div class={style.displaySolarPanelElement}></div>
          </div>
        </div>
        <div class={style.displayBody}>
          <div class={style.displayBodyTitle}>
            <div class={classNames(style.displayBodyTitleElement, style.displayBodyTitleElementEmoji)}>
              {getEmoji(gameState)}
            </div>
            <div class={classNames(style.displayBodyTitleElement, style.displayBodyTitleElementCounter)}>
              MOVES: 4
            </div>
            <div class={classNames(style.displayBodyTitleElement, style.displayBodyTitleElementCounter)}>
              GOALS: 200
            </div>
          </div>
          <div class={style.displayBodyContent}>
            <div class={style.displayBodyContentBackground}>888888</div>
            <div class={classNames({[style.displayBodyContentMain]: true, [style.fontSizeNormal]: isMainGameScreen, [style.fontSizeMini]: !isMainGameScreen})}>
              the quick brown fox jumps over the lazy dog. 01234567890
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;
