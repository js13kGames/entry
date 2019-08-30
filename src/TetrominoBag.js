import { TetrominoI } from './Tetrominos/TetrominoI';
import { TetrominoL } from './Tetrominos/TetrominoL';
import { TetrominoJ } from './Tetrominos/TetrominoJ';
import { TetrominoT } from './Tetrominos/TetrominoT';
import { TetrominoO } from './Tetrominos/TetrominoO';
import { TetrominoS } from './Tetrominos/TetrominoS';
import { TetrominoZ } from './Tetrominos/TetrominoZ';

export class TetrominoBag {
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
