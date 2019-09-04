import * as u from '../util';

import * as G from '../graphics';

// see shaders/background.frag for definitions
const BStates = {
  Play: 0,
  Over: 1
};

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const background = g.makeQuad({
    program: 'background',
    uniforms: {
      uTime: G.makeUniform1fSetter("uTime"),
      uMatrix: G.makeUniform3fvSetter("uMatrix"),
      uResolution: G.makeUniform2fSetter("uResolution"),
      uState: G.makeUniform1fSetter("uState")
    }
  }, width, height);

  this.render = ctrl => {

    const { tick } = ctrl.data;

    let state = BStates.Play;
    if (ctrl.data.gameover !== 0 || ctrl.data.state !== u.States.Play) {
      state = BStates.Over;
    }

    g.addQuad(background, {}, {
      uTime: [tick],
      uState: [state]
    });

  };

  
}
