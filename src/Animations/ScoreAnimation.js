import { drawText } from '../fontUtils';
import { Graphics } from '../Graphics';
import { AnimationBase } from './Animation';

export class ScoreAnimation extends AnimationBase {
  constructor (score) {
    super(30)

    this.score = score
    this.x = Math.random() * 60
  }

  render (xOff, yOff) {
    if (this.done) {
      return
    }

    Graphics.globalAlpha = 1 - this.relativeT ** 2
    drawText('+' + this.score, xOff + this.x, yOff - this.t / 2, 2)
    Graphics.globalAlpha = 1
  }
}
