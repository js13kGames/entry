import { drawText } from './fontUtils';
import { Graphics } from './Graphics';

export class ScoreAnimation {
  constructor (score) {
    this.score = score
    this.t = 0
    this.x = Math.random() * 30
  }

  step () {
    this.t++
    if (this.t === 30) {
      this.done = true
    }
  }

  render (xOff, yOff) {
    if (this.done) {
      return
    }

    Graphics.globalAlpha = 1 - (this.t / 30) ** 2
    drawText('+' + this.score, xOff + this.x, yOff - this.t / 2)
    Graphics.globalAlpha = 1
  }
}
