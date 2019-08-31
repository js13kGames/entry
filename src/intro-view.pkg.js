const initIntroView = (height, width) => {
  const root = document.getElementById('root');
  // const canvas = createElement('canvas');
  // const ctx = canvas.getContext('2d');
  // root.appendChild(canvas);

  // ctx.fillStyle = 'black';
  // canvas.height = height;
  // canvas.width = width;
  // canvas.setAttribute('style', 'z-index: 0;');

  const heading = createElement('h1');
  const p = createElement('p');
  const nextButton = createElement('button');
  let listeners = [];

  const render = (title, instructions, buttonText, onNextButtonClick) => {
    heading.innerHTML = title;
    root.appendChild(heading);

    p.innerHTML = instructions;
    root.appendChild(p);

    nextButton.innerHTML = buttonText;
    nextButton.setAttribute('style', 'position: relative;');
    listeners.push(
      addEventListener(nextButton, 'click', onNextButtonClick)
    )
    root.appendChild(nextButton);
  };

  const cleanUp = () => {
    listeners.forEach(remove => remove());
    listeners = [];
    root.removeChild(heading);
    root.removeChild(p);
    root.removeChild(nextButton);
  }

  return {
    render,
    cleanUp
  };
};
