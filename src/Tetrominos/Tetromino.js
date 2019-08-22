import { COLORS } from '../constants';

export class Tetromino {
  constructor () {
    this.rotation = 0
    this.x = 0
    this.y = 0
  }

  move (dx, dy) {
    this.x += dx
    this.y += dy
  }

  rotateCW () {
    this.rotation = (this.rotation + 1) % 4
  }

  rotateCCW () {
    this.rotation = (this.rotation + 3) % 4
  }

  getBlockPositions () {
    // abstract function
  }

  getWallKicksCW () {
    // abstract function
  }

  getWallKicksCCW () {
    // abstract function
  }
}

export function makeTetromino(id, positions, wallKicks) {
  return class extends Tetromino {
    getId () {
      return id
    }

    getColor () {
      return COLORS[id]
    }

    getBlockPositions () {
      return positions[this.rotation].map(([x, y]) => [this.x + x, this.y + y])
    }

    getWallKicksCW () {
      return wallKicks[this.rotation]
    }

    getWallKicksCCW () {
      return wallKicks[(this.rotation + 3) % 4].map(([x, y]) => [-x, -y])
    }
  }
}
