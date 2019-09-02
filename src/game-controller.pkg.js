const initGameController = () => {
  let currentLevel = 0;

  const levelInitters = [
    (next) => initIntro('intro', next),
    initLevel1,
    (next) => initIntro('pre-lvl-2', next),
    // initLevel2,
    (next) => initIntro('pre-lvl-3', next),
    initLevel3,
    () => initIntro('credits'),
  ];

  function next () {
    window.requestAnimationFrame(() => levelInitters[currentLevel++](next));
  }
  next();
};
