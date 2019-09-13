export enum ChoiceType {
  ADDITION,
  CLR,
  CONFIRM,
  MULTIPLY,
  DIVISION,
  DELETE,
  EMPTY,
  NEXT,
  APPEND
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
      "hi !\nmy name is numbie",
      "this is just a simple math.",
      "you must achieve the goal before running out of steps",
      "pro tips : do backward thinking !"
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
      }
    ]
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
    screenType: ScreenType.GUIDE,
    messages: ["seems easy huh ?", "let's move to another level !\n can you ?"]
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
    goal: "77",
    steps: 2,
    initialValue: "0",
    choices: [
      {
        type: ChoiceType.ADDITION,
        params: [7],
        label: "+7"
      },
      {
        type: ChoiceType.MULTIPLY,
        params: [11],
        label: "x11"
      }
    ]
  },
  {
    level: 5,
    screenType: ScreenType.PLAY,
    goal: "75",
    steps: 3,
    initialValue: "10",
    choices: [
      {
        type: ChoiceType.MULTIPLY,
        params: [3],
        label: "x3"
      },
      {
        type: ChoiceType.ADDITION,
        params: [-5],
        label: "-5"
      }
    ]
  },
  {
    screenType: ScreenType.GUIDE,
    messages: [
      "now i want to introduce you to new button.",
      "this button remove last number"
    ]
  },
  {
    level: 7,
    screenType: ScreenType.PLAY,
    goal: "12",
    steps: 3,
    initialValue: "12345",
    choices: [
      {
        type: ChoiceType.DELETE,
        params: [],
        label: "<<"
      }
    ]
  },
  {
    screenType: ScreenType.GUIDE,
    messages: ["still easy right? ."]
  },
  {
    level: 8,
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
    level: 7,
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
    messages: [
      "what if i add more button ?",
      "this button append a number in the end of your number"
    ]
  },
  {
    level: 7,
    screenType: ScreenType.PLAY,
    goal: "45",
    steps: 1,
    initialValue: "4",
    choices: [
      {
        type: ChoiceType.APPEND,
        params: [5],
        label: "5"
      }
    ]
  },
  {
    screenType: ScreenType.GUIDE,
    messages: ["you've completed all the callenge !",
    "im running out of time, i havent write problem set for following levels :(",
    "but i hope it explains the whole mechanic"
    ]
  }
];
