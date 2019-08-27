
export default (scheme) => {
    if (typeof scheme === 'string') {
        switch (scheme.toLowerCase()) {
            case 'arrows':
                return {
                    thrust: 'up',
                    fire: 'space',
                    left: 'left',
                    right: 'right',
                    rewind: 'down'
                };
            case 'wasd':
                return {
                    thrust: 'w',
                    fire: 'z',
                    left: 'a',
                    right: 'd',
                    rewind: 's'
                };
            //default:
            //    console.error('Unknown control scheme');
        }
    }
}
