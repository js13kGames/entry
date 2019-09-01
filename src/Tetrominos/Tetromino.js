import { COLORS } from '../constants';

export class Tetromino {
  constructor () {
    this.rotation = 0
    this.x = 0
    this.y = 0

    this.scared = false
    this.eyesIndex = 0
    this.eyeDirection = [0, 0]
    this.eyeUpdateTimer = 0
    this.randomness = 0.01
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

  updateEyes () {
    this.eyeUpdateTimer++
    if (this.eyeUpdateTimer > 60 && Math.random() < this.randomness) {
      if (this.eyesIndex) {
        this.eyesIndex = 0
      } else {
        if (Math.random() < 0.4) {
          this.eyeUpdateTimer = 30
          this.randomness = 1
          this.eyesIndex = 1
          return
        }
      }
      this.eyeUpdateTimer = 0
      this.randomness = 0.01
      this.eyeDirection = [Math.random() * 4 - 2, Math.random() * 4 - 2]
    }
  }

  getEyesPosition () {
    return this.getBlockPositions()[1]
  }

  lookDown () {
    this.eyeDirection = [0, 2]
    this.eyeUpdateTimer = 30
    this.randomness = 1
  }

  // getId () {
  //   // abstract function
  // }

  // getColor () {
  //   // abstract function
  // }

  // getBlockPositions () {
  //   // abstract function
  // }

  // getWallKicksCW () {
  //   // abstract function
  // }

  // getWallKicksCCW () {
  //   // abstract function
  // }
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
