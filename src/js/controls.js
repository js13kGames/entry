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
            case 'joycon':
                return {
                    thrust: () => buttonPressed(gamepadIndex, '3'),
                    fire:   () => buttonPressed(gamepadIndex, '5'),
                    left:   () => axisValue(gamepadIndex, 4) < 0,
                    right:  () => axisValue(gamepadIndex, 4) > 0,
                    rewind: () => buttonPressed(gamepadIndex, '4')
                }
            //default:
            //    console.error('Unknown control scheme');
        }
    }
}
