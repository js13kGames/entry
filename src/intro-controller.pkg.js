const initIntro = (nextLevel) => {
  const {
    buttonText,
    instructions,
    title
  } = initIntroModel();

  const {
    render
  } = initIntroView(500, 500, title, instructions, buttonText, nextLevel);
};
