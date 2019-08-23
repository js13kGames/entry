import * as u from '../util';

import * as c from '../collision';

export default function hero(ctrl, { g, a }) {
  const { width, height } = ctrl.data.game;

  let hero;

  this.init = (d) => {
    hero = d;
  };

  const updatePos = delta => {
    const { radius } = hero;

    const k = hero.friction,
          d = 1,
          maxBrake = 1;

    // https://stackoverflow.com/questions/57517033/how-to-calculate-velocity-based-on-acceleration-and-friction?noredirect=1#57517141
    // hero.vx -= Math.sign(hero.ax) * Math.min(k / d, maxBrake) * delta * 0.001;
    // hero.vy -= Math.sign(hero.ay) * Math.min(k / d, maxBrake) * delta * 0.001;

    hero.vx += hero.ax * delta * 0.001 * hero.boost;
    hero.vy += hero.ay * delta * 0.001 * hero.boost;

    hero.vx *= k;
    hero.vy *= k;

    hero.x += hero.vx;
    hero.y += hero.vy;

    if (hero.x < radius) {
      hero.x = radius;
      hero.vx *= -0.5;
      hero.ax *= -1;
      hero.edge = 'left';
      hero.active = 4;
      hero.audioEdge = true;
    }
    if (hero.y < radius) {
      hero.y = radius;
      hero.vy *= -0.5;
      hero.ay *= -1;
      hero.edge = 'up';
      hero.active = 4;
      hero.audioEdge = true;
    }
    if (hero.x >= width - radius) {
      hero.x = width - radius;
      hero.vx *= -0.5;
      hero.ax *= -1;
      hero.edge = 'right';
      hero.active = 4;
      hero.audioEdge = true;
    }
    if (hero.y >= height - radius) {
      hero.y = height - radius;
      hero.vy *= -0.5;
      hero.ay *= -1;
      hero.edge = 'down';
      hero.active = 4;
      hero.audioEdge = true;
    }
  };

  const updateRotation = delta => {
    hero.rotation += hero.active;
    hero.rotation = hero.rotation % u.TAU;
  };

  const updateEdgeMath = delta => {
    
    const { x, y } = hero;
    
    let dX, dY;
    let closeXAxis,
        closeYAxis,
        closeEdge;

    if (x < width / 2) {
      dX = x;
      closeXAxis = [0, 1];
    } else {
      dX = width - x;
      closeXAxis = [0, -1];
    }

    if (y < height / 2) {
      dY = y;
      closeYAxis = [1, 0];
    } else {
      dY = height - y;
      closeYAxis = [-1, 0];
    }

    if (dX < dY) {
      hero.closestEdge = closeXAxis;
    } else {
      hero.closestEdge = closeYAxis;
    }


    hero.inwards = Math.sign(
      cross(hero.closestEdge, [hero.vx, hero.vy])) === 1;
  };

  const updateCollision = delta => {
    const hitPaddleRange = c.collides(g,
                                      u.Colors.PaddleRange,
                                      c.circleCollisionRange(hero));

    if (hitPaddleRange) {
      paddleRangeIn();
    } else {
      paddleRangeOut();
    }
  };

  const updateTicks = delta => {
    hero.tick += delta;

    if (hero.active > 0) {
      hero.active = Math.max(0, hero.active - (delta / 16) * 0.2);
    } else {
      delete hero.edge;
    }
  };

  const updateTrail = delta => {
    ctrl.spots.create({ x: hero.x - hero.ax * 10,
                        y: hero.y - hero.ay * 10,
                        color: 4,
                        life: 2 });
    ctrl.spots.create({ x: hero.x - hero.ax * 5,
                        y: hero.y - hero.ay * 5,
                        color: 7,
                        life: 2 });
  };

  const updateScore = delta => {
    ctrl.data.game.score += Math.floor(hero.active);
    ctrl.data.game.score += Math.floor(Math.sqrt(Math.sqrt(hero.boost - 1)));
  };

  const updateAudio = delta => {
    if (hero.active === 4) {
      if (hero.audioEdge) {
        hero.audioEdge = false;
        a.playSound('sndSplode2');
      } else {
        a.playSound('sndSplode3');
      }
    }
    if (hero.friction < 1) {
      a.playSound('sndShield', 1, 0, 0.2);
    }
    if (hero.exploding && !hero.audioExplode) {
      hero.audioExplode = true;
      a.playSound('sndSplode1');
    }
  };

  const updateShake = delta => {
    if (hero.active === 4 && !hero.audioEdge) {
      const angle = Math.atan2(hero.vy, hero.vx);
      ctrl.shake(angle);
    }
  };

  this.xDeg = 0;
  this.yDeg = 0;
  const updateExtrusion = delta => {
    const xDegTarget = (hero.y / height - 0.5) * 2,
          yDegTarget = (hero.x / width - 0.5) * 2;
    this.xDeg += (xDegTarget - this.xDeg) * 1;
    this.yDeg += (yDegTarget - this.yDeg) * 1;
    
    const angle3 = [
      0,
      this.xDeg * 0.015,
      this.yDeg * 0.015
    ];
    
    // ctrl.extrude(angle3);
  };

  const maybeUpdateTrailPos = delta => {
    if (!hero.exploding) {
      updatePos(delta);
      updateTrail(delta);
    }
  };


  this.update = delta => {
    maybeUpdateTrailPos(delta);

    updateRotation(delta);
    updateEdgeMath(delta);
    updateCollision(delta);
    updateShake(delta);
    updateAudio(delta);
    updateTicks(delta);
    updateScore(delta);

    updateExtrusion(delta);
  };

  this.boost = boost => {
    hero.boost = boost;
  };


  this.changeV = angle => {
    const c = Math.cos(angle),
          s = Math.sin(angle);

    const lV = [c, s];
    const hV = [-hero.vx, -hero.vy];

    const nV = [hV[0] + lV[0], hV[1] + lV[1]];

    hero.vx = u.clamp(nV[0] * 2, -1, 1);
    hero.vy = u.clamp(nV[1] * 2, -1, 1);

    hero.ax = u.clamp(nV[0] * 2, -1, 1);
    hero.ay = u.clamp(nV[1] * 2, -1, 1);
    hero.active = 4;
  };

  this.explode = () => {
    hero.friction = 1;
    hero.exploding = true;
  };

  const paddleRangeIn = () => {
    if (!hero.inwards && !hero.exploding) {
      hero.friction = 0.9;
    }
  };
  const paddleRangeOut = () => {
    hero.friction = 1;
  };
}

const cross = (v1, v2) => {
  return v1[0] * v2[1] + v1[1] * v2[0];
};
