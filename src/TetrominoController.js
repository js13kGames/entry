import { Input } from './Input';
import { KEY_ROTATE_CCW, KEY_LEFT, KEY_RIGHT, KEY_ROTATE_CW, KEY_DOWN, KEY_UP, AUTO_SHIFT_DELAY, AUTO_REPEAT_DELAY, MAX_LOCK_RESET_COUNT, LOCK_DELAY, ACTION_ROTATE, ACTION_SHIFT } from './constants';
import { TetrominoO } from './Tetrominos/TetrominoO';
import { playSample } from './Audio';
import {
  RotateSound,
  LandSound,
  LockSound,
  ShiftSound,
  HardDropSound
} from './Assets';

export class TetrominoController {
  constructor (tetromino, board) {
    this.tetromino = tetromino
    this.tetromino.x = board.width / 2 - 1
    this.tetromino.y = board.height - 2
    this.board = board

    while (this.invalidState()) {
      this.tetromino.move(0, 1)
    }

    this.inputDelayTimer = Input.getKey(KEY_LEFT) || Input.getKey(KEY_RIGHT) ? 0 : AUTO_SHIFT_DELAY
    this.repeatTimer = 0
    this.gravity = 1

    this.lockResetCount = 0
    this.lockTimer = -1

    this.dropTimer = 60 / this.gravity
    this.manualDropTimer = 0

    this.lastOnFloor = false
    this.lastMove = null
  }

  step () {
    this.actuallyMoved = false

    this.handleMovement()
    this.handleRotation()

    if (this.actuallyMoved && this.lockResetCount < MAX_LOCK_RESET_COUNT) {
      this.delayLock()
      this.lockResetCount++
    }

    if (Input.getKeyDown(KEY_UP)) {
      this.drop()
      return
    }

    let dropAmount = 0
    if (Input.getKeyDown(KEY_DOWN)) {
      this.manualDropTimer = 0
    }

    let manualDrop = Input.getKey(KEY_DOWN)

    if (manualDrop) {
      this.manualDropTimer--
      while (this.manualDropTimer <= 0) {
        dropAmount++
        this.manualDropTimer += 2 / this.gravity
      }
    }

    if (--this.dropTimer <= 0) {
      if (!manualDrop) {
        dropAmount++
      }
      this.dropTimer = 60 / this.gravity
    }

    if (dropAmount > 0) {
      for (let i = 0; i < dropAmount; i++) {
        this.move(0, -1)
      }
    }

    if (this.onFloor() && this.lockTimer <= 0) {
      this.delayLock()
    }

    const onFloor = this.onFloor()

    if (this.lockTimer > 0) {
      this.lockTimer--

      if (!onFloor) {
        this.lockTimer = 0
        this.lockResetCount = 0
      } else {
        if (!this.lastOnFloor) {
          playSample(LandSound)
        }
        if (this.lockTimer === 0) {
          this.lock()
        }
      }
    }

    this.lastOnFloor = onFloor
  }

  delayLock () {
    this.lockTimer = LOCK_DELAY
  }

  lock () {
    playSample(LockSound)
    this.done = true
  }

  handleMovement () {
    let dx = Input.getKey(KEY_LEFT) ? -1 : Input.getKey(KEY_RIGHT) ? 1 : 0

    if (!dx) {
      return
    }

    if (Input.getKeyDown(KEY_LEFT) || Input.getKeyDown(KEY_RIGHT)) {
      this.actuallyMoved = this.move(dx, 0)
      this.inputDelayTimer = AUTO_SHIFT_DELAY

      if (this.actuallyMoved) {
        playSample(ShiftSound)
      }
    } else {
      if (this.inputDelayTimer <= 0) {
        if (this.repeatTimer <= 0) {
          this.actuallyMoved = this.move(dx, 0)
          this.repeatTimer = AUTO_REPEAT_DELAY

          if (this.actuallyMoved) {
            playSample(ShiftSound)
          }
        }
      }
    }

    this.inputDelayTimer--
    this.repeatTimer--
  }

  handleRotation () {
    const noActualRotation = this.tetromino instanceof TetrominoO

    if (Input.getKeyDown(KEY_ROTATE_CCW)) {
      this.rotated = true
      playSample(RotateSound)
      if (!noActualRotation) {
        this.actuallyMoved = this.rotateCCW() || this.actuallyMoved
      }

    } else if (Input.getKeyDown(KEY_ROTATE_CW)) {
      this.rotated = true
      playSample(RotateSound)
      if (!noActualRotation) {
        this.actuallyMoved = this.rotateCW() || this.actuallyMoved
      }
    }
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

  drop () {
    let collided
    do {
      collided = !this.move(0, -1)
    } while (!collided)
    playSample(HardDropSound)
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
    for (let [x, y] of this.tetromino.getBlockPositions()) {
      if (x < 0 || x >= this.board.width || y < 0 || this.board.getItemAt(x, y)) {
        return true
      }
    }
    return false
  }

  validState () {
    return !this.invalidState()
  }
}
