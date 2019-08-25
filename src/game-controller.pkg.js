const initGameController = () => {
  const levelInitters = [
    // introLevel,
    initLevel1,
    // initLevel2,
    initLevel3,
    // initCredits
  ];

  let currentLevel = 0;
  function next () {
    // cleanUp();
    levelInitters[currentLevel++](next);
  }
  next();
};
