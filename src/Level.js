import { Graphics, Canvas } from "./Graphics";
import { TetrominoI } from './Tetrominos/TetrominoI';
import { TetrominoL } from './Tetrominos/TetrominoL';
import { TetrominoJ } from './Tetrominos/TetrominoJ';
import { TetrominoT } from './Tetrominos/TetrominoT';
import { TetrominoO } from './Tetrominos/TetrominoO';
import { TetrominoS } from './Tetrominos/TetrominoS';
import { TetrominoZ } from './Tetrominos/TetrominoZ';
import { TetrominoController } from './TetrominoController';
import { COLORS, TILE_SIZE, KEY_HOLD } from './constants';
import { ClearAnimation } from './ClearAnimation';
import { Input } from './Input';

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
    this.tileCountY = 21

    this.grid = []
    for (let i = 0; i < this.tileCountY + 5; i++) {
      this.grid.push(Array(this.tileCountX).fill(0))
    }

    this.tetrominoSource = new TetrominoSource()
    this.heldTetromino = null
    this.nextTetrominos = Array.from(Array(6), () => this.tetrominoSource.getNext())

    this.nextTetromino()

    this.clearAnimation = null
  }

  get width () {
    return TILE_SIZE * this.tileCountX
  }

  get height () {
    return TILE_SIZE * this.tileCountY
  }

  step () {
    if (this.gameOver) {
      return
    }

    if (this.clearAnimation) {
      this.clearAnimation.step()

      if (this.clearAnimation.done) {
        this.clearAnimation = null
        this.nextTetromino()
      }
      return
    }

    if (Input.getKeyDown(KEY_HOLD) && !this.controller.wasHeld) {
      this.holdTetromino()
      return
    }

    this.controller.step()
    if (this.controller.done) {
      const positions = this.currentTetromino.getBlockPositions()
      const colorId = this.currentTetromino.getId()
      let rows = new Set()
      for (let [px, py] of positions) {
        this.grid[py][px] = colorId
        rows.add(py)
      }

      this.checkState(rows)
    }
    this.updateGhostPosition()
  }

  checkState (rows) {
    let rowsToClear = []
    for (let row of rows) {
      if (this.isFullRow(row)) {
        rowsToClear.push(row)
      }
    }

    rowsToClear.sort((a, b) => a - b)

    if (rowsToClear.length === 0) {
      if (this.overflows()) {
        this.gameOver = true
        return
      }
      this.nextTetromino()
    } else {
      this.clearAnimation = new ClearAnimation(this, rowsToClear)
    }
  }

  updateGhostPosition () {
    const positions = this.currentTetromino.getBlockPositions()
    let maxDeltas = [0, 0, 0, 0]
    for (let i = 0; i < 4; i++) {
      const [x, y] = positions[i]
      for (let delta = 0; delta <= y; delta++) {
        let ghostY = y - delta
        if (!this.grid[ghostY][x]) {
          maxDeltas[i] = delta
        } else {
          break
        }
      }
    }

    this.ghostOffset = -Math.min(...maxDeltas)
  }

  isFullRow (y) {
    return this.grid[y].every(val => val)
  }

  overflows () {
    for (let i = this.tileCountY; i < this.tileCountY + 3; i++) {
      if (this.grid[i].some(val => val)) {
        return true
      }
    }
    return false
  }

  removeRows (rows) {
    // Rows are sorted from bottom to top
    let index = 0
    for (let y = 0; y < this.tileCountY; y++) {
      if (y === rows[index]) {
        index++
      }
      else {
        this.grid[y - index] = this.grid[y]
      }
    }
    for (let y = this.tileCountY - index; y < this.tileCountY; y++) {
      this.grid[y] = Array(this.tileCountX).fill(0)
    }
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

    if (!this.gameOver) {
      this.renderBoard()
    }

    Graphics.translate(width + 25, 0)

    Graphics.fillStyle = '#000'
    Graphics.lineWidth = 2
    Graphics.strokeStyle = '#fff'
    Graphics.strokeRect(-16, 0, 48, 170)

    this.renderNextTetrominos()

    Graphics.resetTransform()

    Graphics.translate((Canvas.width - width) / 2 - 40, (Canvas.height - height) / 2 + 10)
    Graphics.fillText('Hold', 0, 0)

    if (this.heldTetromino) {
      if (this.controller.wasHeld) {
        this.renderGhostTetromino(this.heldTetromino, 0, TILE_SIZE / 2, 2)
        Graphics.fillStyle = 'rgba(0,0,0,0.5)'
        Graphics.fillRect(-TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE * 2, TILE_SIZE * 2)
      } else {
        this.renderTetromino(this.heldTetromino, TILE_SIZE / 2, 2)
      }
    }
  }

  renderBoard () {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.tileCountX; x++) {
        const color = this.grid[y][x]
        if (color) {
          this.renderBlock(x, this.tileCountY - 1 - y, COLORS[color])
        }
      }
    }

    this.renderGhostTetromino(this.currentTetromino, this.ghostOffset, TILE_SIZE, this.tileCountY - 1)
    this.renderTetromino(this.currentTetromino, TILE_SIZE, this.tileCountY - 1)

    if (this.clearAnimation) {
      this.clearAnimation.render()
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
    const heldTetromino = this.heldTetromino
    this.heldTetromino = this.currentTetromino
    this.heldTetromino.x = 0
    this.heldTetromino.y = 0
    this.heldTetromino.rotation = 0
    if (heldTetromino) {
      this.currentTetromino = heldTetromino
      this.controller = new TetrominoController(this.currentTetromino, this)
    } else {
      this.nextTetromino()
    }
    this.controller.wasHeld = true
  }

  nextTetromino () {
    this.currentTetromino = this.nextTetrominos.shift()
    this.nextTetrominos.push(this.tetrominoSource.getNext())

    this.controller = new TetrominoController(this.currentTetromino, this)
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
    Graphics.fillRect(x * size, y * size, 2, size - 1)
    Graphics.fillRect(x * size, y * size, size - 1, 2)
  }

  renderGhostBlock (x, y, color, size = TILE_SIZE) {
    Graphics.fillStyle = color
    Graphics.fillRect(x * size, y * size, size - 1, size - 1)
    Graphics.fillStyle = '#000'
    Graphics.fillRect(x * size + 1, y * size + 1, size - 3, size - 3)
  }
}
