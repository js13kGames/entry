import {
  KEY_LEFT,
  KEY_RIGHT,
  KEY_UP,
  KEY_DOWN,
  KEY_ROTATE_CCW,
  KEY_ROTATE_CW,
  KEY_HOLD
} from './constants'

export let Input = {
  current: {},
  previous: {},

  getKey (input) {
    return !!Input.current[input]
  },

  getKeyDown (input) {
    return !!Input.current[input] && !Input.previous[input]
  },

  getKeyUp (input) {
    return !Input.current[input] && !!Input.previous[input]
  },

  postUpdate () {
    [
      KEY_LEFT,
      KEY_RIGHT,
      KEY_UP,
      KEY_DOWN,
      KEY_ROTATE_CCW,
      KEY_ROTATE_CW,
      KEY_HOLD,
    ].forEach(key => {
      Input.previous[key] = Input.current[key]
    })
  }
}

document.addEventListener('keydown', ({ keyCode }) => {
  Input.previous[keyCode] = Input.current[keyCode]
  Input.current[keyCode] = true
}, false)

document.addEventListener('keyup', ({ keyCode }) => {
  Input.previous[keyCode] = Input.current[keyCode]
  Input.current[keyCode] = false
}, false)
