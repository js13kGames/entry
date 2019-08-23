import * as u from '../util';

export default function ctrl(ctrl, ctx) {
  const { g } = ctx;

  this.data = ctrl.data;

  const extrude = () => {
    const angle3 = [
      0,
      Math.sin(ctrl.data.game.tick * 0.005) * Math.PI * 0.02,
      Math.cos(ctrl.data.game.tick * 0.005) * Math.PI * 0.02,
    ];

    this.data.extrusion.angle3[0] = angle3[0];
    this.data.extrusion.angle3[1] = angle3[1];
    this.data.extrusion.angle3[2] = angle3[2];
  };

  const maybeExtrude = () => {
    if (this.data.game.score < this.data.highscore) {
      // extrude();
    }
  };

  this.update = delta => {
    maybeExtrude();
  };
}
