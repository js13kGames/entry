
let browserGamepads = []; // Actually an object in Chrome hrmm

export function buttonPressed(gamepadIndex, button) {
    if (!window.gamepads[gamepadIndex]) {
        return false;
    }
    return !!window.gamepads[gamepadIndex].pressedButtons[button];
}

export function axisValue(gamepadIndex, axesIndex) {
    if (!window.gamepads[gamepadIndex]) {
        return false;
    }
    return window.gamepads[gamepadIndex].axes[axesIndex];
}

function getKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

export function pollGamepads(game) {

    browserGamepads = navigator.getGamepads();

    Array.prototype.forEach.call(browserGamepads, pad => {
        if (!pad) {
            return;
        }
        var gamepad = window.gamepads[pad.index];
        pad.buttons.forEach((button, i) => {
            let mappedKey = getKeyByValue(gamepad.buttonMap, i);
            if (button.pressed) {
                if (mappedKey) {
                    gamepad.pressedButtons[mappedKey] = true;
                } else {
                    gamepad.pressedButtons[i] = true;
                }
           } else {
               if (mappedKey) {
                   gamepad.pressedButtons[mappedKey] = false;
               } else {
                   gamepad.pressedButtons[i] = false;
               }
           }
        });
        pad.axes.forEach((axis, i) => {
            let mappedAxis = getKeyByValue(gamepad.axesMap, i);
            if (mappedAxis) {
                gamepad.axes[mappedAxis] = axis;
            } else {
                gamepad.axes[i] = axis;
            }
        });
    });

    // if (gamepads[0] && gamepads[0].pressedButtons) {
    //     console.log(gamepads[0].pressedButtons);
    // }
}
