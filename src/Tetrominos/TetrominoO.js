import { makeTetromino } from './Tetromino';
import { TETROMINO_O } from '../constants';

const config = [[0, 1], [1, 1], [0, 0], [1, 0]]
const blockPositions = [config, config, config, config]

const wallKicks = []

export const TetrominoO = makeTetromino(TETROMINO_O, blockPositions, wallKicks)
