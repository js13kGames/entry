/// <reference path="./consts.ts" />
/// <reference path="./gl.ts" />
/// <reference path="./assets.ts" />
/// <reference path="./draw.ts" />
/// <reference path="./mouse.ts" />
/// <reference path="./stats.ts" />
/// <reference path="./util.ts" />
/// <reference path="./scene.ts" />
/// <reference path="./scenes/main-menu-scene.ts" />
/// <reference path="./scenes/game-setup-scene.ts" />
/// <reference path="./scenes/game-scene.ts" />
/// <reference path="./scenes/game-over-scene.ts" />

window.addEventListener("load", async (): Promise<any> => {
  let then: number = 0;
  function tick(now: number): void {
    const delta: number = now - then;
    then = now;

    SceneManager._update(delta, now);

    gl._cls();
    SceneManager._draw(delta, now);

    // @ifdef DEBUG
    _tickFps(delta, now);
    // @endif

    // if we lose mouse focus, put up an overlay
    if (mouse._inputDisabled) {
      gl._col(0xAA222222);
      drawTexture("solid", 0, 0, SCREEN_WIDTH + 1, SCREEN_HEIGHT + 1);
      gl._col(white);
      drawText("click to focus game", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, { _textAlign: Align.C, _scale: 4 });
    }

    gl._flush();
    gl._col(white);
    requestAnimationFrame(tick);
  }

  const stage: HTMLDivElement = document.querySelector("#stage");
  const canvas: HTMLCanvasElement = document.querySelector("canvas");

  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  window.addEventListener(
    "resize",
    (): void => {
      const scaleX: number = window.innerWidth / canvas.width;
      const scaleY: number = window.innerHeight / canvas.height;
      let scaleToFit: number = ~~(Math.min(scaleX, scaleY) / .25) * .25;
      scaleToFit = scaleToFit < 1 ? 1 : scaleToFit;
      const size: number[] = [canvas.width * scaleToFit, canvas.height * scaleToFit];
      const offset: number[] = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];
      const rule: string = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scaleToFit + ")";
      stage.style.transform = rule;
      stage.style.webkitTransform = rule;
    }
  );

  // @ifdef DEBUG
  _initFps();
  // @endif

  gl._init(canvas);
  gl._bkg(47 / 255, 72 / 255, 78 / 255);
  await load("sheet.json");
  mouse._initialize(canvas);
  SceneManager._register(mainMenuScene);
  SceneManager._register(gameSetupScene);
  SceneManager._register(gameScene);
  SceneManager._register(gameOverScene);
  SceneManager._push(mainMenuScene._name);

  requestAnimationFrame(tick);
  window.dispatchEvent(new Event("resize"));
});
