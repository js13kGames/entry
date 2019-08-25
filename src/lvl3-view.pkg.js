const initLevel3View = (onKeydown, actions, directions) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const root = document.getElementById('root');
  root.appendChild(canvas);

  const keypress = addEventListener(
    window,
    'keydown',
    (e) => onKeydown(e.which)
  );

  function renderAction (action) {
    switch (action) {
      case actions.READY:
        return 'READY';
      case actions.BLOCKING:
        return 'BLOCKING';
      case actions.ATTACKING:
        return 'ATTACKING';
      case actions.DISABLED:
        return 'DISABLED';
    }
  }

  function render (mapData, kong, trex) {
    return new Promise((resolve, reject) => {
      try {
        canvas.height = body.clientHeight;
        canvas.width = body.clientWidth;
        const charSize = canvas.width / mapData.width;
        const eyeSize = charSize / 5;
        const eyeOffset = kong.direction === directions.LEFT ? 0 : charSize - eyeSize;

        ctx.fillStyle = 'green';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
        ctx.fillStyle = 'black';
        ctx.fillRect(charSize * kong.location, canvas.height - charSize - 20, charSize, charSize);
        ctx.fillStyle = 'yellow';
        ctx.fillRect(
          charSize * kong.location + eyeOffset,
          canvas.height - 20 - charSize + eyeSize,
          eyeSize,
          eyeSize
        );
        ctx.fillStyle = 'blue';
        ctx.fillRect(charSize * trex.location, canvas.height - charSize - 20, charSize, charSize);
        resolve();
      } catch (e) {
        console.error(e);
        reject();
      }
    })
  }

  return {
    cleanUp: () => {
      keypress();
      root.removeChild(canvas);
    },
    render
  }
}