import directions from './directions';

export const getRand = function(max) {
    return Math.floor(Math.random() * Math.abs(max)); 
};

export const toRadians = function(angle) {
    return angle * (Math.PI / 180);
};

export const reverseDirection = function(dir) {
    switch(dir) {
        case directions.RIGHT:
            return directions.LEFT;
        case directions.LEFT:
            return directions.RIGHT;
        case directions.UP:
            return directions.DOWN;
        case directions.DOWN:
            return directions.UP;
    }
};
