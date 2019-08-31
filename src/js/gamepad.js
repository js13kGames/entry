
let gamepads = {};

export function initGamepads() {

    // Existing gamepad connections (not working? Or never connected?..)
    navigator.getGamepads().forEach(pad => {
        console.log(`Gamepad already connected at index ${pad.index}: ${pad.id}. ${pad.buttons.length} buttons, ${pad.axes.length} axes.`);
        gamepads[pad.index] = {
            id: pad.id,
            pressedButtons: [],
            buttons: pad.buttons,
            axes: []
        }
    });

    // Event when new gamepads get connected
    window.addEventListener('gamepadconnected', function(e) {
        let pad = e.gamepad;

        //console.log(`Gamepad connected at index ${pad.index}: ${pad.id}. ${pad.buttons.length} buttons, ${pad.axes.length} axes.`);
        gamepads[pad.index] = {
            id: pad.id,
            pressedButtons: {},
            axes: {}
        };
        if (pad.id.indexOf('Joy-Con') > -1) {
            gamepads[pad.index].buttonMap = {
                'a': 1,
                'b': 0,
                'x': 3,
                'y': 2,
                'l': 4,
                'r': 5
            };
            gamepads[pad.index].axesMap = {
                'x': 4,
                'y': 5
            };
        }
    });
}

export function buttonPressed(gamepadIndex, button) {
    if (!gamepads[gamepadIndex]) {
        return false;
    }
    return !!gamepads[gamepadIndex].pressedButtons[button];
}

export function axisValue(gamepadIndex, axesIndex) {
    if (!gamepads[gamepadIndex]) {
        return false;
    }
    return gamepads[gamepadIndex].axes[axesIndex];
}

function getKeyByValue(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}

export function pollGamepads() {

    // if (!navigator.getGamepads) {
    //     console.warn('This browser does not support gamepads');
    //     return false;
    // }

    navigator.getGamepads().forEach(pad => {
        var gamepad = gamepads[pad.index];
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
