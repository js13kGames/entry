const initLevel3View = (onKeydown, onKeyup, onClick, images) => {
  const [canvas, ctx] = createCanvas();

  const progressWrapper = createElement('div');
  progressWrapper.className = 'progress-wrapper';
  const [kongProgressBar, kongSpan] = createProgressBar('Kong Health');
  const [trexProgressBar, trexSpan] = createProgressBar('TRex Health');
  const root = document.getElementById('root');
  root.appendChild(canvas);
  progressWrapper.appendChild(kongProgressBar);
  progressWrapper.appendChild(trexProgressBar);
  root.appendChild(progressWrapper);
  const winWindow = createElement('div');

  const [
    kongAttack,
    kongBlock,
    kongDisabled,
    trexAttack,
    trexBlock,
    trexDisabled,
    trexRight,
    background,
    kongRight
  ] = images

  const cleanupListeners = []
  cleanupListeners.push(addEventListener(
    window,
    'keydown',
    (e) => onKeydown(e.which)
  ));
  cleanupListeners.push(addEventListener(
    window,
    'keyup',
    (e) => onKeyup(e.which)
  ));
  cleanupListeners.push(addEventListener(
    window,
    'click',
    (e) => onClick(e)
  ));

  function renderMap (canvasHeight, canvasWidth, cellWidth, kong, trex) {
    ctx.fillStyle = 'green';
    ctx.fillRect(kong.location * -cellWidth + 300, canvasHeight - 110, canvasWidth, 110);
    renderBackground(kong.location);
    renderCharacter('kong', kong, cellWidth);
    renderCharacter('trex', trex, cellWidth, kong.location * -cellWidth + 300);
  }

  function renderBackground (kongLocation) {
    const bgHeight = background.height / background.width * body.clientWidth
    ctx.drawImage(background, (50 - kongLocation) * 50 - 1500, body.clientHeight - 110 - bgHeight, body.clientWidth, bgHeight);
  }
  function renderCharacter (charName, charState, charSize, mapStart) {
    let img;
    let multiplier = 1;
    if (charName == 'trex') {
      switch(charState.currentAction) {
        case ATTACKING: img = trexAttack; break;
        case BLOCKING: img = trexBlock; break;
        case DISABLED: img = trexDisabled; break;
        case READY:
        default: img = trexRight;
      }
      multiplier = -1;
      ctx.scale(-1, 1);
      ctx.translate(-img.width, 0);
      ctx.drawImage(
        img,
        multiplier * (mapStart + charState.location * charSize - img.width + charSize),
        canvas.height - charSize * 2
      );
    } else {
      switch(charState.currentAction) {
        case ATTACKING: img = kongAttack; break;
        case BLOCKING: img = kongBlock; break;
        case DISABLED: img = kongDisabled; break;
        case READY:
        default: img = kongRight;
      }
      if (charState.direction == LEFT) {
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
    kongSpan.style.width = kong.health + '%';
    if (kong.health < 60) {
      kongSpan.classList.add('below-60');
    }
    if (kong.health < 30) {
      kongSpan.classList.add('below-30');
    }
    trexSpan.style.width = trex.health + '%';
    if (trex.health < 60) {
      trexSpan.classList.add('below-60');
    }
    if (trex.health < 30) {
      trexSpan.classList.add('below-30');
    }
  }

  function render (mapWidth, kong, trex, winner) {
    return new Promise((resolve) => {
      if (winner) {
        renderWinner(winner);
        return;
      }
      const cellWidth = 100;
      canvas.height = body.clientHeight;
      canvas.width = cellWidth * mapWidth;
      ctx.fillStyle = '#7E8390';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      renderMap(canvas.height, canvas.width, cellWidth, kong, trex);
      showHealth(kong, trex);

      resolve();
    })
  }

  function renderWinner (winner) {
    const winHead = document.createElement('h2');
    const winText = document.createElement('p');
    const img = winner === 'kong' ? kongRight : trexRight;
    winWindow.className = 'win';
    winHead.innerHTML = winner === 'kong' ? 'Congratulations!' : 'Sorry...';
    winner = winner[0].toUpperCase() + winner.slice(1);
    winText.innerHTML = `${winner} wins`
    winWindow.appendChild(winHead);
    winWindow.appendChild(winText);
    document.getElementById('root').appendChild(winWindow);
    
    ctx.drawImage(img, body.clientWidth / 2.5, body.clientHeight / 2.5, 300, 300);
  }

  return {
    cleanUp: () => {
      cleanupListeners.forEach(remove => remove());
      root.removeChild(canvas);
      root.removeChild(progressWrapper);
      root.removeChild(winWindow);
    },
    render
  }
}