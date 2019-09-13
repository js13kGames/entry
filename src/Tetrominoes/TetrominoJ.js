import { makeTetromino } from './Tetromino';
import { commonWallKicks } from './common';
import { TETROMINO_J } from '../constants';

const blockPositions = [
  [[-1, 0], [0, 0], [1,  0], [-1,  1]],
  [[ 0, 1], [0, 0], [0, -1], [ 1,  1]],
  [[-1, 0], [0, 0], [1,  0], [ 1, -1]],
  [[ 0, 1], [0, 0], [0, -1], [-1, -1]]
]

export const TetrominoJ = makeTetromino(TETROMINO_J, blockPositions, commonWallKicks)
