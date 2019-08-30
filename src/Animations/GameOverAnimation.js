import { ClearAnimation } from './ClearAnimation';
import { AnimationBase } from './Animation';

export class GameOverAnimation extends AnimationBase {
  constructor (level) {
    super(60)

    this.level = level

    this.row = 0

    this.clearAnimations = []

    this.addAnimation()
  }

  step () {
    super.step()

    if (this.t > 2) {
      if (this.row < this.level.board.height) {
        this.addAnimation()
      }
    }

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
  }
}
