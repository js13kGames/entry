import { Input } from './Input';
import {
  ROTATE_CCW,
  MOVE_LEFT,
  MOVE_RIGHT,
  ROTATE_CW,
  SOFT_DROP,
  HARD_DROP,
  AUTO_SHIFT_DELAY,
  AUTO_REPEAT_DELAY,
  MAX_LOCK_RESET_COUNT,
  LOCK_DELAY,
  ACTION_ROTATE
} from './constants';
import { TetrominoO } from './Tetrominos/TetrominoO';
import { playSample } from './Audio';
import {
  RotateSound,
  LandSound,
  LockSound,
  ShiftSound,
  HardDropSound
} from './Assets';
import { addToScore, lineClears } from './globals';
import { TetrominoControllerBase } from './TetrominoControllerBase';

export class TetrominoController extends TetrominoControllerBase {
  constructor (tetromino, board) {
    super (tetromino, board)

    this.tetromino.x = board.width / 2 - 1
    this.tetromino.y = board.height - 2

    while (this.invalidState()) {
      this.tetromino.move(0, 1)
    }

    this.inputDelayTimer = Input.getKey(MOVE_LEFT) || Input.getKey(MOVE_RIGHT) ? 0 : AUTO_SHIFT_DELAY
    this.repeatTimer = 0
    this.updateGravity()

    this.lockResetCount = 0
    this.lockResetY = 1000
    this.lockTimer = -1

    this.dropTimer = this.gravity
    this.manualDropTimer = 0

    this.lastOnFloor = false
    this.lastMove = null
  }

  updateGravity () {
    this.gravity = 60 * (0.8 - ((lineClears / 10) * 0.007)) ** (lineClears / 10)
  }

  step () {
    this.updateGravity()

    let prevX = this.tetromino.x
    let prevRotation = this.tetromino.rotation

    this.handleMovement()
    this.handleRotation()
    this.handleFall()

    const onFloor = this.onFloor()

    if (onFloor && !this.lastOnFloor) {
      playSample(LandSound)
    }

    if (!onFloor) {
      this.lockTimer = 0
    }

    if (onFloor && (prevX !== this.tetromino.x || prevRotation !== this.tetromino.rotation)) {
      this.delayLock()
    }

    if (onFloor && this.lockTimer <= 0) {
      this.delayLock()
    }

    if (this.lockTimer > 0) {
      this.lockTimer--

      if (!onFloor) {
        this.lockTimer = 0
      } else if (this.lockTimer === 0) {
        this.lock()
      }
    }

    this.lastOnFloor = onFloor
  }

  delayLock () {
    if (this.lockResetCount < MAX_LOCK_RESET_COUNT) {
      this.lockTimer = LOCK_DELAY
      this.lockResetCount++
    } else {
      this.lock()
    }
  }

  lock () {
    playSample(LockSound)
    this.done = true
  }

  handleMovement () {
    let dx = Input.getKey(MOVE_LEFT) ? -1 : Input.getKey(MOVE_RIGHT) ? 1 : 0

    if (!dx) {
      return
    }

    if (Input.getKeyDown(MOVE_LEFT) || Input.getKeyDown(MOVE_RIGHT)) {
      this.move(dx, 0) && playSample(ShiftSound)
      this.inputDelayTimer = AUTO_SHIFT_DELAY
    } else {
      if (this.inputDelayTimer <= 0) {
        if (this.repeatTimer <= 0) {
          this.move(dx, 0) && playSample(ShiftSound)
          this.repeatTimer = AUTO_REPEAT_DELAY
        }
      }
    }

    this.inputDelayTimer--
    this.repeatTimer--
  }

  handleRotation () {
    const noActualRotation = this.tetromino instanceof TetrominoO

    if (Input.getKeyDown(ROTATE_CCW)) {
      (noActualRotation || this.rotateCCW()) && playSample(RotateSound)
    } else if (Input.getKeyDown(ROTATE_CW)) {
      (noActualRotation || this.rotateCW()) && playSample(RotateSound)
    }
  }

  handleFall () {
    if (Input.getKeyDown(HARD_DROP)) {
      this.hardDrop()
      return
    }

    let dropAmount = 0
    if (Input.getKeyDown(SOFT_DROP)) {
      this.manualDropTimer = 0
    }

    let manualDrop = false

    if (this.gravity < 1 / this.board.height) {
      dropAmount = this.board.height
    } else {
      manualDrop = Input.getKey(SOFT_DROP)

      if (manualDrop) {
        this.manualDropTimer--
        while (this.manualDropTimer <= 0) {
          dropAmount++
          this.manualDropTimer += this.gravity / 30
        }
      }

      this.dropTimer--
      while (this.dropTimer <= 0) {
        if (!manualDrop) {
          dropAmount++
        }
        this.dropTimer += this.gravity
      }
    }

    let actualDropAmount = 0
    for (let i = 0; i < dropAmount; i++) {
      if (!this.move(0, -1)) {
        break
      }
      actualDropAmount++
    }

    if (actualDropAmount > 0) {
      if (this.lockResetCount > 0) {
        this.lockResetCount--
      }
      if (manualDrop) {
        addToScore(actualDropAmount)
        playSample(ShiftSound)
      }
    }
  }

  hardDrop () {
    let dropCount = 0
    while (true) {
      if (!this.move(0, -1)) {
        break
      }
      dropCount++
    }
    addToScore(dropCount * 2)
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
}
