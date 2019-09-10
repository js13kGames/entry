import dirs from './directions';

export const getRand = function(max) {
    return Math.floor(Math.random() * Math.abs(max)); 
};

export const toRadians = function(angle) {
    return angle * (Math.PI / 180);
};

export const reverseDirection = function(dir) {
    switch(dir) {
        case dirs.R:
            return dirs.L;
        case dirs.L:
            return dirs.R;
        case dirs.UP:
            return dirs.D;
        case dirs.D:
            return dirs.UP;
    }
};
