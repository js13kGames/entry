/// <reference path="../button.ts" />
/// <reference path="../consts.ts" />
/// <reference path="../scene.ts" />
/// <reference path="../sprite.ts" />
/// <reference path="../util.ts" />

const gameOverScene: Scene =
  new Scene(
    "GameOver",
    () => {
      gameOverScene._root
        ._add(new Button(
          "adventure again",
          SCREEN_WIDTH / 2 - 100,
          SCREEN_HEIGHT / 2 + 100,
          200,
          40,
          () => {
            SceneManager._pop();
          }));
    },
    () => {
    },
    (delta: number) => { },
    (delta: number) => {
      drawText("your adventure comes to an end", SCREEN_WIDTH / 2, 165, { _textAlign: Align.C, _scale: 2 });
      drawText("but it's really about the journey, isn't it?", SCREEN_WIDTH / 2, 181, { _textAlign: Align.C, _scale: 2 });
    }
  );
