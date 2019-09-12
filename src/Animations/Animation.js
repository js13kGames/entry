export class AnimationBase {
  constructor (duration) {
    this.tLimit = duration
    this.t = 0
    this.relativeT = 0
  }

  step () {
    this.t++
    this.relativeT = this.t / this.tLimit
    if (this.t === this.tLimit) {
      this.done = true
    }
  }
}
