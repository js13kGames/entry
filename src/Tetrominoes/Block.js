import { GRAY_COLORS, COLORS } from '../constants'

export class Block {
  constructor (colorId) {
    this.colorId = colorId
    this.dead = 0
  }

  getColor () {
    return this.dead ? GRAY_COLORS[this.colorId] : COLORS[this.colorId]
  }

  step () {
    this.dead = 1
  }
}
