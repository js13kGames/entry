import { keyPressed } from 'kontra';
import { buttonPressed, axisValue } from './gamepad';

const schemes = {
    arrows: {
        thrust: () => keyPressed('up'),
        fire:   () => keyPressed('space'),
        left:   () => keyPressed('left'),
        right:  () => keyPressed('right'),
        rewind: () => keyPressed('down'),
        up:     () => keyPressed('up'),
        down:   () => keyPressed('down'),
        accept: () => keyPressed('space'),
        back:   () => keyPressed('esc'),
    },
    wasd: {
        thrust: () => keyPressed('w'),
        fire:   () => keyPressed('e'),
        left:   () => keyPressed('a'),
        right:  () => keyPressed('d'),
        rewind: () => keyPressed('s'),
        up:     () => keyPressed('w'),
        down:   () => keyPressed('s'),
        accept: () => keyPressed('e'),
        back:   () => keyPressed('q'),
    },
    gamepad: {
        thrust: () => buttonPressed(gamepadIndex, 'a'),
        fire:   () => buttonPressed(gamepadIndex, 'r'),
        left:   () => axisValue(gamepadIndex, 'x') < 0,
        right:  () => axisValue(gamepadIndex, 'x') > 0,
        rewind: () => buttonPressed(gamepadIndex, 'l'),
        up:     () => axisValue(gamepadIndex, 'y') < 0,
        down:   () => axisValue(gamepadIndex, 'y') > 0,
        accept: () => buttonPressed(gamepadIndex, 'a'),
        back:   () => buttonPressed(gamepadIndex, 'b'),
    }
}

export function schemeNames() {
    return Object.keys(schemes);
}

export { schemes };

export default (schemeName, gamepadIndex) => {
    if (typeof schemeName === 'string') {
        return schemes[schemeName];
    }
}
