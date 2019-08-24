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
  gamepad: null,

  isPressed (button) {
    return Input.gamepad.buttons[button].pressed
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
      Input.current[KEY_LEFT] = Input.gamepad.axes[0] < -0.3 || Input.isPressed(14)
      Input.current[KEY_RIGHT] = Input.gamepad.axes[0] > 0.3 || Input.isPressed(15)
      Input.current[KEY_UP] = Input.gamepad.axes[1] < -0.3 || Input.isPressed(12)
      Input.current[KEY_DOWN] = Input.gamepad.axes[1] > 0.3 || Input.isPressed(13)
      Input.current[KEY_ROTATE_CW] = (
        Input.isPressed(1) ||
        Input.isPressed(3)
      )
      Input.current[KEY_ROTATE_CCW] = (
        Input.isPressed(0) ||
        Input.isPressed(2)
      )
      Input.current[KEY_HOLD] = (
        Input.isPressed(4) ||
        Input.isPressed(5) ||
        Input.isPressed(6) ||
        Input.isPressed(7)
      )
    }
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

window.addEventListener('gamepadconnected', event => {
  if (!Input.gamepad) {
    // So that closure compiler recognizes it as an extern
    Input.gamepad = event['gamepad']
  }
})
