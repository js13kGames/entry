import * as u from './util';

export default function defaults() {

  const height = 256,
        width = height * 1.5,
        ratio = height / width;

  const nbTiles = 100;

  const gameUnit = 40;

  const paddleWidth = gameUnit;

  return {
    debug: false,
    state: u.States.Over,
    highscore: 0,
    shake: {
      angle: 0,
      x: 0,
      y: 0
    },
    extrusion: {
      angle3: [
        0,
        0,
        0
      ]
    },
    game: {
      score: 0,
      unit: gameUnit,
      tileWidth: width / nbTiles,
      tileHeight: height / nbTiles,
      width,
      height,
      ratio,
      vx: 10,
      tick: 0
    },
    paddleBoost: [1, 1],
    paddles: [
      {
        side: 'up',
        vx: 1,
        vy: 0,
        x: width / 2,
        y: 2,
        w: paddleWidth,
        h: 10
      },
      {
        side: 'down',
        vx: -1,
        vy: 0,
        x: width / 2,
        y: height - 11,
        w: paddleWidth,
        h: 10
      },
      {
        side: 'left',
        vx: 0,
        vy: 1,
        x: 1,
        y: height / 2,
        w: 10,
        h: paddleWidth
      },
      {
        side: 'right',
        vx: 0,
        vy: -1,
        x: width - 11,
        y: height / 2,
        w: 10,
        h: paddleWidth
      }
    ],
    hero: {
      color: u.HERO_COLOR,
      exploding: false,
      radius: gameUnit / 8,
      gap: 2,
      gapMove: 2,
      rotation: 0,
      x: width / 2,
      y: height / 2,
      ax: -1,
      ay: -1,
      vx: 0,
      vy: 0,
      rotation: 0,
      boost: 1,
      friction: 1,
      tick: 0,
      active: 0
    }
  };
 
}
