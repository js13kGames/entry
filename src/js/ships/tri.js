
export default () => {
    return {
        name: 'tri',
        rof: 5,
        ror: 4,
        turnRate: 8,
        radius: 7,
        mass: 3,
        thrust: 9,
        ammo: 3,
        maxSpeed: 8,
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
