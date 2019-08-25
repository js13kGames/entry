const initLevel3View = (onKeydown, onKeyup, onClick, actions, directions) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const root = document.getElementById('root');
  root.appendChild(canvas);

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

  function renderMap (canvasHeight, canvasWidth) {
    // grass
    ctx.fillStyle = 'green';
    ctx.fillRect(0, canvasHeight - 20, canvasWidth, 20);
  }

  function renderCharacter (character, charSize, charColor) {
    const eyeSize = charSize / 5;
    const eyeOffset = character.direction === directions.LEFT ? 0 : charSize - eyeSize;


    if (character.currentAction === actions.BLOCKING) {
      ctx.fillStyle = 'red';
    } else if (character.currentAction === actions.ATTACKING) {
      ctx.fillStyle = 'purple';
    } else if (character.currentAction === actions.PREPARING_ATTACK) {
      ctx.fillStyle = 'pink';
    } else if (character.currentAction === actions.DISABLED) {
      ctx.fillStyle = 'orange';
    } else {
      ctx.fillStyle = charColor;
    }
    ctx.fillRect(charSize * character.location, canvas.height - charSize - 20, charSize, charSize);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(
      charSize * character.location + eyeOffset,
      canvas.height - 20 - charSize + eyeSize,
      eyeSize,
      eyeSize
    );
  }

  function render (mapData, kong, trex) {
    return new Promise((resolve, reject) => {
      try {
        canvas.height = body.clientHeight;
        canvas.width = body.clientWidth;

        renderMap(canvas.height, canvas.width);
        renderCharacter(kong, canvas.width / mapData.width, 'black');
        renderCharacter(trex, canvas.width / mapData.width, 'blue');

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
    },
    render
  }
}