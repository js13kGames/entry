import * as u from '../util';

import { collides, rectCollisionRange } from '../collision';

export default function paddles(ctrl, g) {
  const { width, height } = ctrl.data.game;

  const paddles = ctrl.data.paddles;

  const updatePaddle = paddle => delta => {
    paddle.x += paddle.vx * ctrl.data.paddleBoost[0];
    paddle.y += paddle.vy * ctrl.data.paddleBoost[1];

    if (paddle.x > width - paddle.w) {
      paddle.x = width - paddle.w;
      paddle.vx *= -1;
    }
    if (paddle.x < 0) {
      paddle.x = 0;
      paddle.vx *= -1;
    }
    if (paddle.y > height - paddle.h) {
      paddle.y = height - paddle.h;
      paddle.vy *= -1;
    }
    if (paddle.y < 0) {
      paddle.y = 0;
      paddle.vy *= -1;
    }
  };

  const mapCollision = _ => ({
    e: _,
    c: collides(g,
                u.HERO_COLOR,
                rectCollisionRange(_))
  });

  const updateCollision = delta => {

    const hitPaddle = paddles
          .map(mapCollision)
          .find(_ => !!_.c);

    if (hitPaddle) {
      ctrl.paddleHit();
    }
  };

  this.update = delta => {
    updateCollision(delta);
    paddles.forEach(_ => updatePaddle(_)(delta));
  };

}
