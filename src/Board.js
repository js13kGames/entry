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

    nextTetromino.x = this.width / 2 - 1
    nextTetromino.y = this.height
    const positions = nextTetromino.getBlockPositions()
    for (let [x, y] of positions) {
      if (this.grid[y][x]) {
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

  removeTetromino (tetromino) {
    this.tetrominoes.delete(tetromino)
    for (let [px, py] of tetromino.getBlockPositions()) {
      this.grid[py][px] = 0
    }
  }

  clearRows (rows) {
    rows.sort((a, b) => a - b)

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

    for (let y = this.heightWithMargin - index; y < this.heightWithMargin; y++) {
      this.grid[y] = Array(this.width).fill(0)
    }
  }

  getTetrominoesInRows (rows) {
    let tetrominoes = new Set()
    for (let y of rows) {
      for (let x = 0; x < this.width; x++) {
        const item = this.grid[y][x]
        if (item instanceof Tetromino) {
          tetrominoes.add(item)
        }
      }
    }
    return tetrominoes
  }

  changeTetrominosToBlocks (tetrominoes) {
    for (let tetromino of tetrominoes) {
      for (let [x, y] of tetromino.getBlockPositions()) {
        this.grid[y][x] = tetromino.getId()
      }
      this.tetrominoes.delete(tetromino)
    }
  }

  emptyRow (y) {
    this.grid[y].fill(0)
  }

  invalidPosition (tetromino) {
    for (let [x, y] of tetromino.getBlockPositions()) {
      if (x < 0 || x >= this.width || y < 0) {
        return true
      }
      if (y >= this.grid.length) {
        continue
      }
      const item = this.grid[y][x]
      if (item && item !== tetromino) {
        return true
      }
    }
    return false
  }
}
