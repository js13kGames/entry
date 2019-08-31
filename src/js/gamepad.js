
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

        console.log(`Gamepad connected at index ${pad.index}: ${pad.id}. ${pad.buttons.length} buttons, ${pad.axes.length} axes.`);
        gamepads[pad.index] = {
            id: pad.id,
            pressedButtons: [],
            buttons: pad.buttons,
            axes: []
        };
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

export function pollGamepads() {

    // if (!navigator.getGamepads) {
    //     console.warn('This browser does not support gamepads');
    //     return false;
    // }

    navigator.getGamepads().forEach(pad => {
        pad.buttons.forEach((button, i) => {
            if (button.pressed) {
               gamepads[pad.index].pressedButtons[i] = true;
           } else {
               gamepads[pad.index].pressedButtons[i] = false;
           }
        });
        pad.axes.forEach((axis, i) => {
            gamepads[pad.index].axes[i] = axis;
        });
    });

    if (gamepads[0] && gamepads[0].pressedButtons) {
        //console.log(gamepads[0].pressedButtons);
    }
}
