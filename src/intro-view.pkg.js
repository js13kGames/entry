const initIntroView = (height, width, title, instructions, buttonText, nextLevel) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const root = document.getElementById('root');
  root.appendChild(canvas);

  ctx.fillStyle = 'black';
  canvas.height = height;
  canvas.width = width;
  canvas.setAttribute('style', 'z-index: 0;');

  const heading = document.createElement('h1');
  heading.innerHTML = title;
  root.appendChild(heading);

  const p = document.createElement('p');
  p.innerHTML = instructions;
  root.appendChild(p);

  const nextButton = document.createElement('button');
  nextButton.innerHTML = buttonText;
  nextButton.setAttribute('style', 'position: relative;');
  nextButton.addEventListener('click', nextLevel);
  root.appendChild(nextButton);

  const render = () => {
    return canvas;
  };

  return {
    render
  };
};
