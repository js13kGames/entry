import { TetrominoControllerBase } from './TetrominoControllerBase';
import { TetrominoO } from './Tetrominoes/TetrominoO';
import { playSample } from './Audio';
import { RotateSound, ShiftSound } from './Assets';
import { addToScore, currentLevel } from './globals';

const MOVE_UP = '1'
const MOVE_LEFT = '2'
const MOVE_RIGHT = '3'
const ROTATE_CW = '4'
const ROTATE_CCW = '5'

const dirMapping = {
  '-1': MOVE_LEFT,
  '1': MOVE_RIGHT
}

export class ScaredTetrominoController extends TetrominoControllerBase {
  constructor (tetromino, board) {
    super(tetromino, board)

    this.cachedInstructions = []
    this.timer = 0
    this.cachedInstructionsIndex = 0

    this.timerDuration = currentLevel > 5 ? 1 : 2

    this.manouvered = 0
    this.lastDirection = 1
  }

  handleTetromino () {
    if (this.done) {
      return
    }

    this.tetromino.fleeing = true

    this.timer++
    if (this.timer === this.timerDuration) {
      this.timer = 0

      this.escape()
    }
  }

  escape () {
    addToScore(-currentLevel * 5)
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
    } else {
      if (!this.move(0, 1)) {
        if (this.manouvered > 10) {
          this.tetromino.fleeing = false
          this.done = true
          return
        }

        this.manouvered++
        this.cachedInstructionsIndex = 0
        this.cachedInstructions = this.getInstructionsToGetFree()
        return
      } else {
        playSample(ShiftSound)
      }
    }

    if (this.tetromino.y > this.board.height) {
      this.done = true
      this.removeTetromino = true
    }
  }

  isFreeableTetromino () {
    let originalStateX = this.tetromino.x
    let originalStateY = this.tetromino.y
    let originalStateRotation = this.tetromino.rotation

    this.cachedInstructions = this.getInstructionsToGetFree()

    this.tetromino.x = originalStateX
    this.tetromino.y = originalStateY
    this.tetromino.rotation = originalStateRotation

    return !!this.cachedInstructions
  }

  getInstructionsToGetFree (stepsToTry = 5, instructionHistory = '') {
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

    if (this.tetromino.fleeing && this.move(0, 1)) {
      return instructionHistory + MOVE_UP
    }

    reset()

    if (this.move(0, 1)) {
      let result = this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + MOVE_UP)
      if (result) {
        return result
      }
    }

    reset()

    if (this.move(this.lastDirection, 0)) {
      let result = this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + dirMapping[this.lastDirection])
      if (result) {
        return result
      }
    }

    reset()

    if (this.move(-this.lastDirection, 0)) {
      this.lastDirection = -this.lastDirection
      let result = this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + dirMapping[this.lastDirection])
      if (result) {
        return result
      }
    }

    reset()

    if (!(this.tetromino instanceof TetrominoO)) {
      if (this.rotateCCW()) {
        let result = this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + ROTATE_CCW)
        if (result) {
          return result
        }
      }

      reset()

      if (this.rotateCW()) {
        let result = this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + ROTATE_CW)
        if (result) {
          return result
        }
      }

      reset()
    }

    return ''
  }
}
