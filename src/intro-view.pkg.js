const initIntroView = (height, width) => {
  const root = document.getElementById('root');
  // const canvas = createElement('canvas');
  // const ctx = canvas.getContext('2d');
  // root.appendChild(canvas);

  // ctx.fillStyle = 'black';
  // canvas.height = height;
  // canvas.width = width;
  // canvas.setAttribute('style', 'z-index: 0;');

  const button = createElement('button');
  const heading = createElement('h1');
  const desc = createElement('div');
  const dirH = createElement('h2');
  const dir = createElement('div');
  let listeners = [];

  const render = (buttonText, description, directions, title, onButtonClick) => {
    heading.innerHTML = title;
    root.appendChild(heading);

    desc.innerHTML = description;
    root.appendChild(desc);

    if (directions) {
      dirH.innerHTML = 'Directions';
      root.appendChild(dirH);
      dir.innerHTML = directions;
      root.appendChild(dir);
    }

    if (buttonText) {
      button.id = 'button';
      button.innerHTML = buttonText;
      button.setAttribute('style', 'position: relative;');
      listeners.push(
        addEventListener(button, 'click', onButtonClick)
      );
      root.appendChild(button);
    }
  };

  const cleanUp = () => {
    listeners.forEach(remove => remove());
    listeners = [];
    root.removeChild(heading);
    root.removeChild(desc);
    root.removeChild(button);
    if (root.contains(dirH)) {
      root.removeChild(dirH);
      root.removeChild(dir);
    }
  }

  return {
    render,
    cleanUp
  };
};
