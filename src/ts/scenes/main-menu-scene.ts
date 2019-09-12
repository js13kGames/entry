/// <reference path="../button.ts" />
/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../sprite.ts" />
/// <reference path="../util.ts" />

const mainMenuScene: Scene =
  new Scene(
    "MainMenu",
    () => {
      mainMenuScene._root
        ._add(new Button(
          "begin adventure",
          SCREEN_WIDTH / 2 - 100,
          SCREEN_HEIGHT / 2 + 50,
          200,
          40,
          () => {
            SceneManager._push("GameSetup");
          }));
    },
    () => {
    },
    (delta: number) => { },
    (delta: number) => {
      drawText("js13k 2019", 5, 5, { _textAlign: Align.L, _scale: 3, _colour: 0xFF3326be });
      drawText("theme: back", 5, 25, { _textAlign: Align.L, _scale: 2 });
      drawText("super", 398, 125, { _textAlign: Align.R, _scale: 7, _colour: red });
      drawText("backpacking", 402, 140, { _textAlign: Align.L, _scale: 4, _colour: 0xFF2264A4 });
      drawText("adventure", 400, 165, { _textAlign: Align.C, _scale: 3 });
      drawTexture("solid", 0, 40, 800, 1);
      drawTexture("solid", 0, 435, 800, 1);
      drawText(`(c) 2019 david brad`, 5, 440, { _textAlign: Align.L, _scale: 1 });
    }
  );
