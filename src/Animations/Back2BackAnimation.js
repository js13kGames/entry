import { drawTextCentered } from '../fontUtils';
import { AnimationBase } from './Animation';
import { EnvelopeSampler } from '../utils';

export class Back2BackAnimation extends AnimationBase {
  constructor () {
    super(120)

    this.scaleSampler = new EnvelopeSampler([
      [0.0, 0.0],
      [0.1, 0.0, 2],
      [0.2, 1.4, 1.5],
      [0.3, 1.0],
      [0.9, 1.0, 2],
    ])
  }

  render () {
    if (this.done) {
      return
    }

    drawTextCentered('BACK-TO-BACK', 0, 150, this.scaleSampler.sample(this.relativeT))
  }
}
