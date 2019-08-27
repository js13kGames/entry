// Input
export const MOVE_LEFT = 37 // left
export const MOVE_RIGHT = 39 // right
export const HARD_DROP = 32 // space
export const SOFT_DROP = 40 // down
export const ROTATE_CCW = 90 // X
export const ROTATE_CW = 88 // Z
export const HOLD = 16 // shift
export const INPUT_MAPPING = {
  38: ROTATE_CW, // up
  67: HOLD, // C
  17: ROTATE_CCW // Ctrl
}

export const TETROMINO_I = 1
export const TETROMINO_J = 2
export const TETROMINO_L = 3
export const TETROMINO_O = 4
export const TETROMINO_S = 5
export const TETROMINO_T = 6
export const TETROMINO_Z = 7

export const COLORS = [
  ,
  '#0ff',
  '#00f',
  '#f80',
  '#ff0',
  '#0f0',
  '#909',
  '#f00',
]

export const TILE_SIZE = 16

export const AUTO_SHIFT_DELAY = 12
export const AUTO_REPEAT_DELAY = 2
export const LOCK_DELAY = 30
export const MAX_LOCK_RESET_COUNT = 14

export const ACTION_SHIFT = 0
export const ACTION_ROTATE = 1

export const T_SPIN_MINI = 1
export const T_SPIN = 2
