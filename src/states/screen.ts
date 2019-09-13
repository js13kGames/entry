export enum ChoiceType {
  ADDITION,
  CLR,
  CONFIRM,
  MULTIPLY,
  DIVISION,
  DELETE,
  EMPTY,
  NEXT
}

export interface Choice {
  type: ChoiceType;
  params: Array<number | string>;
  label: string;
}

export enum ScreenType {
  GUIDE,
  PLAY
}

export type MainGameScreen = {
  screenType: ScreenType.PLAY;
  level: number;
  goal: string;
  steps: number;
  initialValue: string;
  choices: Array<Choice>;
};

export type GuideScreen = {
  screenType: ScreenType.GUIDE;
  messages: Array<string>;
};

export type Screen = MainGameScreen | GuideScreen;

export const isGuideScreen = (level: Screen): level is GuideScreen => {
  return level.screenType === ScreenType.GUIDE;
};

export const isMainGameScreen = (level: Screen): level is MainGameScreen => {
  return level.screenType === ScreenType.PLAY;
};

export const screens: Array<Screen> = [
  {
    screenType: ScreenType.GUIDE,
    messages: [
      "are you ready ?",
      "tt is just a simple math",
      "you only need to think from the back to the start"
    ]
  },
  {
    level: 1,
    screenType: ScreenType.PLAY,
    goal: "2",
    steps: 2,
    initialValue: "0",
    choices: [
      {
        type: ChoiceType.ADDITION,
        params: [1],
        label: "+1"
      },
      {
        type: ChoiceType.ADDITION,
        params: [-1],
        label: "-1(debug)"
      }
    ]
  },
  {
    screenType: ScreenType.GUIDE,
    messages: ["seems easy huh ?", "let's move to another level !\n can you ?"]
  },
  {
    level: 2,
    screenType: ScreenType.PLAY,
    goal: "8",
    steps: 3,
    initialValue: "0",
    choices: [
      {
        type: ChoiceType.ADDITION,
        params: [3],
        label: "+3"
      },
      {
        type: ChoiceType.ADDITION,
        params: [2],
        label: "+2"
      }
    ]
  },
  {
    level: 3,
    screenType: ScreenType.PLAY,
    goal: "9",
    steps: 3,
    initialValue: "-1",
    choices: [
      {
        type: ChoiceType.ADDITION,
        params: [1],
        label: "+1"
      },
      {
        type: ChoiceType.ADDITION,
        params: [3],
        label: "+3"
      },
      {
        type: ChoiceType.MULTIPLY,
        params: [3],
        label: "x3"
      }
    ]
  },
  {
    level: 4,
    screenType: ScreenType.PLAY,
    goal: "4",
    steps: 3,
    initialValue: "3",
    choices: [
      {
        type: ChoiceType.ADDITION,
        params: [4],
        label: "+4"
      },
      {
        type: ChoiceType.MULTIPLY,
        params: [4],
        label: "x4"
      },
      {
        type: ChoiceType.DIVISION,
        params: [4],
        label: "/4"
      }
    ]
  },
  {
    level: 5,
    screenType: ScreenType.PLAY,
    goal: "4",
    steps: 3,
    initialValue: "0",
    choices: [
      {
        type: ChoiceType.ADDITION,
        params: [8],
        label: "+8"
      },
      {
        type: ChoiceType.MULTIPLY,
        params: [5],
        label: "x5"
      },
      {
        type: ChoiceType.DELETE,
        params: [],
        label: "<<"
      }
    ]
  },
  {
    screenType: ScreenType.GUIDE,
    messages: ["you've completed all the callenge !"]
  }
];
