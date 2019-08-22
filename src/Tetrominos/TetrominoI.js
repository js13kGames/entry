import { makeTetromino } from './Tetromino';
import { TETROMINO_I } from '../constants';

const blockPositions = [
  [[-1, 0], [0, 0], [1, 0], [2, 0]],
  [[1, -1], [1, 0], [1, 1], [1, 2]],
  [[-1, 1], [0, 1], [1, 1], [2, 1]],
  [[0, -1], [0, 0], [0, 1], [0, 2]]
]

const wallKicks = [
  [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
  [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
  [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
  [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
]

export const TetrominoI = makeTetromino(TETROMINO_I, blockPositions, wallKicks)
