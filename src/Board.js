import { Tetromino } from './Tetrominoes/Tetromino';
import { Block } from './Tetrominoes/Block';

const wall = new Block(1)

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
    this.entities = new Set()
    this.tetrominoPositions = new Map()
  }

  isSolidAt (x, y) {
    return !!this.getItemAt(x, y)
  }

  getItemAt (x, y) {
    if (x < 0 || x >= this.width || y < 0) {
      return wall
    }
    return this.grid[y][x]
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
    for (let [x, y] of positions) {
      if (this.grid[y + this.height][x + this.width / 2 - 1]) {
        return true
      }
    }

    return false
  }

  putTetromino (tetromino) {
    let positions = []
    for (let [px, py] of tetromino.getBlockPositions()) {
      this.grid[py][px] = tetromino
      positions.push([px, py])
    }
    this.tetrominoPositions.set(tetromino, positions)
    this.tetrominoes.add(tetromino)
    this.entities.add(tetromino)
  }

  updateTetrominoPosition (tetromino) {
    const oldPositions = this.tetrominoPositions.get(tetromino)
    for (let [px, py] of oldPositions) {
      this.grid[py][px] = 0
    }
    this.putTetromino(tetromino)
  }

  removeTetromino (tetromino) {
    this.tetrominoes.delete(tetromino)
    this.entities.delete(tetromino)
    this.tetrominoPositions.delete(tetromino)
    for (let [px, py] of tetromino.getBlockPositions()) {
      this.grid[py][px] = 0
    }
  }

  clearRows (rows) {
    rows.sort((a, b) => a - b)

    let tetrominoesToMove = new Map()

    let index = 0
    for (let y = 0; y < this.heightWithMargin; y++) {
      if (y === rows[index]) {
        this.forEachItemInRow(y, item => {
          if (item instanceof Block) {
            this.entities.delete(item)
          }
        })
        index++
      }
      else {
        this.forEachItemInRow(y, item => {
          if (item instanceof Tetromino) {
            tetrominoesToMove.set(item, index)
          }
        })
        this.grid[y - index] = this.grid[y]
      }
    }

    for (let [tetromino, delta] of tetrominoesToMove) {
      tetromino.y -= delta
      this.putTetromino(tetromino)
    }

    for (let y = this.heightWithMargin - index; y < this.heightWithMargin; y++) {
      this.grid[y] = Array(this.width).fill(0)
    }
  }

  forEachItemInRow (y, callback) {
    for (let x = 0; x < this.width; x++) {
      const item = this.grid[y][x]
      if (item) callback(item)
    }
  }

  getTetrominoesInRows (rows) {
    let tetrominoes = new Set()
    for (let y of rows) {
      this.forEachItemInRow(y, item => {
        if (item instanceof Tetromino) {
          tetrominoes.add(item)
        }
      })
    }
    return tetrominoes
  }

  changeTetrominoesToBlocks (tetrominoes) {
    for (let tetromino of tetrominoes) {
      for (let [x, y] of tetromino.getBlockPositions()) {
        this.grid[y][x] = new Block(tetromino.getId())
        this.entities.add(this.grid[y][x])
      }
      this.tetrominoes.delete(tetromino)
      this.entities.delete(tetromino)
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
