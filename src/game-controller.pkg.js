const initGameController = () => {
  let currentLevel = 0;
  if (DEBUG) currentLevel = 2;
  const { playMusic, pizzaSound, punchSound } = initMusic();

  const levelInitters = [
    (next) => initIntro('intro', next),
    (next) => playMusic() && next(),
    (next) => initLevel1(pizzaSound, next),
    (next) => initIntro('pre-lvl-2', next),
    // initLevel2,
    (next) => initIntro('pre-lvl-3', next),
    (next) => initLevel3(punchSound, next),
    () => initIntro('credits'),
  ];

  (function next () {
    rAF(() => levelInitters[currentLevel++](next));
  })();
};
