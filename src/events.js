export function bindDocument(ctrl, g) {
  const unbinds = [];

  const onKeyDown = startMove(ctrl);
  const onKeyUp = endMove(ctrl);

  unbinds.push(unbindable(document, 'keydown', onKeyDown));
  unbinds.push(unbindable(document, 'keyup', onKeyUp));

  return () => { unbinds.forEach(_ => _()); };

}

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}

function endMove(ctrl) {
  return function(e) {
    switch (e.code) {
    case 'ArrowUp':
      ctrl.releaseKey('up');
      break;
    case 'ArrowDown':
      ctrl.releaseKey('down');
      break;
    case 'ArrowLeft':
      ctrl.releaseKey('left');
      break;
    case 'ArrowRight':
      ctrl.releaseKey('right');
      break;
    }
  };
}

function startMove(ctrl) {
  return function(e) {
    switch(e.code) {
    case 'Space':
      ctrl.spaceHit();
      break;
    case 'ArrowUp':
      ctrl.pressKey('up');
      break;
    case 'ArrowDown':
      ctrl.pressKey('down');
      break;
    case 'ArrowLeft':
      ctrl.pressKey('left');
      break;
    case 'ArrowRight':
      ctrl.pressKey('right');
      break;
    default:
      return;
    }
    e.preventDefault();
  };
}
