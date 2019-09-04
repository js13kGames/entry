import * as G from '../graphics';

import * as co from '../colors';
import * as u from '../util';

import * as path from '../paths';

export default function view(ctrl, g) {

  const { camera } = ctrl;

  const { width, height } = ctrl.data.game;

  const transform = G.makeTransform({
    translate: [width*0.0, height * 0.0]
  });

  const colRed = new co.shifter(co.Palette.FluRed);
  const colBullet = new co.shifter(co.Palette.LuckyP);
  
  function renderMesh(ctrl, mesh) {

    let { view, lines } = mesh.geometry();

    g.draw(ctx => {

      lines.forEach(line => {

        let v1 = view[line[0]],
            v2 = view[line[1]];

        ctx.beginPath();
        ctx.moveTo(v1[0], v1[1]);
        ctx.lineTo(v2[0], v2[1]);
        ctx.stroke();
      });
      
    });
  }

  function renderExplosion(ctrl, explosion) {
    explosion.particles.each(_ => {
      g.raw(ctx => {
        let alpha = _.life.alpha();
        colRed
          .reset()
          .lum(alpha);
        ctx.strokeStyle = colRed.css();
      });

      renderMesh(ctrl, _.mesh);
    });
  }


  function renderHero(ctrl, hero) {

    g.stroke(colRed);
    renderMesh(ctrl, hero.mesh);

    g.raw(ctx => {
      ctx.strokeStyle = colBullet.css();
    });

    hero.bullets.each(_ => {
      renderMesh(ctrl, _.mesh);
    });
  }

  this.render = ctrl => {

    const tilesCtrl = ctrl.play.tiles;

    g.draw(ctx => {

      ctx.strokeStyle = colRed;

      tilesCtrl.explosion.each(_ => renderExplosion(ctrl, _));

      renderHero(ctrl, tilesCtrl.hero);

    }, { x: 0, y: 0, width, height }, transform);

  };
}
