import { ActionsType, ActionResult, ActionType } from "hyperapp";
import { State, GameState } from "../states/state";
import { MainGameScreen, ScreenType, GuideScreen } from "../states/screen";

export type HyperAppAction = (
  state: State,
  actionn?: Action
) => ActionResult<State>;
export type GameAction = (...args: any[]) => HyperAppAction;

export interface Action {
  restartOperator: ActionType<any, State, Action>;
  addOperator: ActionType<any, State, Action>;
  loadNextScreen: ActionType<any, State, Action>;
  initScreen: ActionType<any, State, Action>;
  loadScreen: GameAction;
  confirmOperator: GameAction;
  multiplyOperator: GameAction;
  divisionOperator: GameAction;
  deleteOperator: GameAction;
  appendOperator: GameAction;
}

export const actions: ActionsType<State, Action> = {
  restartOperator: () => (state: State) => {
    const currLevel = <MainGameScreen>state.screens[state.screenPointer];
    return {
      gameState: GameState.PLAYING,
      displayMsg: currLevel.initialValue,
      remainingMove: currLevel.steps
    };
  },
  initScreen: () => (state: State) => {
    const currScreen = state.screens[state.screenPointer];
    const screenType = currScreen.screenType;
    if (screenType === ScreenType.GUIDE) {
      return {
        guideMsgPointer: 0,
        displayMsg: (currScreen as GuideScreen).messages[0]
      };
    }
  },
  loadScreen: (screenNum: number) => (state: State) => {
    const nextScreenPointer = screenNum;
    const nextScreen = state.screens[nextScreenPointer];
    const nextScreenType = nextScreen.screenType;

    if (nextScreenType === ScreenType.GUIDE) {
      return {
        screenPointer: nextScreenPointer,
        guideMsgPointer: 0,
        displayMsg: (nextScreen as GuideScreen).messages[0],
        gameState: GameState.IDDLE
      };
    }

    return {
      screenPointer: nextScreenPointer,
      gameState: GameState.PLAYING,
      displayMsg: (nextScreen as MainGameScreen).initialValue,
      remainingMove: (nextScreen as MainGameScreen).steps
    };
  },
  confirmOperator: () => (state: State, action: Action) => {
    const nextGuideMsgPointer = state.guideMsgPointer + 1;
    const currScreen = state.screens[state.screenPointer];
    const messages = (currScreen as GuideScreen).messages;
    // check if all message is already read
    if (nextGuideMsgPointer === messages.length) {
      const nextScreenPointer = state.screenPointer + 1;
      const nextScreen = state.screens[nextScreenPointer];
      return {
        screenPointer: state.screenPointer + 1,
        displayMsg: (nextScreen as MainGameScreen).initialValue,
        remainingMove: (nextScreen as MainGameScreen).steps,
        guideMsgPointer: 0,
        gameState: GameState.PLAYING
      };
    }

    return {
      guideMsgPointer: nextGuideMsgPointer,
      displayMsg: messages[nextGuideMsgPointer]
    };
  },
  loadNextScreen: () => (state: State) => {
    const nextScreenPointer = state.screenPointer + 1;
    const nextScreen = state.screens[nextScreenPointer];
    const nextScreenType = nextScreen.screenType;

    if (nextScreenType === ScreenType.GUIDE) {
      return {
        screenPointer: nextScreenPointer,
        guideMsgPointer: 0,
        displayMsg: (nextScreen as GuideScreen).messages[0],
        gameState: GameState.IDDLE
      };
    }

    return {
      screenPointer: nextScreenPointer,
      gameState: GameState.PLAYING,
      displayMsg: (nextScreen as MainGameScreen).initialValue,
      remainingMove: (nextScreen as MainGameScreen).steps
    };
  },
  addOperator: (operand: number) => (state: State) => {
    // if (state.isAcceptInput) {
    if (state.gameState === GameState.PLAYING) {
      let nextValue = (parseInt(state.displayMsg) + operand).toString();
      const currScreen = state.screens[state.screenPointer];

      // decrement steps
      const nextRemainingMove = state.remainingMove - 1;
      // const nextAcceptInput = nextRemainingMove > 0;

      // Evaluate if meet win condition
      if (nextValue === (currScreen as MainGameScreen).goal) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.WIN
        };
      }

      if (!nextRemainingMove) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.LOSE
        };
      }

      return {
        displayMsg: nextValue,
        remainingMove: nextRemainingMove
      };
    }
  },
  multiplyOperator: (operand: number) => (state: State) => {
    if (state.gameState === GameState.PLAYING) {
      let nextValue = (parseInt(state.displayMsg) * operand).toString();
      const currScreen = state.screens[state.screenPointer];

      // decrement steps
      const nextRemainingMove = state.remainingMove - 1;
      // const nextAcceptInput = nextRemainingMove > 0;

      // Evaluate if meet win condition
      if (nextValue === (currScreen as MainGameScreen).goal) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.WIN
        };
      }

      if (!nextRemainingMove) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.LOSE
        };
      }

      return {
        displayMsg: nextValue,
        remainingMove: nextRemainingMove
      };
    }
  },
  divisionOperator: (operand: number) => (state: State) => {
    if (state.gameState === GameState.PLAYING) {
      let nextValue = (parseInt(state.displayMsg) / operand).toString();
      const currScreen = state.screens[state.screenPointer];

      // decrement steps
      const nextRemainingMove = state.remainingMove - 1;
      // const nextAcceptInput = nextRemainingMove > 0;

      // Evaluate if meet win condition
      if (nextValue === (currScreen as MainGameScreen).goal) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.WIN
        };
      }

      if (!nextRemainingMove) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.LOSE
        };
      }

      return {
        displayMsg: nextValue,
        remainingMove: nextRemainingMove
      };
    }
  },
  deleteOperator: () => (state: State) => {
    if (state.gameState === GameState.PLAYING) {
      const currDisplayMsg = state.displayMsg;
      let _nextValue = currDisplayMsg.substring(0, currDisplayMsg.length - 1);
      const nextValue = _nextValue === "" ? "0" : _nextValue;
      const currScreen = state.screens[state.screenPointer];

      // decrement steps
      const nextRemainingMove = state.remainingMove - 1;
      // const nextAcceptInput = nextRemainingMove > 0;

      // Evaluate if meet win condition
      if (nextValue === (currScreen as MainGameScreen).goal) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.WIN
        };
      }

      if (!nextRemainingMove) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.LOSE
        };
      }

      return {
        displayMsg: nextValue,
        remainingMove: nextRemainingMove
      };
    }
  },
  appendOperator: (num: number) => (state: State) => {
    if (state.gameState === GameState.PLAYING) {
      const currDisplayMsg = state.displayMsg;
      let nextValue = `${currDisplayMsg}${num}`;
      const currScreen = state.screens[state.screenPointer];

      // decrement steps
      const nextRemainingMove = state.remainingMove - 1;
      // const nextAcceptInput = nextRemainingMove > 0;

      // Evaluate if meet win condition
      if (nextValue === (currScreen as MainGameScreen).goal) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.WIN
        };
      }

      if (!nextRemainingMove) {
        return {
          displayMsg: nextValue,
          remainingMove: nextRemainingMove,
          gameState: GameState.LOSE
        };
      }

      return {
        displayMsg: nextValue,
        remainingMove: nextRemainingMove
      };
    }
  }
};
