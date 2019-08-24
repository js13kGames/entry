import { ClearAnimation } from './ClearAnimation';

export class GameOverAnimation {
  constructor (level) {
    this.level = level

    this.row = 0
    this.t = 0

    this.clearAnimations = []

    this.addAnimation()
  }

  step () {
    if (++this.t > 2) {
      if (this.row === this.level.board.height) {
        this.done = this.t > 60
      } else {
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
