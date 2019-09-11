const initIntroView = (height, width) => {
  const root = document.getElementById('root');

  const button = document.createElement('button');
  const heading = document.createElement('h1');
  const desc = document.createElement('div');
  const dirH = document.createElement('h2');
  const dir = document.createElement('div');
  let listeners = [];
  const page = createElement('div')
  page.classList.add('page');

  const render = (buttonText, description, directions, title, onButtonClick) => {
    heading.innerHTML = title;
    page.appendChild(heading);

    desc.innerHTML = description;
    page.appendChild(desc);

    if (directions) {
      dirH.innerHTML = 'Directions';
      page.appendChild(dirH);
      dir.innerHTML = directions;
      page.appendChild(dir);
    }

    if (buttonText) {
      button.id = 'button';
      button.innerHTML = buttonText;
      button.setAttribute('style', 'position: relative;');
      listeners.push(
        addEventListener(button, 'click', onButtonClick)
      );
      page.appendChild(button);
    }

    root.appendChild(page);
  };

  const cleanUp = () => {
    listeners.forEach(remove => remove());
    listeners = [];
    root.removeChild(page);
  }

  return {
    render,
    cleanUp
  };
};
