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
  const dir = createElement('h2');
  const desc = createElement('div');
  const inst = createElement('div');
  const button = createElement('button');
  let listeners = [];

  const render = (buttonText, description, directions, title, onButtonClick) => {
    heading.innerHTML = title;
    root.appendChild(heading);

    desc.innerHTML = description;
    root.appendChild(desc);

    if (directions) {
      dir.innerHTML = 'Directions';
      root.appendChild(dir);
    }

    inst.innerHTML = directions;
    root.appendChild(inst);

    if (buttonText) {
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
    root.removeChild(inst);
    if (root.contains(dir)) root.removeChild(dir);
  }

  return {
    render,
    cleanUp
  };
};
