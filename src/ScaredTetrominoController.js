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

export class ScaredTetrominoController extends TetrominoControllerBase {
  constructor (tetromino, board) {
    super(tetromino, board)
    this.tetromino = tetromino

    this.cachedInstructions = []
    this.timer = 0
    this.cachedInstructionsIndex = 0

    this.timerDuration = currentLevel > 5 ? 1 : 2

    this.manouvered = 0
  }

  step () {
    if (this.done) {
      return
    }

    this.tetromino.eyeDirection = [0, -2]
    this.tetromino.scared = false

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
          this.board.putTetromino(this.tetromino)
          this.done = true
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

    if (this.move(0, 1)) {
      return instructionHistory + MOVE_UP
    }

    if (this.move(-1, 0)) {
      let result = this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + MOVE_LEFT)
      if (result) {
        return result
      }
    }

    reset()

    if (this.move(1, 0)) {
      let result = this.getInstructionsToGetFree(stepsToTry - 1, instructionHistory + MOVE_RIGHT)
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
