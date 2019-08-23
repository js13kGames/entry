import * as u from './util';

export function collides(g, color, cr) {
  return cr((x, y) => {
    return g.pget(x, y, g.buffers.Collision) === color;
  });
}

export function circleCollisionRange({ x, y, radius }) {
  return (collider) => {
    for (let a = 0; a < u.TAU; a+= u.THIRDPI) {
      const c = Math.cos(a) * radius,
            s = Math.sin(a) * radius;
      let cx = x + c,
          cy = y + s;

      if (collider(cx, cy)) {
        return { x: cx, y: cy };
      }
    }
    return null;
  };
}

export function lineCollisionRange({ x, y, angle, length }) {
  return (collider) => {
    for (let a = 0; a < length; a+=0.1) {
      const c = Math.cos(angle) * a,
            s = Math.sin(angle) * a;

      let cx = x + c,
          cy = y + s;

      if (collider(cx, cy)) {
        return { x: cx, y: cy };
      }
    }
    return null;
  };
}

export function rectCollisionRange({ x, y, w, h }) {
  return (collider) => {
    for (let dx = 0; dx < w; dx+=1) {
      for (let dy = 0; dy < h; dy += 1) {
        let cx = x + dx,
            cy = y + dy;

        if (collider(cx, cy)) {
          return { x: dx, y: dy };
        }
      }
    }
    return null;
  };
}
