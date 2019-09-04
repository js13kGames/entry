import * as u from './util';

export default function Camera(ctrl) {

  const { width, height } = ctrl.data.game;

  let fov = width * 0.8,
      pCX = width * 0.5 ,
      pCY = height * 0.5;


  let iCX = pCX,
      iCY = pCY;

  let tX = pCX,
      tY = pCY;

  this.width = width;
  this.height = height;
  this.far = -width*0.5;
  this.near = -width*0.78;


  this.project = (v3) => {
    let pScale = fov / (fov + v3[2]);

    return [v3[0] * pScale + pCX,
            v3[1] * pScale + pCY];
  };

  const maybeMove = u.withDelay(() => {
    tX = u.rand(width * 0.3, width * 0.7);
    tY = u.rand(height * 0.3, height * 0.7);
  }, 3000);

  this.update = delta => {
    const { tick } = ctrl.data;

    iCX = interpolate(iCX, tX);
    iCY = interpolate(iCY, tY);

    pCX = interpolate(pCX, iCX);
    pCY = interpolate(pCY, iCY);

    maybeMove(delta);

  };
}

function interpolate(a, b) {
  return a + (b - a) * 0.01;
}
