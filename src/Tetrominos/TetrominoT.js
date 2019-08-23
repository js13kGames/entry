import { makeTetromino } from './Tetromino';
import { commonWallKicks } from './common';
import { TETROMINO_T } from '../constants';

const blockPositions = [
  [[0, 0], [-1,  0], [ 0,  1], [ 1,  0]],
  [[0, 0], [ 0,  1], [ 1,  0], [ 0, -1]],
  [[0, 0], [ 1,  0], [ 0, -1], [-1,  0]],
  [[0, 0], [ 0, -1], [-1,  0], [ 0,  1]],
]

export const TetrominoT = makeTetromino(TETROMINO_T, blockPositions, commonWallKicks)
