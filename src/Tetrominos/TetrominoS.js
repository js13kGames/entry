import { makeTetromino } from './Tetromino';
import { commonWallKicks } from './common';
import { TETROMINO_S } from '../constants';

const blockPositions = [
  [[-1,  0], [0, 0], [ 0, -1], [ 1, -1]],
  [[ 0, -1], [0, 0], [ 1,  0], [ 1,  1]],
  [[ 1,  0], [0, 0], [ 0,  1], [-1,  1]],
  [[ 0,  1], [0, 0], [-1,  0], [-1, -1]],
]

export const TetrominoS = makeTetromino(TETROMINO_S, blockPositions, commonWallKicks)
