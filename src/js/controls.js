import { keyPressed } from 'kontra';
import { buttonPressed, axisValue } from './gamepad';

export default (scheme, gamepadIndex) => {
    if (typeof scheme === 'string') {
        switch (scheme.toLowerCase()) {
            case 'arrows':
                return {
                    thrust: () => keyPressed('up'),
                    fire:   () => keyPressed('space'),
                    left:   () => keyPressed('left'),
                    right:  () => keyPressed('right'),
                    rewind: () => keyPressed('down'),
                    up:     () => keyPressed('up'),
                    down:   () => keyPressed('down'),
                    accept: () => keyPressed('space'),
                    back:   () => keyPressed('esc'),
                };
            case 'wasd/zqsd':
                return {
                    thrust: () => keyPressed('w') || keyPressed('z'),
                    fire:   () => keyPressed('e'),
                    left:   () => keyPressed('a') || keyPressed('q'),
                    right:  () => keyPressed('d'),
                    rewind: () => keyPressed('s'),
                    up:     () => keyPressed('w'),
                    down:   () => keyPressed('s'),
                    accept: () => keyPressed('e'),
                    back:   () => keyPressed('x'),
                };
            case 'gamepad':
                return {
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
            //default:
            //    console.error('Unknown control scheme');
        }
    }
}
