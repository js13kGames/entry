const initLevel3View = (onKeydown, onKeyup, onClick, actions, directions, images) => {
  const [canvas, ctx] = createCanvas();

  const progressWrapper = createElement('div');
  progressWrapper.className = 'progress-wrapper';
  const [kongProgressBar, kongSpan] = createProgressBar('kong-progress', 'Kong Health');
  const [trexProgressBar, trexSpan] = createProgressBar('trex-progress', 'TRex Health');
  const root = document.getElementById('root');
  root.appendChild(canvas);
  progressWrapper.appendChild(kongProgressBar);
  progressWrapper.appendChild(trexProgressBar);
  root.appendChild(progressWrapper);

  const [
    kongAttack,
    kongBlock,
    kongDisabled,
    kongRight,
    trexAttack,
    trexBlock,
    trexDisabled,
    trexRight
  ] = images

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
    let img;
    let multiplier = 1;
    if (charName === 'trex') {
      switch(charState.currentAction) {
        case actions.ATTACKING: img = trexAttack; break;
        case actions.BLOCKING: img = trexBlock; break;
        case actions.DISABLED: img = trexDisabled; break;
        case actions.READY:
        default: img = trexRight;
      }
      multiplier = -1;
      ctx.scale(-1, 1);
      ctx.translate(-img.width, 0);
      ctx.drawImage(
        img,
        multiplier * (mapStart + charState.location * charSize),
        canvas.height - charSize * 2
      );
    } else {
      switch(charState.currentAction) {
        case actions.ATTACKING: img = kongAttack; break;
        case actions.BLOCKING: img = kongBlock; break;
        case actions.DISABLED: img = kongDisabled; break;
        case actions.READY:
        default: img = kongRight;
      }
      if (charState.direction === directions.LEFT) {
        multiplier = -1;
        ctx.scale(-1, 1);
        multiplier = -1;
        ctx.translate(-img.width, 0);
      }
      ctx.drawImage(img, multiplier * (3 * charSize), canvas.height - charSize * 2);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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