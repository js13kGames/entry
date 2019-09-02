const initGameController = () => {
  let currentLevel = 4;

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
    levelInitters[currentLevel++](next);
  }
  next();
};
