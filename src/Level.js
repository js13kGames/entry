import { Graphics, Canvas } from "./Graphics";
import { TetrominoI } from './Tetrominos/TetrominoI';
import { TetrominoL } from './Tetrominos/TetrominoL';
import { TetrominoJ } from './Tetrominos/TetrominoJ';
import { TetrominoT } from './Tetrominos/TetrominoT';
import { TetrominoO } from './Tetrominos/TetrominoO';
import { TetrominoS } from './Tetrominos/TetrominoS';
import { TetrominoZ } from './Tetrominos/TetrominoZ';
import { TetrominoController } from './TetrominoController';
import { TILE_SIZE, HOLD, ACTION_ROTATE, T_SPIN_MINI, T_SPIN } from './constants';
import { ClearAnimation } from './ClearAnimation';
import { Input } from './Input';
import { Board } from './Board';
import { GameOverAnimation } from './GameOverAnimation';
import { playSample } from './Audio';
import { LineClearSounds, HoldSound, TSpinSound, AllClearSound, Song1 } from './Assets';
import { resetScore, addToScore, currentScore, resetLineClears, addLineClears, currentLevel, lineClears } from './globals';
import { zeroPad } from './utils';
import { drawText, drawBoldText } from './fontUtils';
import { ScoreAnimation } from './ScoreAnimation';

class TetrominoBag {
  constructor () {
    this.tetrominos = [TetrominoI, TetrominoL, TetrominoJ, TetrominoT, TetrominoO, TetrominoS, TetrominoZ]
    for (let i = 6; i > 1; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = this.tetrominos[j]
      this.tetrominos[j] = this.tetrominos[i]
      this.tetrominos[i] = temp
    }
  }

  pick () {
    return this.tetrominos.pop()
  }
}

class TetrominoSource {
  constructor () {
    this.bag = new TetrominoBag()
  }

  getNext() {
    const Type = this.bag.pick()
    if (!Type) {
      this.bag = new TetrominoBag()
      return this.getNext()
    }

    return new Type()
  }
}

export class Level {
  constructor () {
    this.tileCountX = 10
    this.tileCountY = 20

    this.board = new Board(this.tileCountX, this.tileCountY)

    this.tetrominoSource = new TetrominoSource()
    this.heldTetromino = null
    this.nextTetrominos = Array.from(Array(6), () => this.tetrominoSource.getNext())

    this.nextTetromino()

    resetScore()
    resetLineClears()

    Graphics.font = 'bold 12px monospace'

    this.scoreAnimations = []
  }

  get width () {
    return TILE_SIZE * this.tileCountX
  }

  get height () {
    return TILE_SIZE * this.tileCountY
  }

  step () {
    let previousScore = currentScore
    if (this.clearAnimation) {
      this.clearAnimation.step()

      if (this.clearAnimation.done) {
        this.removeRows(this.clearAnimation.rows)
        this.clearAnimation = null
        this.nextTetromino()
      }
      return
    }

    for (let animation of this.scoreAnimations) {
      animation.step()
    }

    if (this.gameOverAnimation) {
      this.gameOverAnimation.step()
      return
    }

    if (Input.getKeyDown(HOLD) && !this.controller.wasHeld) {
      this.holdTetromino()
      return
    }

    this.controller.step()
    if (this.controller.done) {
      const positions = this.currentTetromino.getBlockPositions()
      let rows = new Set()
      for (let position of positions) {
        rows.add(position[1])
      }

      this.board.putTetromino(this.currentTetromino)

      this.checkState(rows)
    }

    this.updateGhostPosition()

    if (currentScore !== previousScore) {
      this.scoreAnimations.push(new ScoreAnimation(currentScore - previousScore))
      if (this.scoreAnimations.length === 4) {
        this.scoreAnimations.shift()
      }
    }
  }

  getTSpin () {
    if (!(this.currentTetromino instanceof TetrominoT) || this.controller.lastMove !== ACTION_ROTATE) {
      return false
    }

    let x = this.currentTetromino.x
    let y = this.currentTetromino.y

    let corners = [
      this.board.isSolidAt(x - 1, y + 1),
      this.board.isSolidAt(x + 1, y + 1),
      this.board.isSolidAt(x + 1, y - 1),
      this.board.isSolidAt(x - 1, y - 1)
    ]

    let betweens = [
      this.board.isSolidAt(x - 1, y),
      this.board.isSolidAt(x, y + 1),
      this.board.isSolidAt(x + 1, y),
      this.board.isSolidAt(x, y - 1)
    ]

    let emptyCorners =
      !corners[0] +
      !corners[1] +
      !corners[2] +
      !corners[3]

    if (emptyCorners > 1) {
      return false
    }

    const filled = [
      corners[0] + betweens[1] + corners[1],
      corners[1] + betweens[2] + corners[2],
      corners[2] + betweens[3] + corners[3],
      corners[3] + betweens[0] + corners[0]
    ]

    return filled.filter(x => x === 3).length < 2 ? T_SPIN_MINI : T_SPIN
  }

  checkState (rows) {
    let rowsToClear = []
    for (let row of rows) {
      if (this.board.isFullRow(row)) {
        rowsToClear.push(row)
      }
    }

    rowsToClear.sort((a, b) => a - b)

    let tSpinType = this.getTSpin()
    let clearedRowsCount = rowsToClear.length
    let allClear = this.isAllClearConfig(rowsToClear)

    this.updateScore(tSpinType, clearedRowsCount, allClear)

    if (clearedRowsCount === 0) {
      if (this.board.overflows(this.nextTetrominos[0])) {
        this.setGameOver()
        return
      }
      this.nextTetromino()
    } else {
      this.clearAnimation = new ClearAnimation(this, rowsToClear)
    }
  }

  isAllClearConfig (rowsToClear) {
    for (let y = rowsToClear.length; y < rowsToClear.length + 2; y++) {
      if (!this.board.isEmptyRow(y)) {
        return false
      }
    }
    return true
  }

  updateScore (tSpinType, clearedRowsCount, allClear) {
    addLineClears(clearedRowsCount)

    if (tSpinType) {
      playSample(TSpinSound, 1, true)
    }

    if (allClear) {
      playSample(AllClearSound, 1, true)

      addToScore(1500 * currentLevel)
    } else if (clearedRowsCount > 0) {
      playSample(LineClearSounds[clearedRowsCount - 1], 1, true)

      addToScore({
        1: 100,
        2: 300,
        3: 500,
        4: 800
      }[clearedRowsCount] * currentLevel)
    }

    if (tSpinType === T_SPIN) {
      addToScore(currentLevel * 400 * 2 ** clearedRowsCount)
    } else if (tSpinType === T_SPIN_MINI) {
      addToScore(currentLevel * (clearedRowsCount + 1) * 100)
    }
  }

  setGameOver () {
    this.gameOverAnimation = new GameOverAnimation(this)
    Song1.stop()
  }

  updateGhostPosition () {
    const positions = this.currentTetromino.getBlockPositions()
    let maxDeltas = [0, 0, 0, 0]
    for (let i = 0; i < 4; i++) {
      const [x, y] = positions[i]
      for (let delta = 0; delta <= y; delta++) {
        let ghostY = y - delta
        if (!this.board.getItemAt(x, ghostY)) {
          maxDeltas[i] = delta
        } else {
          break
        }
      }
    }

    this.ghostOffset = -Math.min(...maxDeltas)
  }

  removeRows (rows) {
    this.board.clearRows(rows)
  }

  render () {
    // So that closure compiler recognizes it as an extern
    Graphics['resetTransform']()

    Graphics.fillStyle = '#000'
    Graphics.fillRect(0, 0, Canvas.width, Canvas.height)

    const width = TILE_SIZE * this.tileCountX
    const height = TILE_SIZE * this.tileCountY

    Graphics.translate((Canvas.width - width) / 2, (Canvas.height - height) / 2)

    Graphics.fillStyle = '#fff'
    Graphics.fillRect(-2, -2, width + 4, height + 4)
    Graphics.fillStyle = '#000'
    Graphics.fillRect(0, 0, width, height)

    this.renderBoard()

    Graphics.translate(width + 25, 0)

    Graphics.fillStyle = '#000'
    Graphics.lineWidth = 2
    Graphics.strokeStyle = '#fff'
    Graphics.strokeRect(-16, 0, 48, 170)

    drawText(`LEVEL`, -17, 190)
    drawBoldText(`\n${zeroPad(currentLevel, 2)}`, -15, 190)
    drawText(`LINES`, -17, 224)
    drawBoldText(`\n${zeroPad(lineClears, 4)}`, -15, 224)

    drawText(`SCORE`, -17, 300)
    Graphics.scale(2, 2)
    drawBoldText(`\n${zeroPad(currentScore, 9)}`, -8, 148)

    for (let animation of this.scoreAnimations) {
      animation.render(10, 148)
    }

    Graphics.scale(0.5, 0.5)

    this.renderNextTetrominos()

    Graphics['resetTransform']()

    Graphics.translate((Canvas.width - width) / 2 - 40, (Canvas.height - height) / 2 + 10)
    drawBoldText(`HOLD`, -8, -8)

    if (this.heldTetromino) {
      if (this.controller.wasHeld) {
        this.renderGhostTetromino(this.heldTetromino, 0, TILE_SIZE / 2, 2)
        Graphics.fillStyle = 'rgba(0,0,0,0.5)'
        Graphics.fillRect(-TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE * 2, TILE_SIZE)
      } else {
        this.renderTetromino(this.heldTetromino, TILE_SIZE / 2, 2)
      }
    }
  }

  renderBoard () {
    for (let y = 0; y < this.board.height; y++) {
      for (let x = 0; x < this.board.width; x++) {
        const color = this.board.getColorAt(x, y)
        if (color) {
          this.renderBlock(x, this.tileCountY - 1 - y, color)
        }
      }
    }

    if (!this.gameOverAnimation) {
      this.renderGhostTetromino(this.currentTetromino, this.ghostOffset, TILE_SIZE, this.tileCountY - 1)
      this.renderTetromino(this.currentTetromino, TILE_SIZE, this.tileCountY - 1)
    }

    if (this.clearAnimation) {
      this.clearAnimation.render()
    }

    if (this.gameOverAnimation) {
      this.gameOverAnimation.render()
    }
  }

  renderNextTetrominos () {
    let size = TILE_SIZE * 0.5
    for (let i = 0; i < this.nextTetrominos.length; i++) {
      const tetromino = this.nextTetrominos[i]
      this.renderTetromino(tetromino, size, 3)

      if (i === 0) {
        Graphics.translate(0, size * 5)
        size *= 0.75
      } else {
        Graphics.translate(0, size * 4)
      }
    }
  }

  holdTetromino () {
    if (this.heldTetromino && this.board.overflows(this.heldTetromino)) {
      this.setGameOver()
      return
    }

    playSample(HoldSound)

    const heldTetromino = this.heldTetromino
    this.heldTetromino = this.currentTetromino
    this.heldTetromino.x = 0
    this.heldTetromino.y = 0
    this.heldTetromino.rotation = 0
    if (heldTetromino) {
      this.currentTetromino = heldTetromino
      this.controller = new TetrominoController(this.currentTetromino, this.board)
    } else {
      this.nextTetromino()
    }
    this.controller.wasHeld = true
  }

  nextTetromino () {
    this.currentTetromino = this.nextTetrominos.shift()
    this.nextTetrominos.push(this.tetrominoSource.getNext())

    this.controller = new TetrominoController(this.currentTetromino, this.board)
  }

  renderTetromino (tetromino, size, bottom) {
    const positions = tetromino.getBlockPositions()
    const color = tetromino.getColor()
    for (let [px, py] of positions) {
      this.renderBlock(px, bottom - py, color, size)
    }
  }

  renderGhostTetromino (tetromino, offset, size, bottom) {
    const positions = tetromino.getBlockPositions()
    const color = tetromino.getColor()

    positions.forEach(el => el[1] += offset)
    for (let [px, py] of positions) {
      this.renderGhostBlock(px, bottom - py, color, size)
    }
  }

  renderBlock (x, y, color, size = TILE_SIZE) {
    Graphics.fillStyle = color
    Graphics.fillRect(x * size, y * size, size - 1, size - 1)
    Graphics.fillStyle = 'rgba(255,255,255,0.5)'
    Graphics.fillRect(x * size, y * size, 2, size)
    Graphics.fillRect(x * size, y * size, size, 2)
  }

  renderGhostBlock (x, y, color, size = TILE_SIZE) {
    Graphics.fillStyle = color
    Graphics.fillRect(x * size, y * size, size - 1, size - 1)
    Graphics.fillStyle = '#000'
    Graphics.fillRect(x * size + 1, y * size + 1, size - 3, size - 3)
  }
}
