import * as u from '../util';

import Pool from '../pool';

import makeHero from './hero';
import makePaddles from './paddle';
import makeSpot from './spot';
import makeBlock from './block';
import makeStar from './star';

import defaults from '../state';

import { collides, lineCollisionRange } from '../collision';

export default function ctrl(ctrl, ctx) {
  const { g, a } = ctx;

  this.data = ctrl.data;
  const { width, height } = this.data.game;

  this.hero = new makeHero(this, ctx);

  this.paddles = new makePaddles(this, g);

  this.blocks = new Pool(makeBlock, this);

  this.spots = new Pool(makeSpot, this);

  this.stars = new Pool(makeStar, this);

  const updateCollision = delta => {
    
    const hitBlock = this.blocks
          .find(_ => {
            return collides(g,
                            u.HERO_COLOR,
                            lineCollisionRange(_.data));
          });
    if (hitBlock) {
      blockHit(hitBlock);
    }

  };

  const spotLife = () => u.rand(2, 5);

  const createExplosionSpots = (x, y, color) => {
    this.spots.create({x, y, color});
    if (u.rand(0,1)<0.5)
      this.spots.create({ x: x+20, y, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x: x-20, y, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x: x+20, y: y+20, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x: x+20, y: y-20, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x, y: y + 20, life: spotLife(), color });
    if (u.rand(0,1)<0.5)
      this.spots.create({ x, y: y - 20, life: spotLife(), color });    
  };

  const blockHit = (hitBlock) => {
    const { x, y, angle, color } = hitBlock.data;

    this.hero.changeV(angle);

    this.blocks.release(hitBlock);

    createExplosionSpots(x, y, color);
  };

  const maybeBoost = () => {
    if (this.userBoost) {
      this.hero.boost(20);

      u.ensureDelay(this.userBoost, () => {
        this.userBoost = 0;
      }, 100);
    } else {
      this.hero.boost(1);
    }
  };

  const maybeSpawnBlock = withDelay(() => {
    const length = this.data.game.unit;
    this.blocks.create({
      x: u.rand(length, width - length),
      y: u.rand(length, height - length),
      length: length * 0.4,
      angle: u.rand(0, u.TAU / 4 - u.TAU / 8) + u.TAU / 10
    });

  }, 1000);

  const maybeSpawnStar = withDelay(() => {
    this.stars.create({ life: u.rand(0, 10) });
  }, 100);

  const maybeEndPlay = delta => {
    if (this.data.gameover > 0) {
      u.ensureDelay(this.data.gameover, () => {
        this.data.gameover = 0;
        this.data.state = u.States.Over;
      }, 1000);
    }
  };

  this.reset = () => {
    const d = defaults();

    if (this.data.game.score > this.data.highscore) {
      this.data.highscore = this.data.game.score;
    }

    this.data.hero = d.hero;
    this.data.game = d.game;

    this.hero.init(this.data.hero);
  };

  this.boost = () => {
    this.userBoost = u.now();
  };

  this.paddleHit = () => {

    if (!this.data.hero.inwards) {

      this.hero.explode();

      createExplosionSpots(this.data.hero.x,
                           this.data.hero.y,
                           3);

      this.data.gameover = u.now();
    }
  };

  this.paddleMove = v => {
    if (v[0] !== 0) 
      this.data.paddleBoost[0] = v[0];
    if (v[1] !== 0)
      this.data.paddleBoost[1] = v[1];
  };

  this.shake = (angle) => {
    ctrl.screenshake.shake({
      translate: 15,
      rotate: 0.15,
      xBias: Math.cos(angle),
      yBias: Math.sin(angle) * -10
    });
  };

  this.extrude = (angle3) => {
    this.data.extrusion.angle3[0] = angle3[0];
    this.data.extrusion.angle3[1] = angle3[1];
    this.data.extrusion.angle3[2] = angle3[2];
  };


  this.update = delta => {
    maybeBoost(delta);
    maybeSpawnBlock(delta);
    maybeSpawnStar(delta);
    maybeEndPlay(delta);
    updateCollision(delta);

    this.hero.update(delta);
    this.paddles.update(delta);
    this.blocks.each(_ => _.update(delta));
    this.spots.each(_ => _.update(delta));
    this.stars.each(_ => _.update(delta));
  };
}

const withDelay = (fn, delay, updateFn) => {
  let lastUpdate = 0;

  return (delta) => {
    lastUpdate += delta;
    if (lastUpdate >= delay) {
      fn();
      lastUpdate = 0;
    } else {
      if (updateFn)
        updateFn(lastUpdate / delay);
    }
  };
};
