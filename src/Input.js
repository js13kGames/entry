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
  gamepadState: {},

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
      Input.gamepad = navigator.getGamepads()[Input.gamepad.index]

      function update(key, state) {
        if (state && !Input.gamepadState[key]) {
          Input.set(key)
          Input.gamepadState[key] = true
        }
        if (!state && Input.gamepadState[key]) {
          Input.unset(key)
          Input.gamepadState[key] = false
        }
      }
      update(MOVE_LEFT, Input.gamepad.axes[0] < -0.3 || Input.isPressed(14))
      update(MOVE_RIGHT, Input.gamepad.axes[0] > 0.3 || Input.isPressed(15))
      update(HARD_DROP, Input.gamepad.axes[1] < -0.3 || Input.isPressed(12))
      update(SOFT_DROP, Input.gamepad.axes[1] > 0.3 || Input.isPressed(13))
      update(ROTATE_CW, (
        Input.isPressed(1) ||
        Input.isPressed(3)
      ))
      update(ROTATE_CCW, (
        Input.isPressed(0) ||
        Input.isPressed(2)
      ))
      update(HOLD, (
        Input.isPressed(4) ||
        Input.isPressed(5) ||
        Input.isPressed(6) ||
        Input.isPressed(7)
      ))
      update(PAUSE, Input.isPressed(8) || Input.isPressed(9) || Input.isPressed(10))
    }
  },

  postUpdate () {
    Object.entries(Input.current).forEach(([key, value]) => { Input.previous[key] = value })
  },

  set (keyCode) {
    let target = INPUT_MAPPING[keyCode] || keyCode
    Input.previous[target] = Input.current[target]
    Input.current[target] = true
  },

  unset (keyCode) {
    let target = INPUT_MAPPING[keyCode] || keyCode
    Input.previous[target] = Input.current[target]
    Input.current[target] = false
  }
}

document.addEventListener('keydown', ({ repeat, keyCode }) => {
  if (repeat) {
    return
  }

  Input.set(keyCode)
}, false)

document.addEventListener('keyup', ({ keyCode }) => {
  Input.unset(keyCode)
}, false)

window.addEventListener('gamepadconnected', event => {
  if (!Input.gamepad) {
    // So that closure compiler recognizes it as an extern
    Input.gamepad = event['gamepad']
  }
})
