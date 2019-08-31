const initIntro = (level, nextLevel) => {
  const {
    buttonText,
    instructions,
    title
  } = initIntroModel(level);

  const {
    render,
    cleanUp
  } = initIntroView();

  render(
    title,
    instructions,
    buttonText,
    () => {
      cleanUp();
      nextLevel();
    }
  );
};
