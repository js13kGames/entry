import { Graphics } from './Graphics';
import { TILE_SIZE } from './constants';

export class ClearAnimation {
  constructor (level, rows) {
    this.level = level
    this.rows = rows

    this.t = 0
  }

  step () {
    this.t++
    if (this.t >= 30) {
      this.done = true
    }
  }

  render () {
    const margin = this.t < 20 ? this.t : 0
    Graphics.fillStyle = this.t < 20 ? `rgba(255,255,255,${this.t / 15})` : `#000`
    for (let row of this.rows) {
      Graphics.fillRect(-margin, (this.level.tileCountY - 1 - row) * TILE_SIZE, this.level.width + 2 * margin, TILE_SIZE)
    }
  }
}
