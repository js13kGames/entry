
export default () => {
    return {
        rof: .25,
        turnRate: 6,
        radius: 7,
        mass: 4,
        thrust: 5,
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
            ]
        }
    }
}
