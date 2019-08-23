import * as u from '../util';

// forked from https://github.com/jackrugile/start-making-games/blob/gh-pages/src/js/G/screenshake.js
export default function shake(ctrl, { g, a }) {

  const shake = ctrl.data.shake;

  this.translate = 0;
  this.rotate = 0;
  this.xTarget = 0;
  this.yTarget = 0;
  this.xBias = 0;
  this.yBias = 0;
  this.angleTarget = 0;


  this.shake = ({ translate, rotate, xBias, yBias }) => {
    this.translate = translate;
    this.rotate = rotate;
    this.xBias = xBias,
    this.yBias = yBias;
  };


  this.update = delta => {
    this.xBias *= 0.9;
    this.yBias *= 0.9;

    if (this.translate > 0) {
      this.translate *= 0.9;

      this.xTarget = u.rand(-this.translate, this.translate)
        + this.xBias;

      this.yTarget = u.rand(-this.translate, this.translate)
        + this.yBias;
    } else {
      this.xTarget = 0;
      this.yTarget = 0;
    }

    if (this.rotate > 0) {
      this.rotate *= 0.9;

      this.angleTarget = u.rand(-this.rotate, this.rotate);
    } else {
      this.angleTarget = 0;
    }

    shake.x += (this.xTarget - shake.x) * 0.1;
    shake.y += (this.yTarget - shake.y) * 0.1;
    shake.angle += (this.angleTarget - shake.angle) * 0.1;
  };

}
