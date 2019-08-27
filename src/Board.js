import { Tetromino } from './Tetrominos/Tetromino';
import { COLORS } from './constants';

export class Board {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.heightWithMargin = this.height + 4

    this.grid = []
    for (let i = 0; i < this.heightWithMargin; i++) {
      this.grid.push(Array(this.width).fill(0))
    }

    this.tetrominoes = new Set()
  }

  isSolidAt (x, y) {
    return !!this.getItemAt(x, y)
  }

  getItemAt (x, y) {
    if (x < 0 || x >= this.width || y < 0) {
      return 1 // "something"
    }
    return this.grid[y][x]
  }

  getColorAt (x, y) {
    const item = this.grid[y][x]
    if (item instanceof Tetromino) {
      return item.getColor()
    }
    return COLORS[item]
  }

  isEmptyRow (y) {
    return this.grid[y].every(val => !val)
  }

  isFullRow (y) {
    return this.grid[y].every(val => val)
  }

  overflows (nextTetromino) {
    // Overflows are allowed, but only with at most 2 blocks, and if they don't overlap the next tetromino
    if (this.grid[this.height + 2].some(val => val)) {
      return true
    }

    const positions = nextTetromino.getBlockPositions()
    for (let [px, py] of positions) {
      px += this.width / 2 - 1
      py += this.height

      if (this.grid[py][px]) {
        return true
      }
    }

    return false
  }

  putTetromino (tetromino) {
    this.tetrominoes.add(tetromino)
    for (let [px, py] of tetromino.getBlockPositions()) {
      this.grid[py][px] = tetromino
    }
  }

  clearRows (rows) {
    rows.sort((a, b) => a - b)

    this.changeTetrominosToBlocks(rows)

    let tetrominosToMove = new Map()

    let index = 0
    for (let y = 0; y < this.heightWithMargin; y++) {
      if (y === rows[index]) {
        index++
      }
      else {
        for (let x = 0; x < this.width; x++) {
          const item = this.grid[y][x]
          if (item instanceof Tetromino) {
            tetrominosToMove.set(item, index)
          }
        }
        this.grid[y - index] = this.grid[y]
      }
    }

    for (let [tetromino, delta] of tetrominosToMove) {
      tetromino.y -= delta
    }

    for (let y = this.height - index; y < this.height; y++) {
      this.grid[y] = Array(this.width).fill(0)
    }
  }

  changeTetrominosToBlocks (rows) {
    for (let y of rows) {
      for (let x = 0; x < this.width; x++) {
        const item = this.grid[y][x]
        if (item instanceof Tetromino) {
          this.grid[y][x] = item.getId()
          this.tetrominoes.delete(item)
        }
      }
    }
  }

  emptyRow (y) {
    this.grid[y].fill(0)
  }
}
