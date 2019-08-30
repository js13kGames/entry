export class AnimationBase {
  constructor (duration) {
    this.duration = duration
    this.t = 0
    this.relativeT = 0
  }

  step () {
    this.t++
    this.relativeT = this.t / this.duration
    if (this.t === this.duration) {
      this.done = true
    }
  }
}
