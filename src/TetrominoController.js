import { Input } from './Input';
import { KEY_ROTATE_CCW, KEY_LEFT, KEY_RIGHT, KEY_ROTATE_CW, KEY_DOWN } from './constants';
import { TetrominoO } from './Tetrominos/TetrominoO';

export class TetrominoController {
  constructor (tetromino, level) {
    this.tetromino = tetromino
    this.tetromino.x = 4
    this.tetromino.y = 1
    this.level = level

    this.inputDelayTimer = Input.getKey(KEY_LEFT) || Input.getKey(KEY_RIGHT) ? 0 : 15
    this.repeatTimer = 0
    this.gravity = 1
    this.dropTimer = 60
    this.manualDropTimer = 0

    this.extendedLockTimer = false
    this.lockTimer = -1
  }

  step () {
    let dx = Input.getKey(KEY_LEFT) ? -1 : Input.getKey(KEY_RIGHT) ? 1 : 0
    if (dx) {
      let actuallyMoved = false
      if (Input.getKeyDown(KEY_LEFT) || Input.getKeyDown(KEY_RIGHT)) {
        actuallyMoved = this.move(dx, 0)
        this.inputDelayTimer = 15
      } else {
        if (this.inputDelayTimer <= 0) {
          if (this.repeatTimer <= 0) {
            actuallyMoved = this.move(dx, 0)
            this.repeatTimer = 2
          }
        }
      }

      if (actuallyMoved && this.extendedLockTimer < 4) {
        this.lockTimer = 30
        this.extendedLockTimer++
      }

      this.inputDelayTimer--
      this.repeatTimer--
    }

    this.handleRotation()

    let shouldDrop = false
    if (Input.getKeyDown(KEY_DOWN)) {
      this.manualDropTimer = 0
    }

    if (Input.getKey(KEY_DOWN)) {
      this.manualDropTimer -= Math.max(20, this.gravity)
      if (this.manualDropTimer < 0) {
        shouldDrop = true
        this.manualDropTimer += 60
      }
    }

    this.dropTimer -= this.gravity
    if (this.dropTimer <= 0) {
      if (!Input.getKey(KEY_DOWN)) {
        shouldDrop = true
      }
      this.dropTimer += 60
    }

    if (shouldDrop) {
      this.move(0, 1)

      if (this.onFloor() && this.lockTimer <= 0) {
        this.lockTimer = 30
      }
    }

    if (this.lockTimer > 0) {
      this.lockTimer--

      const onFloor = this.onFloor()
      if (!onFloor) {
        this.lockTimer = 0
        this.extendedLockTimer = 0
      } else if (this.lockTimer === 0) {
        this.done = true
      }
    }
  }

  handleRotation () {
    if (!(this.tetromino instanceof TetrominoO)) {
      if (Input.getKeyDown(KEY_ROTATE_CCW)) {
        this.rotateCCW()
      } else if (Input.getKeyDown(KEY_ROTATE_CW)) {
        this.rotateCW()
      }
    }
  }

  move (dx, dy) {
    this.tetromino.move(dx, dy)
    if (this.invalidState()) {
      this.tetromino.move(-dx, -dy)
      return false
    }
    return true
  }

  onFloor () {
    let collided = !this.move(0, 1)
    if (collided) {
      return true
    } else {
      this.move(0, -1)
    }
  }

  rotateCCW () {
    const wallKicks = this.tetromino.getWallKicksCCW()

    this.tetromino.rotateCCW()

    for (let wallKick of wallKicks) {
      this.tetromino.move(wallKick[0], wallKick[1])
      if (this.validState()) {
        return
      }
      this.tetromino.move(-wallKick[0], -wallKick[1])
    }

    this.tetromino.rotateCW()
  }

  rotateCW () {
    const wallKicks = this.tetromino.getWallKicksCW()

    this.tetromino.rotateCW()

    for (let wallKick of wallKicks) {
      this.tetromino.move(wallKick[0], wallKick[1])
      if (this.validState()) {
        return
      }
      this.tetromino.move(-wallKick[0], -wallKick[1])
    }

    this.tetromino.rotateCCW()
  }

  invalidState () {
    for (let [x, y] of this.tetromino.getBlockPositions()) {
      if (x < 0 || x >= this.level.tileCountX || y >= this.level.tileCountY || this.level.grid[y][x]) {
        return true
      }
    }
    return false
  }

  validState () {
    return !this.invalidState()
  }
}
