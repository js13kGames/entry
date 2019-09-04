import { objFind } from './util2';

import * as u from './util';

export function start(ctrl, g, e) {
  let s = ctrl.data;

  let position = eventPositionInBounds(e, s.bounds);
  const nextIndex = getNextIndexAtPosition(s, position);

  if (nextIndex !== null) {
    s.draggable.current = {
      nextIndex,
      epos: position
    };
  }

  const restart = getRestartAtPosition(s, position);

  if (restart) {
    ctrl.play.reset();
  }
};

export function cancel(ctrl, g, e) {
  let s = ctrl.data;

  const cur = ctrl.data.draggable.current;
  if (cur) {
    ctrl.play.tiles.commitTile();
    delete s.draggable.current;
  }
};

export function move(ctrl, g, e) {
  let s = ctrl.data;

  const cur = s.draggable.current;
  const position = eventPositionInBounds(e, s.bounds);

  if (cur) {
    const nextDrag = s.views.play.nextDrag;
    cur.epos = position;

    if (!nextDrag) {
      return;
    }

    cur.tiles = nextDrag.map(_ => ({
      key: getTileKeyAtPosition(s, _),
      tileI: _.i
    }));
  }

  const restart = getRestartAtPosition(s, position);

  if (restart) {
    s.draggable.restart = true;
  } else {
    s.draggable.restart = false;
  }
};

function eventPositionInBounds(e, bounds) {
  let position = u.eventPosition(e);
  return [position[0] - bounds.left,
          position[1] - bounds.top];
}

function getTileKeyAtPosition(s, pos) {
  const views = s.views;

  return objFind(views.play.tiles, (key, tile) => {
    return isInside(tile,
                    pos.x + pos.width * 0.5,
                    pos.y + pos.height * 0.5);
  });
}

function getRestartAtPosition(s, pos) {
  const views = s.views;

  if (!views || !views.play) {
    return false;
  }

  if (isInside(views.play.restart, pos[0], pos[1])) {
    return true;
  }
  return false;
}

function getNextIndexAtPosition(s, pos) {
  const views = s.views,
        left = pos[0],
        top = pos[1];

  if (!views || !views.play) {
    return null;
  }

  let foundI = null;

  views.play.next.find((next, i) => {
    if (next.some(box => {
      if (isInside(box, left, top)) {
        return true;
      }
      return false;
    })) {
      foundI = i;
    }
  });
  return foundI;
}

function isInside(box, x, y) {
  return box.x < x && box.x + box.width > x &&
    box.y < y && box.y + box.height > y;
}
