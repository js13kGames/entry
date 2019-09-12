import { h, Component } from "hyperapp";
import { State, GameState } from "../states/state";
import { Action } from "../actions/actions";
import {
  MainGameScreen,
  isMainGameScreen as _isMainGameScreen,
  GuideScreen
} from "../states/screen";

export type DisplayProps = {};

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
        return `~(˘▾˘~) (~˘▾˘)~`;
      case GameState.LOSE:
        return `(╥﹏╥)`;
      case GameState.IDDLE:
        return `o(￣ˇ￣)o`;
      default:
        return `（⌒▽⌒）`;
    }
  };

  return (
    <div>
      <h1>Level: {isMainGameScreen && (currScreen as MainGameScreen).level}</h1>
      <h2>Moves: {isMainGameScreen && remainingMove}</h2>
      <h2>Goals: {isMainGameScreen && (currScreen as MainGameScreen).goal}</h2>
      <h2>
        Status : {GameState[gameState]} {getEmoji(gameState)}
      </h2>

      <pre>Value: {displayMsg}</pre>
    </div>
  );
};

export default Display;
