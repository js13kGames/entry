import * as u from '../util';

import Pool from '../pool';

import makeCamera from '../camera';

import makePlay from './play';

import makeOver from './over';

export default function ctrl(state, g) {
  const defaults = () => ({
    tick: 0,
    draggable: {}
  });

  this.data = { ...defaults(), ...state };

  this.camera = new makeCamera(this);

  this.play = new makePlay(this);

  this.over = new makeOver(this);

  let hero = this.play.hero;

  this.pressKey = key => {
    if (key === 'up') {
      if (this.data.state === u.States.Play) {
        hero.move([0, -1]);
      } else {
        this.play.init(this);
        this.data.state = u.States.Play;
      }
    } else if (key === 'down') {
      hero.move([0, 1]);
    } else if (key === 'left') {
      hero.move([-1, 0]);
    } else if (key === 'right') {
      hero.move([1, 0]);
    }
  };

  this.releaseKey = key => {
    if (key === 'up') {
      hero.stop([0, -1]);
    } else if (key === 'down') {
      hero.stop([0, 1]);
    } else if (key === 'left') {
      hero.stop([-1, 0]);
    } else if (key === 'right') {
      hero.stop([1, 0]);
    }    
  };

  const maybeUpdatePlay = delta => {
    if (this.data.state === u.States.Play) {
      this.play.update(delta);
    }
  };

  const maybeUpdateOver = delta => {
    if (this.data.state === u.States.Over) {
      this.over.update(delta);
    }
  };

  this.update = delta => {
    this.data.tick += delta;

    maybeUpdatePlay(delta);
    maybeUpdateOver(delta);
    
    // this.camera.update(delta);
  };
}
