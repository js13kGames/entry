import { TetrominoControllerBase } from './TetrominoControllerBase';
import { TetrominoO } from './Tetrominos/TetrominoO';
import { playSample } from './Audio';
import { RotateSound, ShiftSound } from './Assets';

const MOVE_UP = '1'
const MOVE_LEFT = '2'
const MOVE_RIGHT = '3'
const ROTATE_CW = '4'
const ROTATE_CCW = '5'

export class ScaredTetrominoController extends TetrominoControllerBase {
  constructor (tetromino, board) {
    super(tetromino, board)
    this.tetromino = tetromino

    this.cachedInstructions = []
    this.timer = 0
    this.cachedInstructionsIndex = 0
  }

  step () {
    if (this.done) {
      return
    }

    this.timer++
    if (this.timer === 3) {
      this.timer = 0

      this.escape()
    }
  }

  escape () {
    if (this.cachedInstructionsIndex < this.cachedInstructions.length) {
      switch (this.cachedInstructions[this.cachedInstructionsIndex]) {
        case MOVE_UP:
          this.move(0, 1)
          playSample(ShiftSound)
          break
        case MOVE_LEFT:
          this.move(-1, 0)
          playSample(ShiftSound)
          break
        case MOVE_RIGHT:
          this.move(1, 0)
          playSample(ShiftSound)
          break
        case ROTATE_CW:
          this.rotateCW()
          playSample(RotateSound)
          break
        case ROTATE_CCW:
          this.rotateCCW()
          playSample(RotateSound)
          break
      }
      this.cachedInstructionsIndex++
    }

    if (!this.move(0, 1)) {
      this.done = true
    } else {
      playSample(ShiftSound)
    }

    if (this.tetromino.y > this.board.height) {
      this.done = true
    }
  }

  isFreeableTetromino () {
    let currentStateX = this.tetromino.x
    let currentStateY = this.tetromino.y
    let currentStateRotation = this.tetromino.rotation

    this.cachedInstructions = this.getInstructionsToGetFree()

    this.tetromino.x = currentStateX
    this.tetromino.y = currentStateY
    this.tetromino.rotation = currentStateRotation

    return !!this.cachedInstructions
  }

  getInstructionsToGetFree (stepsToTry = 3, instructionHistory = '') {
    if (stepsToTry === 0) {
      return ''
    }

    let currentStateX = this.tetromino.x
    let currentStateY = this.tetromino.y
    let currentStateRotation = this.tetromino.rotation

    let reset = () => {
      this.tetromino.x = currentStateX
      this.tetromino.y = currentStateY
      this.tetromino.rotation = currentStateRotation
    }

    if (this.move(0, 1) && this.move(0, 1)) {
      return instructionHistory + MOVE_UP + MOVE_UP
    }

    reset()

    if (this.move(-1, 0)) {
      if (this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + MOVE_LEFT)) {
        return instructionHistory
      }
    }

    reset()

    if (this.move(1, 0)) {
      if (this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + MOVE_RIGHT)) {
        return instructionHistory
      }
    }

    reset()

    if (!(this.tetromino instanceof TetrominoO)) {
      if (this.rotateCCW()) {
        if (this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + ROTATE_CCW)) {
          return instructionHistory
        }
      }

      reset()

      if (this.rotateCW()) {
        if (this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + ROTATE_CW)) {
          return instructionHistory
        }
      }

      reset()
    }

    return ''
  }
}
