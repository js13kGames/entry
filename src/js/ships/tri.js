
export default () => {
    return {
        name: 'tri',
        rof: 5,
        turnRate: 9,
        radius: 7,
        mass: 0,
        thrust: 9,
        lines: {
            body: [
                [ -6, -5,  7,  0 ],
                [  7,  0, -6,  5 ],
                [ -6,  5, -4,  0 ],
                [ -4,  0, -6, -5 ]
            ],
            thrust: [
                [ -5, -2, -8,  0 ],
                [ -8,  0, -5,  2 ]
            ],
            hitbox: [
                [ -6, -5 ],
                [  7,  0 ],
                [ -6,  5 ]
            ]
        }
    }
}
