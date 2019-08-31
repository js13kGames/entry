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
                    rewind: () => keyPressed('down')
                };
            case 'wasd':
                return {
                    thrust: () => keyPressed('w'),
                    fire:   () => keyPressed('z'),
                    left:   () => keyPressed('a'),
                    right:  () => keyPressed('d'),
                    rewind: () => keyPressed('s')
                };
            case 'gamepad':
                return {
                    thrust: () => buttonPressed(gamepadIndex, 'a'),
                    fire:   () => buttonPressed(gamepadIndex, 'r'),
                    left:   () => axisValue(gamepadIndex, 'x') < 0,
                    right:  () => axisValue(gamepadIndex, 'x') > 0,
                    rewind: () => buttonPressed(gamepadIndex, 'l')
                }
            //default:
            //    console.error('Unknown control scheme');
        }
    }
}
