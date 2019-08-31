const initIntro = (nextLevel) => {
  const {
    buttonText,
    instructions,
    title
  } = initIntroModel();

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
