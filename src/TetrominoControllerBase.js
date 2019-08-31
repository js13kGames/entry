import { ACTION_SHIFT, ACTION_ROTATE } from './constants';

export class TetrominoControllerBase {
  constructor (tetromino, board) {
    this.tetromino = tetromino
    this.board = board
  }

  move (dx, dy) {
    this.tetromino.move(dx, dy)
    if (this.invalidState()) {
      this.tetromino.move(-dx, -dy)
      return false
    }
    this.lastMove = ACTION_SHIFT
    return true
  }

  rotateCCW () {
    const wallKicks = this.tetromino.getWallKicksCCW()

    this.tetromino.rotateCCW()

    for (let wallKick of wallKicks) {
      this.tetromino.move(wallKick[0], wallKick[1])
      if (this.validState()) {
        this.lastMove = ACTION_ROTATE
        return true
      }
      this.tetromino.move(-wallKick[0], -wallKick[1])
    }

    this.tetromino.rotateCW()
    return false
  }

  rotateCW () {
    const wallKicks = this.tetromino.getWallKicksCW()

    this.tetromino.rotateCW()

    for (let wallKick of wallKicks) {
      this.tetromino.move(wallKick[0], wallKick[1])
      if (this.validState()) {
        this.lastMove = ACTION_ROTATE
        return true
      }
      this.tetromino.move(-wallKick[0], -wallKick[1])
    }

    this.tetromino.rotateCCW()
    return false
  }

  invalidState () {
    return this.board.invalidPosition(this.tetromino)
  }

  validState () {
    return !this.invalidState()
  }
}
