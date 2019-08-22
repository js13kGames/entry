import { makeTetromino } from './Tetromino';
import { commonWallKicks } from './common';
import { TETROMINO_L } from '../constants';

const blockPositions = [
  [[-1,  0], [0, 0], [1, 0], [ 1, -1]],
  [[ 0, -1], [0, 0], [0, 1], [ 1,  1]],
  [[-1,  0], [0, 0], [1, 0], [-1,  1]],
  [[ 0, -1], [0, 0], [0, 1], [-1, -1]]
]

export const TetrominoL = makeTetromino(TETROMINO_L, blockPositions, commonWallKicks)
