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
    this.tileCountY = 20

    this.grid = []
    for (let i = 0; i < this.tileCountY; i++) {
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

  step () {
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
  }

  checkState (rows) {
    let rowsToClear = []
    for (let row of rows) {
      if (this.isFullRow(row)) {
        rowsToClear.push(row)
      }
    }

    rowsToClear.sort((a, b) => b - a)

    if (rowsToClear.length === 0) {
      this.nextTetromino()
    } else {
      this.clearAnimation = new ClearAnimation(this, rowsToClear)
    }
  }

  isFullRow (y) {
    return this.grid[y].every(val => val)
  }

  removeRows (rows) {
    // Rows are sorted from bottom to top
    let index = 0
    for (let y = this.tileCountY - 1; y >= 0; y--) {
      if (y === rows[index]) {
        index++
      }
      else {
        this.grid[y + index] = this.grid[y]
      }
    }
    for (let y = 0; y < index; y++) {
      this.grid[y] = Array(this.tileCountX).fill(0)
    }
  }

  render () {
    Graphics.resetTransform()

    Graphics.fillStyle = '#000'
    Graphics.fillRect(0, 0, Canvas.width, Canvas.height)

    const width = TILE_SIZE * this.tileCountX
    const height = TILE_SIZE * this.tileCountY

    Graphics.translate((Canvas.width - width) / 2, (Canvas.height - height) / 2)

    Graphics.fillStyle = '#fff'
    Graphics.fillRect(-2, -2, width + 4, height + 4)
    Graphics.fillStyle = '#000'
    Graphics.fillRect(0, 0, width, height)

    for (let y = 0; y < this.tileCountY; y++) {
      for (let x = 0; x < this.tileCountX; x++) {
        const color = this.grid[y][x]
        if (color) {
          this.renderBlock(x, y, COLORS[color])
        }
      }
    }

    this.renderTetromino(this.currentTetromino)

    if (this.clearAnimation) {
      this.clearAnimation.render()
    }

    Graphics.translate(width + 25, 15)

    let size = TILE_SIZE * 0.5
    for (let i = 0; i < this.nextTetrominos.length; i++) {
      const tetromino = this.nextTetrominos[i]
      this.renderTetromino(tetromino, size)
      Graphics.translate(0, TILE_SIZE * 1.75)

      if (i === 0) size *= 0.75
    }

    if (this.heldTetromino) {
      Graphics.resetTransform()

      Graphics.translate((Canvas.width - width) / 2 - 40, (Canvas.height - height) / 2 + 18)
      this.renderTetromino(this.heldTetromino, TILE_SIZE * 0.5)
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

  renderTetromino (tetromino, size) {
    const positions = tetromino.getBlockPositions()
    const color = tetromino.getColor()
    for (let [px, py] of positions) {
      this.renderBlock(px, py, color, size)
    }
  }

  renderBlock (x, y, color, size = TILE_SIZE) {
    Graphics.fillStyle = color
    Graphics.fillRect(x * size, y * size, size - 1, size - 1)
    Graphics.fillStyle = 'rgba(255,255,255,0.5)'
    Graphics.fillRect(x * size, y * size, 2, size - 1)
    Graphics.fillRect(x * size, y * size, size - 1, 2)
  }
}
