import { ClearAnimation } from './ClearAnimation';
import { AnimationBase } from './Animation';
import { EnvelopeSampler } from '../utils';
import { drawTextCentered } from '../fontUtils';
import { drawSprite } from '../Graphics';
import { TextsSprite } from '../Assets';

export class EndAnimation extends AnimationBase {
  constructor (level, isGameOver) {
    super(isGameOver ? 120 : 200)

    this.isGameOver = isGameOver

    this.level = level

    this.row = 0

    this.clearAnimations = []

    this.addAnimation()

    this.scaleSampler = new EnvelopeSampler([
      [0.0, 0.0],
      [0.4, 0.0, 2],
      [0.45, 2.5, 1.5],
      [0.5, 2.0],
    ])
  }

  step () {
    super.step()

    if (this.t > 2) {
      if (this.row < this.level.board.height) {
        this.addAnimation()
      }
    }

    this.blinkingTimer++

    this.clearAnimations.forEach(animation => {
      animation.step()
    })
  }

  addAnimation () {
    this.t = 0
    this.clearAnimations.push(new ClearAnimation(this.level, [this.row]))
    this.row++
  }

  render () {
    this.clearAnimations.forEach(animation => animation.render())

    if (this.t > 10) {
      let center = this.level.width / 2

      let scale = this.scaleSampler.sample((this.t - 10) / 60)

      if (!this.isGameOver) {
        drawSprite(TextsSprite, center, 112, 8, scale, scale)
      }

      if (this.t >= this.tLimit && (this.t - this.tLimit) % 60 < 30) {
        drawTextCentered('PRESS ANY BUTTON', center, 160)
        drawTextCentered('TO START A NEW GAME', center, 167)
      }
    }
  }
}
