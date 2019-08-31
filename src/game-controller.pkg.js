const initGameController = () => {
  const levelInitters = [
    // (next) => initIntro('intro', next),
    // initLevel1,
    // (next) => initIntro('pre-lvl-2', next),
    // // initLevel2,
    (next) => initIntro('pre-lvl-3', next),
    initLevel3,
    // (next) => initIntro('credits', next),
  ];

  let currentLevel = 1;
  function next () {
    // cleanUp();
    levelInitters[currentLevel++](next);
  }
  next();
};
