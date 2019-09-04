import * as u from '../util';

import { text } from '../text';

export default function over(ctrl, g) {

  const { width, height } = ctrl.data.game;

  g.draw(ctx => {
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
  });


  const renderInfo = ctrl => {

    const y = height * 0.6;
    const gap = height * 0.05;

    text(g, {
      text: "Left/Right arrows to move",
      x: width * 0.5,
      y: y + gap
    });
    text(g, {
      text: "Down arrow to limit jump, when released you get a jump boost",
      x: width * 0.5,
      y: y + gap * 2
    });

    text(g, {
      text: "Up arrow to change gravity, works on highlighted areas",
      x: width * 0.5,
      y: y + gap * 3
    });

    text(g, {
      text: "Avoid spikes, reach the goal",
      x: width * 0.5,
      y: y + gap * 4
    });


  };

  const renderScore = ctrl => {
    if (ctrl.play.data && ctrl.play.data.goal) {
      text(g, {
        text: "Nice you hit the goal!",
        font: '40px Arial',
        x: width * 0.5,
        y: height * 0.4
      });
    }
  };

  const renderOver = ctrl => {

    renderScore(ctrl);


    renderInfo(ctrl);


    text(g, {
      text: "Press UP to play",
      x: width * 0.5,
      y: height * 0.5,
      font: "40px Arial"
    });

  };

  
  this.render = ctrl => {
    if (ctrl.data.state === u.States.Over) {
      renderOver(ctrl);
    }
    
  };
  
}
