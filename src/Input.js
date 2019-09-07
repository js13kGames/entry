import {
  MOVE_LEFT,
  MOVE_RIGHT,
  HARD_DROP,
  SOFT_DROP,
  ROTATE_CCW,
  ROTATE_CW,
  HOLD,
  INPUT_MAPPING,
  PAUSE
} from './constants'

export let Input = {
  current: {},
  previous: {},
  gamepad: null,

  reset () {
    Input.current = {}
    Input.previous = {}
  },

  isPressed (button) {
    return Input.gamepad.buttons[button].pressed
  },

  getAnyKey () {
    return Object.values(Input.current).some(val => val)
  },

  getNoKeyPress () {
    return Object.values(Input.current).every(val => !val)
  },

  getKey (input) {
    return !!Input.current[input]
  },

  getKeyDown (input) {
    return !!Input.current[input] && !Input.previous[input]
  },

  getKeyUp (input) {
    return !Input.current[input] && !!Input.previous[input]
  },

  preUpdate () {
    if (Input.gamepad) {
      Input.current[MOVE_LEFT] = Input.gamepad.axes[0] < -0.3 || Input.isPressed(14)
      Input.current[MOVE_RIGHT] = Input.gamepad.axes[0] > 0.3 || Input.isPressed(15)
      Input.current[HARD_DROP] = Input.gamepad.axes[1] < -0.3 || Input.isPressed(12)
      Input.current[SOFT_DROP] = Input.gamepad.axes[1] > 0.3 || Input.isPressed(13)
      Input.current[ROTATE_CW] = (
        Input.isPressed(1) ||
        Input.isPressed(3)
      )
      Input.current[ROTATE_CCW] = (
        Input.isPressed(0) ||
        Input.isPressed(2)
      )
      Input.current[HOLD] = (
        Input.isPressed(4) ||
        Input.isPressed(5) ||
        Input.isPressed(6) ||
        Input.isPressed(7)
      )
    }
  },

  postUpdate () {
    Object.entries(Input.current).forEach(([key, value]) => { Input.previous[key] = value })
  }
}

document.addEventListener('keydown', ({ repeat, keyCode }) => {
  if (repeat) {
    return
  }

  let target = INPUT_MAPPING[keyCode] || keyCode
  Input.previous[target] = Input.current[target]
  Input.current[target] = true
}, false)

document.addEventListener('keyup', ({ keyCode }) => {
  let target = INPUT_MAPPING[keyCode] || keyCode
  Input.previous[target] = Input.current[target]
  Input.current[target] = false
}, false)

window.addEventListener('gamepadconnected', event => {
  if (!Input.gamepad) {
    // So that closure compiler recognizes it as an extern
    Input.gamepad = event['gamepad']
  }
})
