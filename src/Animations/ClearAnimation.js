import { Graphics } from '../Graphics';
import { TILE_SIZE } from '../constants';
import { AnimationBase } from './Animation';

export class ClearAnimation extends AnimationBase {
  constructor (level, rows) {
    super(30)

    this.level = level
    this.rows = rows
  }

  render () {
    const margin = this.t < 20 ? this.t : 0
    Graphics.fillStyle = this.t < 20 ? `rgba(255,255,255,${this.t / 15})` : `#000`
    for (let row of this.rows) {
      Graphics.fillRect(-margin, (this.level.tileCountY - 1 - row) * TILE_SIZE, this.level.width + 2 * margin, TILE_SIZE)
    }
  }
}
