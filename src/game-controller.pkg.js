const initGameController = () => {
  let currentLevel = 0;
  if (DEBUG) currentLevel = 4;
  const { playMusic, pizzaSound, punchSound, blockSound } = initMusic();

  const levelInitters = [
    (next) => initIntro('intro', next),
    (next) => playMusic() && next(),
    (next) => initLevel1(pizzaSound, next),
    (next) => initIntro('pre-lvl-3', next),
    (next) => initLevel3(punchSound, blockSound, next),
    () => initIntro('credits'),
  ];

  (function next () {
    rAF(() => levelInitters[currentLevel++](next));
  })();
};
