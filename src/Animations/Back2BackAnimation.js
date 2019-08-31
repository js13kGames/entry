import { AnimationBase } from './Animation';
import { EnvelopeSampler } from '../utils';
import { drawText, getTextWidth } from '../fontUtils';

export class Back2BackAnimation extends AnimationBase {
  constructor () {
    super(120)

    this.scaleSampler = new EnvelopeSampler([
      [0.0, 0.0],
      [0.1, 0.0, 2],
      [0.2, 1.3, 1.5],
      [0.3, 1.0],
      [0.9, 1.0, 2],
    ])
  }

  render () {
    if (this.done) {
      return
    }

    const text = 'BACK-TO-BACK'

    const scale = this.scaleSampler.sample(this.relativeT)
    const textWidth = getTextWidth(text)
    drawText(text, -textWidth / 2 * scale, 150, scale)
  }
}
