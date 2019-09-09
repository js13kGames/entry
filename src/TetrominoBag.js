import { TetrominoI } from './Tetrominoes/TetrominoI';
import { TetrominoL } from './Tetrominoes/TetrominoL';
import { TetrominoJ } from './Tetrominoes/TetrominoJ';
import { TetrominoT } from './Tetrominoes/TetrominoT';
import { TetrominoO } from './Tetrominoes/TetrominoO';
import { TetrominoS } from './Tetrominoes/TetrominoS';
import { TetrominoZ } from './Tetrominoes/TetrominoZ';

export class TetrominoBag {
  constructor () {
    this.tetrominoes = [TetrominoI, TetrominoL, TetrominoJ, TetrominoT, TetrominoO, TetrominoS, TetrominoZ]
    for (let i = 6; i > 1; i--) {
      let j = 0|(Math.random() * (i + 1))
      let temp = this.tetrominoes[j]
      this.tetrominoes[j] = this.tetrominoes[i]
      this.tetrominoes[i] = temp
    }
  }

  pick () {
    return this.tetrominoes.pop()
  }
}
