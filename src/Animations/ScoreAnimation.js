import { drawText } from '../fontUtils';
import { Graphics } from '../Graphics';
import { AnimationBase } from './Animation';

export class ScoreAnimation extends AnimationBase {
  constructor (score) {
    super(30)

    this.score = score
    this.x = Math.random() * 60
  }

  render () {
    if (this.done) {
      return
    }

    Graphics.globalAlpha = 1 - this.relativeT ** 2
    const prefix = this.score > 0 ? '+' : ''
    drawText(prefix + this.score, 20 + this.x, 294 - this.t / 2, 2)
    Graphics.globalAlpha = 1
  }
}
