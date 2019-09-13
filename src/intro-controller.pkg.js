const initIntro = (level, nextLevel) => {
  const {
    buttonText,
    description,
    directions,
    title
  } = initIntroModel(level);

  const {
    render,
    cleanUp
  } = initIntroView();

  render(
    buttonText,
    description,
    directions,
    title,
    () => {
      cleanUp();
      nextLevel();
    }
  );
};
