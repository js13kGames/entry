import * as u from './util';

export function circle(ctx, opts) {

  const { width, height } = opts;

  const nbTiles = 20;
  const stepWidth = width / nbTiles,
        stepHeight = height / nbTiles;

  const path = new Path2D();


  for (let i = 0; i < width; i += stepWidth) {
    for (let j = 0; j < height; j+= stepHeight) {
      path.moveTo(i, j);
      path.arc(i, j, 2, 0, u.PI * 2.0, false);
    }
  }
  
  ctx.fill(path);
}

export function hexa(size) {
  const path = new Path2D();

  for (let i = 0; i < 7; i++) {
    path.lineTo(size * Math.cos(i * 2 * Math.PI / 6), size * Math.sin(i * 2 * Math.PI / 6));
  }

  return path;
}

//   const hb = 200,
  //       h1 = 90,
  //       h2 = -20,
  //       h3 = 60,
  //       i1 = 40,
  //       i2 = 60,
  //       c1 = 1.0;
  // const radius = 40;

export function merge(options) {
  options = { ...{
    hb: 200,
    h1: 90,
    h2: -20,
    h3: 60,
    i1: 40,
    i2: 60,
    c1: 1.0,
    radius: 40
  }, ...options };

  let {
    hb,
    h1,
    h2,
    h3,
    i1,
    i2,
    c1,
    radius
  } = options;

  h1 *= c1;
  h2 *= c1;
  h3 *= (1.0 - c1);
  i1 *= c1;
  i2 *= 1.0 - c1;

  const os = radius,
        osY = hb;

  const path = new Path2D();

  path.arc(os + 0, osY + h1, radius, 0, u.PI, false);
  path.lineTo(os + -radius, osY - hb);
  path.lineTo(os + radius, osY -hb);
  path.moveTo(os + radius, osY -hb);
  path.arc(os + radius * 2, osY -i1, radius, u.PI, u.PI*2, false);
  path.lineTo(os + radius * 3, osY -hb);
  path.moveTo(os + radius * 3, osY -hb);
  path.arc(os + radius * 4, osY + h2, radius, 0, u.PI, false);
  path.moveTo(os + radius * 5, osY + h2);
  path.lineTo(os + radius * 3, osY -hb);
  path.lineTo(os + radius * 5, osY -hb);
  path.moveTo(os + radius * 5, osY -hb);
  path.arc(os + radius * 6, osY -i2, radius, u.PI, u.PI * 2, false);
  path.lineTo(os + radius * 7, osY -hb);
  path.moveTo(os + radius * 7, osY-hb);
  path.arc(os + radius * 8, osY + h3, radius, 0, u.PI, false);
  path.moveTo(os + radius * 7, osY -hb);
  path.lineTo(os + radius * 9, osY -hb);
  path.lineTo(os + radius * 9, osY + h3);

  path.moveTo(os + radius * 3, osY -hb);
  path.arc(os + radius * 4, osY + h1 * c1, radius, 0, u.PI * 2, false);

  return path;
}
