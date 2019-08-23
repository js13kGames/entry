import { Input } from './Input';
import { KEY_ROTATE_CCW, KEY_LEFT, KEY_RIGHT, KEY_ROTATE_CW, KEY_DOWN, KEY_UP } from './constants';
import { TetrominoO } from './Tetrominos/TetrominoO';

export class TetrominoController {
  constructor (tetromino, level) {
    this.tetromino = tetromino
    this.tetromino.x = level.tileCountX / 2 - 1
    this.tetromino.y = level.tileCountY - 2
    this.level = level

    while (this.invalidState()) {
      this.tetromino.move(0, 1)
    }

    this.inputDelayTimer = Input.getKey(KEY_LEFT) || Input.getKey(KEY_RIGHT) ? 0 : 15
    this.repeatTimer = 0
    this.gravity = 1
    this.dropTimer = 60
    this.manualDropTimer = 0

    this.extendedLockTimer = false
    this.lockTimer = -1
  }

  step () {
    this.actuallyMoved = false

    this.handleMovement()
    this.handleRotation()

    if (this.actuallyMoved && this.extendedLockTimer < 14) {
      this.lockTimer = 30
      this.extendedLockTimer++
    }

    if (Input.getKeyDown(KEY_UP)) {
      this.drop()
      return
    }

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
      this.move(0, -1)

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

  handleMovement () {
    let dx = Input.getKey(KEY_LEFT) ? -1 : Input.getKey(KEY_RIGHT) ? 1 : 0

    if (!dx) {
      return
    }

    if (Input.getKeyDown(KEY_LEFT) || Input.getKeyDown(KEY_RIGHT)) {
      this.actuallyMoved = this.move(dx, 0)
      this.inputDelayTimer = 15
    } else {
      if (this.inputDelayTimer <= 0) {
        if (this.repeatTimer <= 0) {
          this.actuallyMoved = this.move(dx, 0)
          this.repeatTimer = 2
        }
      }
    }

    this.inputDelayTimer--
    this.repeatTimer--
  }

  handleRotation () {
    if (this.tetromino instanceof TetrominoO) {
      return
    }

    if (Input.getKeyDown(KEY_ROTATE_CCW)) {
      this.actuallyMoved = this.rotateCCW() || this.actuallyMoved
    } else if (Input.getKeyDown(KEY_ROTATE_CW)) {
      this.actuallyMoved = this.rotateCW() || this.actuallyMoved
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

  drop () {
    let collided
    do {
      collided = !this.move(0, -1)
    } while (!collided)
    this.done = true
  }

  onFloor () {
    let collided = !this.move(0, -1)
    if (collided) {
      return true
    } else {
      this.move(0, 1)
    }
  }

  rotateCCW () {
    const wallKicks = this.tetromino.getWallKicksCCW()

    this.tetromino.rotateCCW()

    for (let wallKick of wallKicks) {
      this.tetromino.move(wallKick[0], wallKick[1])
      if (this.validState()) {
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
        return true
      }
      this.tetromino.move(-wallKick[0], -wallKick[1])
    }

    this.tetromino.rotateCCW()
    return false
  }

  invalidState () {
    for (let [x, y] of this.tetromino.getBlockPositions()) {
      if (x < 0 || x >= this.level.tileCountX || y < 0 || this.level.grid[y][x]) {
        return true
      }
    }
    return false
  }

  validState () {
    return !this.invalidState()
  }
}
