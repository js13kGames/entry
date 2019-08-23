import text from '../text';

import * as u from '../util';


export default function view(ctrl, g) {
  
  const { tileWidth, tileHeight, width, height } = ctrl.data.game;

  const b = g.buffers;


  this.render = ctrl => {
    ctrl = ctrl.play;

    ctrl.stars.each(_ => renderStar(ctrl, _, g));
    ctrl.spots.each(_ => renderSpot(ctrl, _, g));
    ctrl.blocks.each(_ => renderBlock(_, g));
    ctrl.data.paddles.forEach(_ => renderPaddle(ctrl, _, g));

    renderHero(ctrl, g);
    renderPaddleForce(ctrl, g);

    renderBackground(ctrl, g);

    renderEdges(ctrl, g);

    renderUi(ctrl, g);
  };

  function renderSpot(ctrl, spot, g) {
    g.renderTarget = b.Buffer;

    const { x, y, radius, color } = spot.data;
    
    g.fillCircle(x, y, radius, color);
    g.fillCircle(x, y, radius * 0.6, color + 1);

  }

  function renderStar(ctrl, star, g) {
    const { x, y } = star.data;

    g.renderTarget = b.Midground;

    g.pset(x, y, 48);

  }

  function renderBackground(ctrl, g) {
    g.renderTarget = b.Midground;

    let rx0 = 0,
        rx1 = width / tileWidth,
        ry0 = 0,
        ry1 = height / tileHeight;

    for (let i = rx0; i < rx1; i++) {
      for (let j = ry0; j < ry1; j++) {
        let x, y;

        x = i * tileWidth,
        y = j * tileHeight;

        let tc = g.pget(x, y, b.Buffer);

        if (tc)
          g.fr(x, y, tileWidth, tileHeight, tc);
      }
    }
  }

  function renderEdges(ctrl, g) {
    const off = 41;
    const on = 38;

    const edge = ctrl.data.hero.edge,
          left = edge==='left'?on:off,
          right = edge==='right'?on:off,
          up = edge==='up'?on:off,
          down = edge==='down'?on:off;

    g.renderTarget = b.Midground;

    g.fr(0, 0, width, 1, up);
    g.fr(0, 0, 1, height, left);
    g.fr(0, height - 2, width, 1, down);
    g.fr(width - 2, 0, 1, height, right);
  }


  function renderPaddleForce(ctrl, g) {
    const { vx, vy, x, y, friction } = ctrl.data.hero;

    if (friction >= 1) {
      return;
    }

    g.renderTarget = b.Buffer;

    const sfx = (Math.sin(ctrl.data.game.tick * 0.01) + 1) / 2 * 3;

    let radius = 15;

    const angle = Math.atan2(vy, vx) + u.PI % u.TAU;

    const c = Math.cos(angle),
          s = Math.sin(angle);



    const o1 = u.rand(sfx, sfx + 2),
          o2 = u.rand(sfx + 2, sfx + 4),
          o3 = u.rand(sfx + 4, sfx + 8);

    g.fillCircle(x, y, radius, 20);
    g.fillCircle(x + c * o1, y + s * o1, radius + 1, 21);
    g.fillCircle(x + c * o2, y + s * o2, radius + 2, 22);
    g.fillCircle(x + c * o3, y + s * o3, radius + 3, 0);

  }

  function renderPaddle(ctrl, paddle, g) {
    const { tick } = ctrl.data.game;

    const { x, y, w, h, side } = paddle;

    const { vx, vy } = paddle;

    const active = (vx === 1 || vy === 1);

    const off = 15,
          on = 12,
          color = active ? on: off;

    let moveX = 0, moveY = 0;

    let sfxFactor = active ? 4: 0;
    let sfxX = 0, sfxY = 0;

    let rangeFactor = 10;
    let range = {side};

    switch (side) {
    case 'left':
      moveX = h * 0.08;
      moveY = ((height / 2) - y) * 0.03;

      range.x = x;
      range.y = y - rangeFactor * 2;
      range.w = w + rangeFactor * 4;
      range.h = h + rangeFactor * 4;

      sfxX = u.sinh(tick * 0.01) * sfxFactor;

      break;
    case 'right':
      moveX = -h * 0.08;
      moveY = ((height / 2) - y) * 0.03;

      range.x = x - rangeFactor * 4;
      range.y = y - rangeFactor * 2;
      range.w = w + rangeFactor * 4;
      range.h = h + rangeFactor * 4;

      sfxX = -u.sinh(tick * 0.01) * sfxFactor;
      break;
    case 'up':
      moveY = w * 0.08;
      moveX = ((width / 2) - x) * 0.01;

      range.x = x - rangeFactor * 2;
      range.y = y;
      range.w = w + rangeFactor * 4;
      range.h = h + rangeFactor * 4;

      sfxY = u.sinh(tick * 0.01) * sfxFactor;
      break;
    case 'down':
      moveY = -w * 0.08;
      moveX = ((width / 2) - x) * 0.01;

      range.x = x - rangeFactor * 2;
      range.y = y - rangeFactor * 4;
      range.w = w + rangeFactor * 4;
      range.h = h + rangeFactor * 4;

      sfxY = -u.sinh(tick * 0.01) * sfxFactor;
      break;
    }

    let sfxS = u.sinh(tick * 0.01) * 1,
        sfxC = u.sinh(tick * 0.01) * 1;


    g.renderTarget = b.Collision;
    g.fr(range.x, range.y, range.w, range.h, u.Colors.PaddleRange);

    g.renderTarget = b.Midground;
    g.fr(x + moveX * sfxS + sfxX, y + moveY * sfxC + sfxY, w, h, 16);
    g.fr(x + sfxX, y + sfxY, w, h, color);

  }

  function renderBlock(ctrl, g) {
    const { x, y, angle, length, color } = ctrl.data;
    let c = Math.cos(angle) * length,
        s = Math.sin(angle) * length;

    // g.renderTarget = b.Collision;
    // g.line(x, y, x + c, y + s, color);

    g.renderTarget = b.Buffer;
    g.line(x, y, x + c, y + s, color);
  }

  function renderHero(ctrl, g) {
    g.renderTarget = b.Collision;
    const { vx, vy, x, y, radius, rotation, color, active, tick, exploding } = ctrl.data.hero;

    if (exploding) {
      return;
    }
    g.fillCircle(x, y, radius, color);

    const rC = Math.cos(rotation),
          rS = Math.sin(rotation);

    const alphas = [40, 5, 4, 3, 2];
    const highlight = alphas[Math.floor(active) % alphas.length];

    g.renderTarget = b.Midground;

    g.fillCircle(x - vx * 0.5, y - vy * 0.5, radius, 43);
    g.fillCircle(x, y, radius, highlight);
    g.fillCircle(x - rC, y - rS, radius * 0.5, 41);
  }

  function renderUi(ctrl, g) {
    const score = ctrl.data.game.score + '';

    g.renderTarget = b.Ui;
    
    const scoreLabel = text({
      x: width * 0.1,
      y: 10,
      text: 'score',
      color: 48,
      scale: 1
    }, g);

    text({
      x: scoreLabel.ex + 20,
      y: 10,
      text: score,
      color: 48,
      scale: 1
    }, g);    
  }
}
