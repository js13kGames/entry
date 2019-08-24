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

  getItemAt (x, y) {
    return this.grid[y][x]
  }

  getColorAt (x, y) {
    const item = this.grid[y][x]
    if (item instanceof Tetromino) {
      return item.getColor()
    }
    return COLORS[item]
  }

  isFullRow (y) {
    return this.grid[y].every(val => val)
  }

  overflows () {
    // Overflows outside the middle 4 columns are allowed, but only with at most 2 blocks
    if (this.grid[this.height + 2].some(val => val)) {
      return true
    }

    for (let x = this.width / 2 - 2; x < this.width / 2 + 2; x++) {
      if (this.grid[this.height][x] || this.grid[this.height + 1][x]) {
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
          this.tetrominoes.remove(item)
        }
      }
    }
  }
}
