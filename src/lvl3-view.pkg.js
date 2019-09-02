const initLevel3View = (onKeydown, onKeyup, onClick, actions, directions) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const progressWrapper = createElement('div');
  progressWrapper.className = 'progress-wrapper';
  const [kongProgressBar, kongSpan] = createProgressBar('kong-progress', 'Kong Health');
  const [trexProgressBar, trexSpan] = createProgressBar('trex-progress', 'TRex Health');
  const root = document.getElementById('root');
  root.appendChild(canvas);
  progressWrapper.appendChild(kongProgressBar);
  progressWrapper.appendChild(trexProgressBar);
  root.appendChild(progressWrapper);

  const ape = ctx.createImageData(100, 100);
  // Iterate through every pixel
  for (let i = 0; i < ape.data.length; i += 4) {
    // Modify pixel data
    ape.data[i + 0] = 0;  // R value
    ape.data[i + 1] = 0;    // G value
    ape.data[i + 2] = 0;  // B value
    ape.data[i + 3] = 255;  // A value
  }

  const dino = ctx.createImageData(100, 100);
  // Iterate through every pixel
  for (let i = 0; i < dino.data.length; i += 4) {
    // Modify pixel data
    dino.data[i + 0] = 190;  // R value
    dino.data[i + 1] = 0;    // G value
    dino.data[i + 2] = 210;  // B value
    dino.data[i + 3] = 255;  // A value
  }

  const keydown = addEventListener(
    window,
    'keydown',
    (e) => onKeydown(e.which)
  );
  const keyup = addEventListener(
    window,
    'keyup',
    (e) => onKeyup(e.which)
  );
  const click = addEventListener(
    window,
    'click',
    (e) => onClick(e)
  );

  function renderAction (action) {
    switch (action) {
      case actions.READY:
        return 'READY';
      case actions.BLOCKING:
        return 'BLOCKING';
      case actions.ATTACKING:
        return 'ATTACKING';
      case actions.PREPARING_ATTACK:
        return 'PREPARING_ATTACK';
      case actions.DISABLED:
        return 'DISABLED';
    }
  }

  function renderMap (canvasHeight, canvasWidth, cellWidth, mapWidth,  kong, trex) {
    ctx.fillStyle = 'green';
    ctx.fillRect(kong.location * -cellWidth + 300, canvasHeight - cellWidth, canvasWidth, cellWidth);
    renderCharacter('kong', kong, cellWidth);
    renderCharacter('trex', trex, cellWidth, kong.location * -cellWidth + 300);
  }

  function renderCharacter (charName, charState, charSize, mapStart) {
    if (charName === 'trex') {
      ctx.putImageData(dino, mapStart + charState.location * charSize, canvas.height - charSize * 2);
    } else {
      ctx.putImageData(ape, 3 * charSize, canvas.height - charSize * 2);
    }
  }

  function showHealth(kong, trex) {
    // the first (actually only) child will be the span that shows progress
    kongSpan.style.width = `${kong.initialHealth - (kong.initialHealth - kong.health)}%`;
    if (kong.health < 60) {
      kongSpan.classList.add('below-60');
    }
    if (kong.health < 30) {
      kongSpan.classList.add('below-30');
    }
    trexSpan.style.width = `${trex.initialHealth - (trex.initialHealth - trex.health)}%`;
    if (trex.health < 60) {
      trexSpan.classList.add('below-60');
    }
    if (trex.health < 30) {
      trexSpan.classList.add('below-30');
    }
  }

  function render (mapData, kong, trex) {
    return new Promise((resolve, reject) => {
      try {
        // regardless of screen size, show 12 "cells" wide viewport
        const cellWidth = 100;
        canvas.height = body.clientHeight;
        canvas.width = cellWidth * mapData.width;

        renderMap(canvas.height, canvas.width, cellWidth, mapData.width, kong, trex);
        showHealth(kong, trex);

        resolve();
      } catch (e) {
        console.error(e);
        reject();
      }
    })
  }

  return {
    cleanUp: () => {
      keydown();
      keyup();
      click();
      root.removeChild(canvas);
      root.removeChild(progressWrapper);
    },
    render
  }
}