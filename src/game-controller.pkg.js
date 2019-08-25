const initGameController = () => {
  const levelInitters = [
    // introLevel,
    initLevel1,
    // initLevel2,
    initLevel3,
    // initCredits
  ];

  let currentLevel = 1;
  function next () {
    // cleanUp();
    levelInitters[currentLevel++](next);
  }
  next();
};
